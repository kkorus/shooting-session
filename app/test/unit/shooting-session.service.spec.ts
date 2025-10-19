import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { instance, mock, resetCalls, verify, when, anyString, anything, deepEqual } from '@johanblumenberg/ts-mockito';

import { ShootingSessionService } from '../../src/shooting-session/services';
import { SessionRepository, UserRepository, SessionEventRepository } from '../../src/data-access-layer/repositories';
import { Session, SessionEvent } from '../../src/data-access-layer';
import { SessionEventType, SessionMode } from '../../src/const';

describe('ShootingSessionService', () => {
  let service: ShootingSessionService;
  let mockUserRepository: UserRepository;
  let mockSessionRepository: SessionRepository;
  let mockSessionEventRepository: SessionEventRepository;

  beforeEach(async () => {
    mockUserRepository = mock(UserRepository);
    mockSessionRepository = mock(SessionRepository);
    mockSessionEventRepository = mock(SessionEventRepository);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShootingSessionService,
        {
          provide: UserRepository,
          useValue: instance(mockUserRepository),
        },
        {
          provide: SessionRepository,
          useValue: instance(mockSessionRepository),
        },
        {
          provide: SessionEventRepository,
          useValue: instance(mockSessionEventRepository),
        },
      ],
    }).compile();

    service = module.get<ShootingSessionService>(ShootingSessionService);
  });

  afterEach(() => {
    resetCalls(mockUserRepository);
    resetCalls(mockSessionRepository);
    resetCalls(mockSessionEventRepository);
    jest.useRealTimers();
    jest.clearAllTimers();
  });

  describe('closeSession', () => {
    const sessionId = 'session-id';
    const playerId = 'player-id';
    const otherPlayerId = 'other-player-id';

    it('should successfully close session and calculate score', async () => {
      // given
      const finishAt = new Date('2024-01-15T10:30:00.000Z');
      jest.useFakeTimers();
      jest.setSystemTime(finishAt);

      const session: Session = {
        id: sessionId,
        playerId,
        mode: SessionMode.ARCADE,
        createdAt: new Date(),
        startedAt: new Date(),
        finishedAt: null,
        score: null,
      } as Session;

      const sessionEvents: SessionEvent[] = [
        {
          id: '1',
          sessionId,
          type: SessionEventType.SHOT,
          ts: new Date(),
          createdAt: new Date(),
          hit: true,
          distance: 15,
        } as SessionEvent,
        {
          id: '2',
          sessionId,
          type: SessionEventType.SHOT,
          ts: new Date(),
          createdAt: new Date(),
          hit: true,
          distance: 5,
        } as SessionEvent,
        {
          id: '3',
          sessionId,
          type: SessionEventType.SHOT,
          ts: new Date(),
          createdAt: new Date(),
          hit: false,
          distance: 10,
        } as SessionEvent,
        {
          id: '4',
          sessionId,
          type: SessionEventType.SHOT,
          ts: new Date(),
          createdAt: new Date(),
          hit: true,
          distance: 20,
        } as SessionEvent,
      ];

      when(mockSessionRepository.getById(sessionId)).thenResolve(session);
      when(
        mockSessionEventRepository.getSessionEvents(
          sessionId,
          SessionEventType.SHOT,
          deepEqual({ hit: true, distance: true }),
        ),
      ).thenResolve(sessionEvents);

      // when
      await service.closeSession(sessionId, playerId);

      // then
      verify(mockSessionRepository.getById(sessionId)).once();
      verify(
        mockSessionEventRepository.getSessionEvents(
          sessionId,
          SessionEventType.SHOT,
          deepEqual({ hit: true, distance: true }),
        ),
      ).once();
      verify(mockSessionRepository.update(sessionId, deepEqual({ finishedAt: finishAt, score: 40 }))).once();
    });

    it('should throw NotFoundException when session does not exist', async () => {
      // given
      when(mockSessionRepository.getById(sessionId)).thenResolve(null);

      // when & then
      await expect(service.closeSession(sessionId, playerId)).rejects.toThrow(NotFoundException);

      verify(mockSessionRepository.getById(sessionId)).once();
      verify(mockSessionEventRepository.getSessionEvents(anyString(), anything(), anything())).never();
      verify(mockSessionRepository.update(anyString(), anything())).never();
    });

    it('should throw ForbiddenException when player is not authorized', async () => {
      // given
      const mockSession: Session = {
        id: sessionId,
        playerId: otherPlayerId,
        mode: SessionMode.ARCADE,
        createdAt: new Date(),
        startedAt: new Date(),
        finishedAt: null,
        score: null,
      } as Session;

      when(mockSessionRepository.getById(sessionId)).thenResolve(mockSession);

      // when & then
      await expect(service.closeSession(sessionId, playerId)).rejects.toThrow(ForbiddenException);

      verify(mockSessionRepository.getById(sessionId)).once();
      verify(mockSessionEventRepository.getSessionEvents(anyString(), anything(), anything())).never();
      verify(mockSessionRepository.update(anyString(), anything())).never();
    });

    it('should throw BadRequestException when session is already closed', async () => {
      // given
      const mockSession: Session = {
        id: sessionId,
        playerId,
        mode: SessionMode.ARCADE,
        createdAt: new Date(),
        startedAt: new Date(),
        finishedAt: new Date(),
        score: 100,
      } as Session;

      when(mockSessionRepository.getById(sessionId)).thenResolve(mockSession);

      // when & then
      await expect(service.closeSession(sessionId, playerId)).rejects.toThrow(BadRequestException);

      verify(mockSessionRepository.getById(sessionId)).once();
      verify(mockSessionEventRepository.getSessionEvents(anyString(), anything(), anything())).never();
      verify(mockSessionRepository.update(anyString(), anything())).never();
    });

    it('should calculate correct score for hits with distance bonus', async () => {
      // given
      const finishAt = new Date('2024-01-15T10:30:00.000Z');
      jest.useFakeTimers();
      jest.setSystemTime(finishAt);

      const mockSession: Session = {
        id: sessionId,
        playerId,
        mode: SessionMode.ARCADE,
        createdAt: new Date(),
        startedAt: new Date(),
        finishedAt: null,
        score: null,
      } as Session;

      const mockSessionEvents: SessionEvent[] = [
        {
          id: '1',
          sessionId,
          type: SessionEventType.SHOT,
          ts: new Date(),
          createdAt: new Date(),
          hit: true,
          distance: 15,
        } as SessionEvent,
        {
          id: '2',
          sessionId,
          type: SessionEventType.SHOT,
          ts: new Date(),
          createdAt: new Date(),
          hit: true,
          distance: 5,
        } as SessionEvent,
        {
          id: '3',
          sessionId,
          type: SessionEventType.SHOT,
          ts: new Date(),
          createdAt: new Date(),
          hit: true,
          distance: 20,
        } as SessionEvent,
      ];

      when(mockSessionRepository.getById(sessionId)).thenResolve(mockSession);
      when(
        mockSessionEventRepository.getSessionEvents(
          sessionId,
          SessionEventType.SHOT,
          deepEqual({ hit: true, distance: true }),
        ),
      ).thenResolve(mockSessionEvents);

      // when
      await service.closeSession(sessionId, playerId);

      // then
      verify(mockSessionRepository.getById(sessionId)).once();
      verify(
        mockSessionEventRepository.getSessionEvents(
          sessionId,
          SessionEventType.SHOT,
          deepEqual({ hit: true, distance: true }),
        ),
      ).once();
      verify(mockSessionRepository.update(sessionId, deepEqual({ finishedAt: finishAt, score: 45 }))).once();
    });

    it('should calculate correct score with combo bonus', async () => {
      // given
      const finishAt = new Date('2024-01-15T10:30:00.000Z');
      jest.useFakeTimers();
      jest.setSystemTime(finishAt);

      const mockSession: Session = {
        id: sessionId,
        playerId,
        mode: SessionMode.ARCADE,
        createdAt: new Date(),
        startedAt: new Date(),
        finishedAt: null,
        score: null,
      } as Session;

      const mockSessionEvents: SessionEvent[] = [
        {
          id: '1',
          sessionId,
          type: SessionEventType.SHOT,
          ts: new Date(),
          createdAt: new Date(),
          hit: true,
          distance: 5,
        } as SessionEvent,
        {
          id: '2',
          sessionId,
          type: SessionEventType.SHOT,
          ts: new Date(),
          createdAt: new Date(),
          hit: true,
          distance: 5,
        } as SessionEvent,
        {
          id: '3',
          sessionId,
          type: SessionEventType.SHOT,
          ts: new Date(),
          createdAt: new Date(),
          hit: true,
          distance: 5,
        } as SessionEvent,
      ];

      when(mockSessionRepository.getById(sessionId)).thenResolve(mockSession);
      when(
        mockSessionEventRepository.getSessionEvents(
          sessionId,
          SessionEventType.SHOT,
          deepEqual({ hit: true, distance: true }),
        ),
      ).thenResolve(mockSessionEvents);

      // when
      await service.closeSession(sessionId, playerId);

      // then
      verify(mockSessionRepository.getById(sessionId)).once();
      verify(
        mockSessionEventRepository.getSessionEvents(
          sessionId,
          SessionEventType.SHOT,
          deepEqual({ hit: true, distance: true }),
        ),
      ).once();
      verify(mockSessionRepository.update(sessionId, deepEqual({ finishedAt: finishAt, score: 35 }))).once();
    });

    it('should handle empty session events', async () => {
      // given
      const finishAt = new Date('2024-01-15T10:30:00.000Z');
      jest.useFakeTimers();
      jest.setSystemTime(finishAt);

      const mockSession: Session = {
        id: sessionId,
        playerId,
        mode: SessionMode.ARCADE,
        createdAt: new Date(),
        startedAt: new Date(),
        finishedAt: null,
        score: null,
      } as Session;

      when(mockSessionRepository.getById(sessionId)).thenResolve(mockSession);
      when(
        mockSessionEventRepository.getSessionEvents(
          sessionId,
          SessionEventType.SHOT,
          deepEqual({ hit: true, distance: true }),
        ),
      ).thenResolve([]);

      // when
      await service.closeSession(sessionId, playerId);

      // then
      verify(mockSessionRepository.getById(sessionId)).once();
      verify(
        mockSessionEventRepository.getSessionEvents(
          sessionId,
          SessionEventType.SHOT,
          deepEqual({ hit: true, distance: true }),
        ),
      ).once();
      verify(mockSessionRepository.update(sessionId, deepEqual({ finishedAt: finishAt, score: 0 }))).once();
    });
  });
});
