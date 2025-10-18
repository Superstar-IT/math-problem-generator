import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { supabase } from '../../../lib/supabaseClient'
import { DifficultyLevel } from '../../../lib/types'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!)

export async function POST(request: NextRequest) {
  try {
    const { difficulty = DifficultyLevel.MEDIUM } = await request.json()
    
    // Validate difficulty level
    if (!Object.values(DifficultyLevel).includes(difficulty)) {
      return NextResponse.json({ error: 'Invalid difficulty level' }, { status: 400 })
    }
    
    return await generateProblem(difficulty)
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function generateProblem(difficulty: DifficultyLevel = DifficultyLevel.MEDIUM) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    const difficultyPrompts = {
      [DifficultyLevel.EASY]: 'simple single-step problems with numbers under 20',
      [DifficultyLevel.MEDIUM]: 'two-step problems with numbers under 100',
      [DifficultyLevel.HARD]: 'multi-step problems with larger numbers and more complex scenarios'
    }

    const prompt = `Generate a math word problem suitable for Primary 5 students (ages 10-11). 
Difficulty Level: ${difficulty.toUpperCase()}
Requirements: ${difficultyPrompts[difficulty] || difficultyPrompts[DifficultyLevel.MEDIUM]}

      The problem should involve basic arithmetic operations like addition, subtraction, multiplication, or division. Make it engaging and relatable to children.

      Return your response as a JSON object with this exact format:
      {
        "problem_text": "The word problem text here",
        "final_answer": [numeric answer],
        "difficulty": "${difficulty}"
      }

      Example:
      {
        "problem_text": "Sarah has 24 stickers. She gives 8 stickers to her friend and buys 12 more stickers. How many stickers does Sarah have now?",
        "final_answer": 28,
        "difficulty": "medium"
      }

      Generate a new, unique problem:`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // Parse the JSON response
    let problemData
    try {
      // Extract JSON from the response (in case there's extra text)
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        problemData = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('No JSON found in response')
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', text)
      throw new Error('Failed to parse AI response')
    }

    // Validate the response
    if (!problemData.problem_text || typeof problemData.final_answer !== 'number') {
      throw new Error('Invalid problem data from AI')
    }

    // Save to database
    const { data, error } = await supabase
      .from('math_problem_sessions')
      .insert({
        problem_text: problemData.problem_text,
        correct_answer: problemData.final_answer,
        difficulty: problemData.difficulty || difficulty
      })
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      throw new Error('Failed to save problem to database')
    }

    return NextResponse.json({
      success: true,
      problem: {
        problem_text: problemData.problem_text,
        final_answer: problemData.final_answer
      },
      sessionId: data.id
    })

  } catch (error) {
    console.error('Generate problem error:', error)
    return NextResponse.json({ error: 'Failed to generate problem' }, { status: 500 })
  }
}

