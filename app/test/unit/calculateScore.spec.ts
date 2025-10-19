import { calculateScore, Shot } from '../../src/shooting-session/helpers/calculateScore';

describe('calculateScore', () => {
  it('should return 10 points for a hit', () => {
    // given
    const shots: Shot[] = [{ hit: true, distance: 5 }];
    const expectedScore = 10;

    // when
    const result = calculateScore(shots);

    // then
    expect(result.score).toBe(expectedScore);
  });

  it('should return 0 points for a miss', () => {
    // given
    const shots: Shot[] = [{ hit: false, distance: 5 }];
    const expectedScore = 0;

    // when
    const result = calculateScore(shots);

    // then
    expect(result.score).toBe(expectedScore);
  });

  it('should add 5 bonus points for distance > 10', () => {
    // given
    const shots: Shot[] = [{ hit: true, distance: 15 }];
    const expectedScore = 15;

    // when
    const result = calculateScore(shots);

    // then
    expect(result.score).toBe(expectedScore);
  });

  it('should add 5 points for combo every 3 hits', () => {
    // given
    const shots: Shot[] = [
      { hit: true, distance: 5 },
      { hit: true, distance: 5 },
      { hit: true, distance: 5 },
    ];
    const expectedScore = 35;

    // when
    const result = calculateScore(shots);

    // then
    expect(result.score).toBe(expectedScore);
  });

  it('should reset combo after miss', () => {
    // given
    const shots: Shot[] = [
      { hit: true, distance: 5 },
      { hit: true, distance: 5 },
      { hit: false, distance: 5 },
      { hit: true, distance: 5 },
    ];
    const expectedScore = 30;

    // when
    const result = calculateScore(shots);

    // then
    expect(result.score).toBe(expectedScore);
  });

  it('should return 0 points for empty sequence', () => {
    // given
    const shots: Shot[] = [];
    const expectedScore = 0;

    // when
    const result = calculateScore(shots);

    // then
    expect(result.score).toBe(expectedScore);
  });
});
