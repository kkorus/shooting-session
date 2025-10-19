export type Shot = { hit: boolean; distance: number };

const SCORE_CONFIG = {
  HIT_POINTS: 10,
  DISTANCE_THRESHOLD: 10,
  DISTANCE_BONUS: 5,
  STREAK_BONUS_INTERVAL: 3,
  STREAK_BONUS_POINTS: 5,
} as const;

export function calculateScore(shots: Shot[]): { score: number } {
  let score = 0;
  let streak = 0;

  for (const shot of shots) {
    if (shot.hit) {
      score += SCORE_CONFIG.HIT_POINTS;
      streak += 1;

      if (shot.distance > SCORE_CONFIG.DISTANCE_THRESHOLD) {
        score += SCORE_CONFIG.DISTANCE_BONUS;
      }
      if (streak % SCORE_CONFIG.STREAK_BONUS_INTERVAL === 0) {
        score += SCORE_CONFIG.STREAK_BONUS_POINTS;
      }
    } else {
      streak = 0;
    }
  }

  return { score };
}
