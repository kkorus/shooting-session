import request, { SuperAgentTest } from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { AppModule } from '../../src/app.module';
import jwt from 'jsonwebtoken';
import { DataSource } from 'typeorm';
import { getDataSourceToken } from '@nestjs/typeorm';
import { Session } from '../../src/data-access-layer';
import { SessionEventType, SessionMode } from '../../src/const';

describe('Shooting Session - Integration Test', () => {
  let app: INestApplication;
  let http: SuperAgentTest;
  let db: StartedPostgreSqlContainer;
  let dataSource: DataSource;

  const playerId = '123e4567-e89b-12d3-a456-426614174000';
  const mint = (playerId: string): string => jwt.sign({ playerId }, process.env['JWT_SECRET']!, { expiresIn: '1d' });
  const auth = (): string => `Bearer ${mint(playerId)}`;

  beforeAll(async () => {
    db = await new PostgreSqlContainer('postgres:15-alpine')
      .withDatabase('shooting-session')
      .withUsername('shooting-session-user')
      .withPassword('shooting-session-password')
      .start();

    const connectionUri = db.getConnectionUri();
    process.env.DATABASE_URL = connectionUri;

    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
    await app.init();

    http = request(app.getHttpServer());
    dataSource = moduleRef.get<DataSource>(getDataSourceToken());

    await dataSource.synchronize();

    await dataSource.query(`INSERT INTO "users" (id, email, "createdAt") VALUES ($1, $2, NOW())`, [
      playerId,
      'player1-integration-test@shooting-session.com',
    ]);
  }, 60_000);

  afterAll(async () => {
    if (app) {
      await app.close();
    }
    if (db) {
      await db.stop();
    }
    if (dataSource?.isInitialized) {
      await dataSource.destroy();
    }
  });

  it('should complete a full shooting session workflow', async () => {
    // start a new session
    const startResponse = await http.post('/shooting-sessions').set('Authorization', auth()).send({ mode: SessionMode.ARCADE });
    expect(startResponse.status).toBe(201);

    const sessionId = startResponse.body.sessionId;

    const sessions = await dataSource.query(`SELECT id FROM sessions WHERE id = $1 AND "playerId" = $2`, [
      sessionId,
      playerId,
    ]);
    expect(sessions.length).toBe(1);

    // add shot events
    const shotEvents = [
      { hit: true, distance: 5 },
      { hit: true, distance: 15 },
      { hit: true, distance: 20 },
      { hit: false, distance: 0 },
      { hit: true, distance: 8 },
    ];

    for (const shotEvent of shotEvents) {
      await http
        .post(`/shooting-sessions/${sessionId}/events`)
        .set('Authorization', auth())
        .send({
          type: SessionEventType.SHOT,
          timestamp: new Date().toISOString(),
          payload: shotEvent,
        })
        .expect(201);
    }

    // close the session
    await http.put(`/shooting-sessions/${sessionId}/finish`).set('Authorization', auth()).expect(200);

    const sessionResponse = await http.get(`/shooting-sessions/${sessionId}`).set('Authorization', auth()).expect(200);

    expect(sessionResponse.body.id).toBe(sessionId);
    expect(sessionResponse.body.playerId).toBe(playerId);
    expect(sessionResponse.body.mode).toBe(SessionMode.ARCADE);
    expect(sessionResponse.body.score).toBe(55);
    expect(sessionResponse.body.finishedAt).not.toBeNull();

    // get the leaderboard
    const leaderboardResponse = await http
      .get('/shooting-sessions/leaderboard')
      .query({ mode: SessionMode.ARCADE, limit: 10 })
      .set('Authorization', auth())
      .expect(200);

    expect(Array.isArray(leaderboardResponse.body)).toBe(true);
    expect(leaderboardResponse.body.length).toBeGreaterThan(0);

    const sessionInLeaderboard = leaderboardResponse.body.find((s: Session) => s.id === sessionId);
    expect(sessionInLeaderboard).toBeDefined();
    expect(sessionInLeaderboard.score).toBe(55);
  });
});
