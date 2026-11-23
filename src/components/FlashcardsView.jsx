import { useState, useMemo } from 'react'
import { RotateCw, ChevronLeft, ChevronRight, Eye, CheckCircle2, Layers } from 'lucide-react'
import { FLASHCARDS } from '../data/practiceData'
import { DOCUMENTS } from '../data/documents'

export default function FlashcardsView({ onOpenDoc }) {
  const [selectedDoc, setSelectedDoc] = useState('all')
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [knownIds, setKnownIds] = useState([])

  const cards = useMemo(() => {
    if (selectedDoc === 'all') return FLASHCARDS
    return FLASHCARDS.filter((c) => c.docId === selectedDoc)
  }, [selectedDoc])

  const safeIndex = Math.min(index, Math.max(0, cards.length - 1))
  const current = cards[safeIndex]

  const go = (delta) => {
    setFlipped(false)
    setIndex((prev) => (prev + delta + cards.length) % cards.length)
  }

  const toggleKnown = (id) => {
    setKnownIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  return (
    <div className="space-y-6 pb-12 max-w-3xl mx-auto">
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-600" />
              考前高频闪卡记忆
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              点击卡片翻转查看答案，支持直接跳转对应 PPT / PDF 原页核对
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            本轮已记住：{knownIds.length} / {FLASHCARDS.length}
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5 pt-1">
          <button
            onClick={() => {
              setSelectedDoc('all')
              setIndex(0)
              setFlipped(false)
            }}
            className={`px-2.5 py-1 rounded-full text-xs font-medium cursor-pointer transition ${
              selectedDoc === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            全部 ({FLASHCARDS.length})
          </button>
          {DOCUMENTS.map((d) => {
            const count = FLASHCARDS.filter((c) => c.docId === d.id).length
            return (
              <button
                key={d.id}
                onClick={() => {
                  setSelectedDoc(d.id)
                  setIndex(0)
                  setFlipped(false)
                }}
                className={`px-2.5 py-1 rounded-full text-xs font-medium cursor-pointer transition ${
                  selectedDoc === d.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {d.shortTitle.split('·')[0]} ({count})
              </button>
            )
          })}
        </div>
      </div>

      {current && (
        <div className="space-y-4">
          {/* Interactive Card */}
          <div
            onClick={() => setFlipped(!flipped)}
            className={`min-h-[280px] rounded-2xl border-2 p-8 flex flex-col justify-between cursor-pointer transition-all shadow-sm select-none ${
              flipped
                ? 'bg-indigo-50/70 border-indigo-400'
                : 'bg-white border-slate-200 hover:border-indigo-300'
            }`}
          >
            <div className="flex items-center justify-between text-xs">
              <span className="px-2.5 py-1 rounded-md bg-slate-900 text-white font-semibold">
                {current.tag} · {safeIndex + 1} / {cards.length}
              </span>
              <span className="inline-flex items-center gap-1 text-slate-400 font-medium">
                <RotateCw className="w-3.5 h-3.5" />
                {flipped ? '点击翻回题目' : '点击查看答案'}
              </span>
            </div>

            <div className="my-6 text-center space-y-3">
              {!flipped ? (
                <>
                  <div className="text-xs font-semibold uppercase tracking-wider text-indigo-500">
                    考点提问
                  </div>
                  <p className="text-lg sm:text-xl font-bold text-slate-900 leading-relaxed">
                    {current.front}
                  </p>
                </>
              ) : (
                <>
                  <div className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
                    标准要点
                  </div>
                  <p className="text-base sm:text-lg font-medium text-slate-800 leading-relaxed text-left bg-white p-4 rounded-xl border border-indigo-100">
                    {current.back}
                  </p>
                </>
              )}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-200/70">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onOpenDoc(current.docId, current.page)
                }}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 cursor-pointer"
              >
                <Eye className="w-4 h-4" />
                查看原课件 P{current.page}
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation()
                  toggleKnown(current.id)
                }}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition ${
                  knownIds.includes(current.id)
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-emerald-100 hover:text-emerald-700'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                {knownIds.includes(current.id) ? '已记住' : '标记已记住'}
              </button>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => go(-1)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-sm font-semibold text-slate-700 cursor-pointer transition"
            >
              <ChevronLeft className="w-4 h-4" />
              上一张
            </button>
            <button
              onClick={() => setFlipped(!flipped)}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-sm font-semibold text-white cursor-pointer transition shadow-xs"
            >
              <RotateCw className="w-4 h-4" />
              翻转卡片
            </button>
            <button
              onClick={() => go(1)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-sm font-semibold text-slate-700 cursor-pointer transition"
            >
              下一张
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
