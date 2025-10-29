import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { instance, mock, resetCalls, verify, when, anyString, anything, deepEqual } from '@johanblumenberg/ts-mockito';
import { 
  SessionNotFoundError, 
  SessionNotOwnedByPlayerError, 
  SessionAlreadyClosedError 
} from '../../src/domain/exceptions';

import { ShootingSessionService } from '../../src/shooting-session/services';
import { Session, SessionEvent } from '../../src/domain/entities';
import { SessionEventType, SessionMode } from '../../src/const';
import { IUserRepository, ISessionRepository, ISessionEventRepository } from '../../src/domain/repositories';
import { UserRepository, SessionRepository, SessionEventRepository } from '../../src/data-access-layer/repositories';

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
          provide: IUserRepository,
          useValue: instance(mockUserRepository),
        },
        {
          provide: ISessionRepository,
          useValue: instance(mockSessionRepository),
        },
        {
          provide: ISessionEventRepository,
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

      const session = Session.reconstitute(sessionId, playerId, SessionMode.ARCADE, new Date(), null, null);

      const sessionEvents: SessionEvent[] = [
        SessionEvent.reconstitute(
          '1',
          sessionId,
          SessionEventType.SHOT,
          new Date(),
          { hit: true, distance: 15 },
          new Date(),
        ),
        SessionEvent.reconstitute(
          '2',
          sessionId,
          SessionEventType.SHOT,
          new Date(),
          { hit: true, distance: 5 },
          new Date(),
        ),
        SessionEvent.reconstitute(
          '3',
          sessionId,
          SessionEventType.SHOT,
          new Date(),
          { hit: false, distance: 10 },
          new Date(),
        ),
        SessionEvent.reconstitute(
          '4',
          sessionId,
          SessionEventType.SHOT,
          new Date(),
          { hit: true, distance: 20 },
          new Date(),
        ),
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
      verify(mockSessionRepository.save(anything())).once();
    });

    it('should throw SessionNotFoundError when session does not exist', async () => {
      // given
      when(mockSessionRepository.getById(sessionId)).thenResolve(null);

      // when & then
      await expect(service.closeSession(sessionId, playerId)).rejects.toThrow(SessionNotFoundError);

      verify(mockSessionRepository.getById(sessionId)).once();
      verify(mockSessionEventRepository.getSessionEvents(anyString(), anything(), anything())).never();
      verify(mockSessionRepository.save(anything())).never();
    });

    it('should throw SessionNotOwnedByPlayerError when player is not authorized', async () => {
      // given
      const mockSession = Session.reconstitute(sessionId, otherPlayerId, SessionMode.ARCADE, new Date(), null, null);

      when(mockSessionRepository.getById(sessionId)).thenResolve(mockSession);

      // when & then
      await expect(service.closeSession(sessionId, playerId)).rejects.toThrow(SessionNotOwnedByPlayerError);

      verify(mockSessionRepository.getById(sessionId)).once();
      verify(mockSessionEventRepository.getSessionEvents(anyString(), anything(), anything())).never();
      verify(mockSessionRepository.save(anything())).never();
    });

    it('should throw SessionAlreadyClosedError when session is already closed', async () => {
      // given
      const mockSession = Session.reconstitute(sessionId, playerId, SessionMode.ARCADE, new Date(), new Date(), 100);

      when(mockSessionRepository.getById(sessionId)).thenResolve(mockSession);

      // when & then
      await expect(service.closeSession(sessionId, playerId)).rejects.toThrow(SessionAlreadyClosedError);

      verify(mockSessionRepository.getById(sessionId)).once();
      verify(mockSessionEventRepository.getSessionEvents(anyString(), anything(), anything())).never();
      verify(mockSessionRepository.save(anything())).never();
    });

    it('should calculate correct score for hits with distance bonus', async () => {
      // given
      const finishAt = new Date('2024-01-15T10:30:00.000Z');
      jest.useFakeTimers();
      jest.setSystemTime(finishAt);

      const mockSession = Session.reconstitute(sessionId, playerId, SessionMode.ARCADE, new Date(), null, null);

      const mockSessionEvents: SessionEvent[] = [
        SessionEvent.reconstitute(
          '1',
          sessionId,
          SessionEventType.SHOT,
          new Date(),
          { hit: true, distance: 15 },
          new Date(),
        ),
        SessionEvent.reconstitute(
          '2',
          sessionId,
          SessionEventType.SHOT,
          new Date(),
          { hit: true, distance: 5 },
          new Date(),
        ),
        SessionEvent.reconstitute(
          '3',
          sessionId,
          SessionEventType.SHOT,
          new Date(),
          { hit: true, distance: 20 },
          new Date(),
        ),
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
      verify(mockSessionRepository.save(anything())).once();
    });

    it('should calculate correct score with combo bonus', async () => {
      // given
      const finishAt = new Date('2024-01-15T10:30:00.000Z');
      jest.useFakeTimers();
      jest.setSystemTime(finishAt);

      const mockSession = Session.reconstitute(sessionId, playerId, SessionMode.ARCADE, new Date(), null, null);

      const mockSessionEvents: SessionEvent[] = [
        SessionEvent.reconstitute(
          '1',
          sessionId,
          SessionEventType.SHOT,
          new Date(),
          { hit: true, distance: 5 },
          new Date(),
        ),
        SessionEvent.reconstitute(
          '2',
          sessionId,
          SessionEventType.SHOT,
          new Date(),
          { hit: true, distance: 5 },
          new Date(),
        ),
        SessionEvent.reconstitute(
          '3',
          sessionId,
          SessionEventType.SHOT,
          new Date(),
          { hit: true, distance: 5 },
          new Date(),
        ),
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
      verify(mockSessionRepository.save(anything())).once();
    });

    it('should handle empty session events', async () => {
      // given
      const finishAt = new Date('2024-01-15T10:30:00.000Z');
      jest.useFakeTimers();
      jest.setSystemTime(finishAt);

      const mockSession = Session.reconstitute(sessionId, playerId, SessionMode.ARCADE, new Date(), null, null);

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
      verify(mockSessionRepository.save(anything())).once();
    });
  });
});
