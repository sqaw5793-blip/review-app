import { useState } from 'react'
import { CheckCircle2, XCircle, Eye, RotateCcw, Sparkles } from 'lucide-react'
import { QUIZ_QUESTIONS } from '../data/practiceData'

export default function QuizView({ onOpenDoc }) {
  const [answers, setAnswers] = useState({})

  const answeredCount = Object.keys(answers).length
  const correctCount = QUIZ_QUESTIONS.filter(
    (q) => answers[q.id] === q.answer
  ).length

  const handleSelect = (qId, optionIdx) => {
    if (answers[qId] !== undefined) return
    setAnswers((prev) => ({ ...prev, [qId]: optionIdx }))
  }

  return (
    <div className="space-y-6 pb-12 max-w-3xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            考前模拟自测（全 6 份课件核心题）
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            选择选项立即判题并给出解析，每道题均可一键跳转原 PPT/PDF 页码复习。
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right">
            <div className="text-xs text-slate-400">当前得分</div>
            <div className="text-lg font-bold text-indigo-600">
              {correctCount} / {answeredCount}
              <span className="text-xs text-slate-400 font-normal ml-1">
                (共 {QUIZ_QUESTIONS.length} 题)
              </span>
            </div>
          </div>
          <button
            onClick={() => setAnswers({})}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            重做
          </button>
        </div>
      </div>

      {/* Question List */}
      <div className="space-y-4">
        {QUIZ_QUESTIONS.map((q, idx) => {
          const picked = answers[q.id]
          const isAnswered = picked !== undefined
          const isRight = picked === q.answer

          return (
            <div
              key={q.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <span className="inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-xs font-semibold">
                    第 {idx + 1} 题 · {q.chapter}
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-relaxed">
                    {q.question}
                  </h3>
                </div>
                <button
                  onClick={() => onOpenDoc(q.docId, q.page)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white text-xs font-medium transition cursor-pointer shrink-0"
                >
                  <Eye className="w-3.5 h-3.5" />
                  原课件 P{q.page}
                </button>
              </div>

              <div className="grid grid-cols-1 gap-2">
                {q.options.map((opt, oIdx) => {
                  let style =
                    'bg-slate-50 border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/40 text-slate-700'
                  if (isAnswered) {
                    if (oIdx === q.answer) {
                      style = 'bg-emerald-50 border-emerald-400 text-emerald-900 font-semibold'
                    } else if (oIdx === picked && !isRight) {
                      style = 'bg-rose-50 border-rose-400 text-rose-900'
                    } else {
                      style = 'bg-slate-50/50 border-slate-100 text-slate-400'
                    }
                  }

                  return (
                    <button
                      key={oIdx}
                      onClick={() => handleSelect(q.id, oIdx)}
                      disabled={isAnswered}
                      className={`w-full text-left px-3.5 py-2.5 rounded-lg border text-xs sm:text-sm transition flex items-center justify-between gap-2 ${style} ${
                        !isAnswered ? 'cursor-pointer' : 'cursor-default'
                      }`}
                    >
                      <span>{opt}</span>
                      {isAnswered && oIdx === q.answer && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                      {isAnswered && oIdx === picked && !isRight && (
                        <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      )}
                    </button>
                  )
                })}
              </div>

              {isAnswered && (
                <div
                  className={`rounded-lg p-3 text-xs leading-relaxed border ${
                    isRight
                      ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                      : 'bg-rose-50/70 border-rose-200 text-rose-900'
                  }`}
                >
                  <span className="font-bold mr-1">
                    {isRight ? '回答正确！' : '回答有误。'}
                  </span>
                  {q.explanation}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
