type Shot = { hit: boolean; distance: number };

export function calculateScore(shots: Shot[]): { score: number } {
  let score = 0;
  let streak = 0;

  for (const shot of shots) {
    if (shot.hit) {
      score += 10;
      streak += 1;

      if (shot.distance > 10) {
        score += 5;
      }
      if (streak % 3 === 0) {
        score += 5;
      }
    } else {
      streak = 0;
    }
  }

  return { score };
}
