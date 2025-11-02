'use client'

import { useState } from 'react'
import { Navigation } from '@/components/Navigation'

export default function TestsPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [showResult, setShowResult] = useState(false)

  const questions = [
    "¿Cómo te sientes emocionalmente hoy?",
    "¿Qué tan estresado/a te has sentido esta semana?",
    "¿Has tenido dificultades para dormir últimamente?"
  ]

  const options = [
    "Muy mal", "Mal", "Regular", "Bien", "Muy bien"
  ]

  const handleAnswer = (value: number) => {
    const newAnswers = [...answers, value]
    setAnswers(newAnswers)
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setShowResult(true)
    }
  }

  const getResult = () => {
    const average = answers.reduce((a, b) => a + b, 0) / answers.length
    if (average <= 2) return { level: "Bajo", color: "red", message: "Considera buscar apoyo profesional" }
    if (average <= 3) return { level: "Medio", color: "yellow", message: "Hay áreas que puedes mejorar" }
    return { level: "Alto", color: "green", message: "¡Excelente bienestar emocional!" }
  }

  const restart = () => {
    setCurrentQuestion(0)
    setAnswers([])
    setShowResult(false)
  }

  if (showResult) {
    const result = getResult()
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="pt-20 px-4 pb-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                 Resultado del Test
              </h1>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-xl text-center">
              <div className="text-6xl mb-4">
                {result.level === "Alto" ? "🟢" : result.level === "Medio" ? "🟡" : "🔴"}
              </div>
              <h2 className="text-3xl font-bold mb-4">
                Bienestar: {result.level}
              </h2>
              <p className="text-xl text-gray-700 mb-8">
                {result.message}
              </p>
              
              <div className="space-y-4">
                <button
                  onClick={restart}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-bold hover:bg-blue-700 transition-colors mr-4"
                >
                   Hacer Test Nuevamente
                </button>
                <a
                  href="/chat"
                  className="bg-purple-600 text-white px-8 py-3 rounded-lg text-lg font-bold hover:bg-purple-700 transition-colors"
                >
                   Hablar con IA
                </a>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="pt-20 px-4 pb-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
               Tests Simplificados
            </h1>
            <p className="text-xl text-gray-700">
               EVALUACIONES RÁPIDAS DE 2 MINUTOS
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-xl">
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-gray-500">
                  Pregunta {currentQuestion + 1} de {questions.length}
                </span>
                <span className="text-sm text-gray-500">
                  {Math.round(((currentQuestion + 1) / questions.length) * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                ></div>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              {questions[currentQuestion]}
            </h2>

            <div className="grid grid-cols-1 gap-4">
              {options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(index + 1)}
                  className="p-4 text-left border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all duration-200"
                >
                  <span className="text-lg">{option}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="text-center mt-8 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-2xl p-6">
            <h3 className="text-xl font-bold mb-2">
               Tests Completamente Renovados
            </h3>
            <p className="text-lg">
              Evaluaciones rápidas, efectivas y con resultados inmediatos
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
