import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { supabase } from '../../../../lib/supabaseClient'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!)

export async function POST(request: NextRequest) {
  try {
    const { sessionId, userAnswer } = await request.json()
    return await submitAnswer(sessionId, userAnswer)
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function submitAnswer(sessionId: string, userAnswer: number) {
  try {
    // Get the original problem
    const { data: session, error: sessionError } = await supabase
      .from('math_problem_sessions')
      .select('*')
      .eq('id', sessionId)
      .single()

    if (sessionError || !session) {
      throw new Error('Problem session not found')
    }

    const isCorrect = userAnswer === session.correct_answer

    // Generate personalized feedback using AI
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
    
    const feedbackPrompt = `You are a helpful math tutor for Primary 5 students. Provide encouraging and educational feedback.

Problem: ${session.problem_text}
Correct Answer: ${session.correct_answer}
Student's Answer: ${userAnswer}
Is Correct: ${isCorrect}

Provide feedback that:
1. Is encouraging and positive
2. If incorrect, gently explains the mistake and guides toward the correct approach
3. If correct, celebrates the success and maybe offers a challenge
4. Is appropriate for a 10-11 year old
5. Is 2-3 sentences long

Feedback:`

    const result = await model.generateContent(feedbackPrompt)
    const response = await result.response
    const feedbackText = response.text().trim()

    // Save the submission
    const { error: submissionError } = await supabase
      .from('math_problem_submissions')
      .insert({
        session_id: sessionId,
        user_answer: userAnswer,
        is_correct: isCorrect,
        feedback_text: feedbackText
      })

    if (submissionError) {
      console.error('Database error:', submissionError)
      throw new Error('Failed to save submission')
    }

    return NextResponse.json({
      success: true,
      isCorrect,
      feedback: feedbackText
    })

  } catch (error) {
    console.error('Submit answer error:', error)
    return NextResponse.json({ error: 'Failed to submit answer' }, { status: 500 })
  }
}
