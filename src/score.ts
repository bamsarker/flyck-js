const HIGH_SCORE = "highscore";

const saveScore = (score: number) => {
  localStorage.setItem(HIGH_SCORE, score.toString());
};

const checkHighScore = (score: number) => {
  const currentHighScore = localStorage.getItem(HIGH_SCORE);
  if (!currentHighScore || parseInt(currentHighScore, 10) < score) {
    saveScore(score);
    return true;
  }
  return false;
};

export default {
  checkHighScore
};
