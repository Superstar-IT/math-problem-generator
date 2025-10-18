'use client'

import { useState } from 'react'
import { DifficultyLevel, MathProblem, ProblemHistoryItem } from '../lib/types'

export default function Home() {
  const [problem, setProblem] = useState<MathProblem | null>(null)
  const [userAnswer, setUserAnswer] = useState('')
  const [feedback, setFeedback] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(DifficultyLevel.MEDIUM)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [problemHistory, setProblemHistory] = useState<ProblemHistoryItem[]>([])

  const generateProblem = async () => {
    setIsGenerating(true)
    setFeedback('')
    setIsCorrect(null)
    setUserAnswer('')
    
    try {
      const response = await fetch('/api/math-problem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ difficulty }),
      })

      const data = await response.json()

      if (data.success) {
        setProblem(data.problem)
        setSessionId(data.sessionId)
      } else {
        throw new Error(data.error || 'Failed to generate problem')
      }
    } catch (error) {
      console.error('Error generating problem:', error)
      alert('Failed to generate problem. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const submitAnswer = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/math-problem/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          sessionId,
          userAnswer: parseFloat(userAnswer)
        }),
      })

      const data = await response.json()

      if (data.success) {
        setIsCorrect(data.isCorrect)
        setFeedback(data.feedback)
        
        // Update scoring
        if (data.isCorrect) {
          const points = difficulty === DifficultyLevel.EASY ? 10 : difficulty === DifficultyLevel.MEDIUM ? 20 : 30
          setScore(prev => prev + points)
          setStreak(prev => prev + 1)
        } else {
          setStreak(0)
        }
        
        // Add to history
        setProblemHistory(prev => [...prev, {
          problem: problem?.problem_text,
          userAnswer: parseFloat(userAnswer),
          isCorrect: data.isCorrect,
          difficulty,
          timestamp: new Date().toISOString()
        }])
      } else {
        throw new Error(data.error || 'Failed to submit answer')
      }
    } catch (error) {
      console.error('Error submitting answer:', error)
      alert('Failed to submit answer. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          Math Problem Generator
        </h1>
        
        {/* Score and Stats Display */}
        <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
          <div className="flex justify-between items-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">Score: {score}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">Streak: {streak}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">Problems: {problemHistory.length}</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="mb-4">
            <label htmlFor="difficulty-select" className="block text-sm font-medium text-gray-700 mb-2">
              Difficulty Level:
            </label>
            <select
              id="difficulty-select"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as DifficultyLevel)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {Object.values(DifficultyLevel).map((level) => (
                <option key={level} value={level}>
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={generateProblem}
            disabled={isGenerating || isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg transition duration-200 ease-in-out transform hover:scale-105"
          >
            {isGenerating ? 'Generating...' : `Generate ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Problem`}
          </button>
        </div>

        {problem && !isGenerating && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Problem:</h2>
            <p className="text-lg text-gray-800 leading-relaxed mb-6">
              {problem.problem_text}
            </p>
            
            <form onSubmit={submitAnswer} className="space-y-4 mb-6">
              <div>
                <label htmlFor="answer" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Answer:
                </label>
                <input
                  type="number"
                  id="answer"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your answer"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={!userAnswer || isSubmitting}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg transition duration-200 ease-in-out transform hover:scale-105"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Answer'}
              </button>
            </form>
          </div>
        )}

        {feedback && !isGenerating && !isSubmitting && (
          <div className={`rounded-lg shadow-lg p-6 ${isCorrect ? 'bg-green-50 border-2 border-green-200' : 'bg-yellow-50 border-2 border-yellow-200'}`}>
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              {isCorrect ? '✅ Correct!' : '❌ Not quite right'}
            </h2>
            <p className="text-gray-800 leading-relaxed">{feedback}</p>
          </div>
        )}

        {/* Problem History */}
        {problemHistory.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Problem History</h2>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {problemHistory.slice(-5).reverse().map((item, index) => (
                <div key={index} className={`p-3 rounded-lg border-l-4 ${
                  item.isCorrect 
                    ? 'bg-green-50 border-green-400' 
                    : 'bg-red-50 border-red-400'
                }`}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 mb-1">
                        {item.problem?.substring(0, 50)}...
                      </p>
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <span className={`px-2 py-1 rounded ${
                          item.difficulty === DifficultyLevel.EASY ? 'bg-green-100 text-green-800' :
                          item.difficulty === DifficultyLevel.MEDIUM ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {item.difficulty}
                        </span>
                        <span>Answer: {item.userAnswer}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      {item.isCorrect ? (
                        <span className="text-green-600 font-bold">✓</span>
                      ) : (
                        <span className="text-red-600 font-bold">✗</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}