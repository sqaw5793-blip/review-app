import {
  FileText,
  Presentation,
  BookOpen,
  Eye,
  CheckCircle2,
  Sparkles,
  Layers,
  GraduationCap,
} from 'lucide-react'
import { DOCUMENTS, CHAPTER_TOPICS } from '../data/documents'
import { QUICK_COMPARISONS } from '../data/practiceData'

const ACCENT_MAP = {
  indigo: 'from-indigo-500 to-blue-600',
  violet: 'from-violet-500 to-purple-600',
  emerald: 'from-emerald-500 to-teal-600',
  sky: 'from-sky-500 to-cyan-600',
  amber: 'from-amber-500 to-orange-600',
  rose: 'from-rose-500 to-pink-600',
}

export default function OverviewDashboard({
  masteredIds,
  onSelectChapter,
  onOpenDoc,
  onNavigate,
}) {
  const allTopics = Object.values(CHAPTER_TOPICS).flat()
  const totalTopics = allTopics.length
  const masteredCount = allTopics.filter((t) => masteredIds.includes(t.id)).length
  const progressPct = totalTopics > 0 ? Math.round((masteredCount / totalTopics) * 100) : 0
  const totalPages = DOCUMENTS.reduce((sum, d) => sum + d.pageCount, 0)

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Banner */}
      <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-xs font-medium">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>信息安全概论 · 期末冲刺复习系统</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              6 份课件 · {totalPages} 页原文 · 考点全提炼
            </h1>
            <p className="text-slate-300 text-sm leading-relaxed">
              已为你解析全部 PPT 与 SM4 国密标准 PDF，归纳出 {totalTopics} 个核心考点模块。点击任意知识点上的{' '}
              <span className="px-1.5 py-0.5 rounded bg-white/15 text-white font-mono text-xs">P页码</span>{' '}
              即可在右侧直接打开原课件并精准跳转到对应页！
            </p>
            <div className="flex flex-wrap gap-2.5 pt-2">
              <button
                onClick={() => onNavigate('flashcards')}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-medium transition cursor-pointer shadow"
              >
                <Layers className="w-4 h-4" />
                闪卡背诵 (20张)
              </button>
              <button
                onClick={() => onNavigate('quiz')}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition cursor-pointer border border-white/15"
              >
                <Sparkles className="w-4 h-4" />
                考前模拟自测 (15题)
              </button>
            </div>
          </div>

          {/* Mastery Progress Card */}
          <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-xl p-4 sm:w-64 shrink-0">
            <div className="flex items-center justify-between text-xs text-indigo-200 mb-1.5">
              <span>当前复习掌握度</span>
              <span className="font-bold text-white text-sm">{progressPct}%</span>
            </div>
            <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden mb-3">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                已掌握 {masteredCount} / {totalTopics} 考点
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 6 Documents Bookshelf */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            全部课件与标准文档（点击直接打开或看总结）
          </h2>
          <span className="text-xs text-slate-500">支持站内分屏预览 + 原文件下载</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {DOCUMENTS.map((doc) => {
            const topics = CHAPTER_TOPICS[doc.id] || []
            const doneCount = topics.filter((t) => masteredIds.includes(t.id)).length
            return (
              <div
                key={doc.id}
                className="group bg-white rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all flex flex-col overflow-hidden"
              >
                <div className={`h-1.5 bg-gradient-to-r ${ACCENT_MAP[doc.accent]}`} />
                <div className="p-4 flex-1 flex flex-col">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      {doc.type === 'PDF' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
                          <FileText className="w-3 h-3" /> PDF
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold">
                          <Presentation className="w-3 h-3" /> {doc.type}
                        </span>
                      )}
                      <span className="text-xs text-slate-400">{doc.pageCount} 页</span>
                    </div>
                    <span className="text-xs font-medium text-slate-500">
                      {doneCount}/{topics.length} 已掌握
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base mb-1 group-hover:text-indigo-600 transition">
                    {doc.title}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono truncate mb-2" title={doc.filename}>
                    {doc.filename}
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed flex-1 mb-4">
                    {doc.description}
                  </p>

                  <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                    <button
                      onClick={() => onSelectChapter(doc.id)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white text-xs font-semibold transition cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      知识点总结
                    </button>
                    <button
                      onClick={() => onOpenDoc(doc.id, 1)}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-800 text-slate-700 hover:text-white text-xs font-semibold transition cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      打开{doc.type === 'PDF' ? 'PDF' : 'PPT'}
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* High-Frequency Exam Comparison Cheat Sheets */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500" />
          考前高频对比速查表（大题/简答题必背）
        </h2>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {QUICK_COMPARISONS.map((cmp) => (
            <div
              key={cmp.id}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs"
            >
              <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-2">
                <h3 className="font-bold text-slate-800 text-sm">{cmp.title}</h3>
                <button
                  onClick={() => onOpenDoc(cmp.docId, cmp.page)}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-medium inline-flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <Eye className="w-3.5 h-3.5" />
                  原课件 P{cmp.page}
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50/70 text-slate-500 border-b border-slate-100">
                    <tr>
                      {cmp.headers.map((h, idx) => (
                        <th key={idx} className="px-3 py-2 font-semibold whitespace-nowrap">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {cmp.rows.map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-slate-50/80">
                        {row.map((cell, cIdx) => (
                          <td
                            key={cIdx}
                            className={`px-3 py-2 leading-relaxed ${
                              cIdx === 0 ? 'font-semibold text-slate-900 whitespace-nowrap' : ''
                            }`}
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
