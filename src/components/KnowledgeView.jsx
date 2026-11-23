import { useState, useMemo } from 'react'
import {
  Eye,
  CheckCircle2,
  Circle,
  Search,
  BookOpen,
  FileSearch,
  Calculator,
  HelpCircle,
  Download,
} from 'lucide-react'
import { DOCUMENTS, CHAPTER_TOPICS, LEVEL_META } from '../data/documents'
import slidesIndex from '../data/slidesIndex.json'

export default function KnowledgeView({
  docId,
  masteredIds,
  onToggleMastered,
  onOpenDoc,
}) {
  const doc = DOCUMENTS.find((d) => d.id === docId) || DOCUMENTS[0]
  const topics = CHAPTER_TOPICS[doc.id] || []
  const rawSlides = slidesIndex[doc.id] || []

  const [subTab, setSubTab] = useState('summary') // 'summary' | 'slides'
  const [levelFilter, setLevelFilter] = useState('all')
  const [onlyUnmastered, setOnlyUnmastered] = useState(false)
  const [query, setQuery] = useState('')

  const filteredTopics = useMemo(() => {
    return topics.filter((t) => {
      if (levelFilter !== 'all' && t.level !== levelFilter) return false
      if (onlyUnmastered && masteredIds.includes(t.id)) return false
      if (query.trim()) {
        const q = query.trim().toLowerCase()
        const blob = [
          t.title,
          t.summary,
          ...(t.keyPoints || []),
          t.example || '',
          ...(t.qa || []).map((x) => x.q + x.a),
        ]
          .join(' ')
          .toLowerCase()
        if (!blob.includes(q)) return false
      }
      return true
    })
  }, [topics, levelFilter, onlyUnmastered, masteredIds, query])

  const filteredSlides = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return rawSlides
    return rawSlides.filter(
      (s) => s.text.toLowerCase().includes(q) || String(s.page) === q
    )
  }, [rawSlides, query])

  const doneCount = topics.filter((t) => masteredIds.includes(t.id)).length

  return (
    <div className="space-y-5 pb-12">
      {/* Chapter Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-700 text-xs font-bold">
                {doc.type} · {doc.pageCount} 页
              </span>
              <span className="text-xs text-slate-500 font-mono">{doc.filename}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{doc.title}</h1>
            <p className="text-sm text-slate-600">{doc.description}</p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onOpenDoc(doc.id, 1)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-xs transition cursor-pointer"
            >
              <Eye className="w-4 h-4" />
              站内打开原课件
            </button>
            <a
              href={doc.origUrl}
              download={doc.filename}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
            >
              <Download className="w-4 h-4" />
              下载原件
            </a>
          </div>
        </div>

        {/* Sub-tabs & Search */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="inline-flex bg-slate-100 p-1 rounded-lg self-start">
            <button
              onClick={() => setSubTab('summary')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition cursor-pointer ${
                subTab === 'summary'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              知识点精华 ({doneCount}/{topics.length})
            </button>
            <button
              onClick={() => setSubTab('slides')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition cursor-pointer ${
                subTab === 'slides'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileSearch className="w-3.5 h-3.5" />
              逐页原文目录 ({doc.pageCount}页)
            </button>
          </div>

          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={subTab === 'summary' ? '搜索本章节考点关键词...' : '搜索本课件任意页原文或页码...'}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-indigo-400"
            />
          </div>
        </div>

        {subTab === 'summary' && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {[
              { id: 'all', label: '全部考点' },
              { id: 'must', label: '必背考点' },
              { id: 'core', label: '核心概念' },
              { id: 'algo', label: '算法与计算' },
              { id: 'understand', label: '理解掌握' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setLevelFilter(item.id)}
                className={`px-2.5 py-1 rounded-full text-xs font-medium transition cursor-pointer ${
                  levelFilter === item.id
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {item.label}
              </button>
            ))}

            <label className="ml-auto inline-flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={onlyUnmastered}
                onChange={(e) => setOnlyUnmastered(e.target.checked)}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              仅看未掌握
            </label>
          </div>
        )}
      </div>

      {/* Tab 1: Knowledge Summary Cards */}
      {subTab === 'summary' ? (
        <div className="space-y-4">
          {filteredTopics.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-10 text-center text-slate-500 text-sm">
              没有匹配当前筛选条件的知识点，试试切换筛选项或清空搜索词。
            </div>
          ) : (
            filteredTopics.map((topic) => {
              const isMastered = masteredIds.includes(topic.id)
              const meta = LEVEL_META[topic.level] || LEVEL_META.core
              return (
                <article
                  key={topic.id}
                  className={`bg-white rounded-xl border transition-all overflow-hidden ${
                    isMastered
                      ? 'border-emerald-200 bg-emerald-50/15'
                      : 'border-slate-200 hover:border-indigo-200 shadow-xs'
                  }`}
                >
                  {/* Card Header */}
                  <div className="px-5 py-4 border-b border-slate-100 flex items-start justify-between gap-3">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`px-2 py-0.5 rounded-md text-xs font-semibold border ${meta.badge}`}
                        >
                          {meta.label}
                        </span>
                        <h2 className="text-base font-bold text-slate-900">{topic.title}</h2>
                      </div>
                      <p className="text-xs text-slate-500">{topic.summary}</p>
                    </div>

                    <button
                      onClick={() => onToggleMastered(topic.id)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer shrink-0 ${
                        isMastered
                          ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {isMastered ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" /> 已掌握
                        </>
                      ) : (
                        <>
                          <Circle className="w-3.5 h-3.5" /> 标为掌握
                        </>
                      )}
                    </button>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 space-y-4">
                    {topic.keyPoints && topic.keyPoints.length > 0 && (
                      <ul className="space-y-2">
                        {topic.keyPoints.map((pt, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2.5 text-sm text-slate-700 leading-relaxed whitespace-pre-line"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0" />
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Comparison Table if present */}
                    {topic.table && (
                      <div className="rounded-lg border border-slate-200 overflow-x-auto">
                        <table className="w-full text-xs text-left">
                          <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                            <tr>
                              {topic.table.headers.map((h, idx) => (
                                <th key={idx} className="px-3 py-2 font-semibold">
                                  {h}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 text-slate-700">
                            {topic.table.rows.map((row, rIdx) => (
                              <tr key={rIdx} className="hover:bg-slate-50/70">
                                {row.map((cell, cIdx) => (
                                  <td
                                    key={cIdx}
                                    className={`px-3 py-2 ${
                                      cIdx === 0 ? 'font-semibold text-slate-900' : ''
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
                    )}

                    {/* Worked Example if present */}
                    {topic.example && (
                      <div className="rounded-lg bg-amber-50 border border-amber-200/80 p-3.5 text-xs text-amber-950 leading-relaxed whitespace-pre-line">
                        <div className="font-bold text-amber-800 flex items-center gap-1.5 mb-1">
                          <Calculator className="w-3.5 h-3.5" />
                          课件经典例题 / 计算速览
                        </div>
                        {topic.example}
                      </div>
                    )}

                    {/* Teacher Q&A if present */}
                    {topic.qa && (
                      <div className="space-y-2.5">
                        {topic.qa.map((item, idx) => (
                          <div
                            key={idx}
                            className="rounded-lg bg-indigo-50/70 border border-indigo-200/70 p-3.5 text-xs space-y-1.5"
                          >
                            <div className="font-bold text-indigo-900 flex items-center gap-1.5">
                              <HelpCircle className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                              问：{item.q}
                            </div>
                            <p className="text-slate-700 leading-relaxed pl-5">答：{item.a}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Source Page Jump Pills */}
                    <div className="pt-2 border-t border-slate-100 flex items-center flex-wrap gap-1.5">
                      <span className="text-xs text-slate-400 mr-1">点击跳转原课件页：</span>
                      {topic.pages.map((p) => (
                        <button
                          key={p}
                          onClick={() => onOpenDoc(doc.id, p)}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 hover:bg-indigo-600 text-slate-700 hover:text-white text-xs font-mono font-medium transition cursor-pointer"
                          title={`打开 ${doc.filename} 第 ${p} 页`}
                        >
                          P{p}
                        </button>
                      ))}
                    </div>
                  </div>
                </article>
              )
            })
          )}
        </div>
      ) : (
        /* Tab 2: Raw Slide Index */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredSlides.map((slide) => (
            <button
              key={slide.page}
              onClick={() => onOpenDoc(doc.id, slide.page)}
              className="text-left bg-white rounded-xl border border-slate-200 hover:border-indigo-400 hover:shadow-sm p-4 transition cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 text-xs font-mono font-bold">
                  第 {slide.page} 页
                </span>
                <span className="text-xs text-slate-400 group-hover:text-indigo-600 inline-flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" /> 打开此页
                </span>
              </div>
              <p className="text-xs text-slate-600 line-clamp-4 whitespace-pre-line leading-relaxed">
                {slide.text || '（本页主要为图片、流程图或公式，请点击直接查看原课件）'}
              </p>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
