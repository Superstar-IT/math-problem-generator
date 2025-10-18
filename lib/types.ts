export enum DifficultyLevel {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard'
}

export interface MathProblem {
  problem_text: string
  final_answer: number
  difficulty?: DifficultyLevel
}

export interface ProblemHistoryItem {
  problem: string
  userAnswer: number
  isCorrect: boolean
  difficulty: DifficultyLevel
  timestamp: string
}
