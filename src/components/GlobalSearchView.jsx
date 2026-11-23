import { useState, useMemo } from 'react'
import { Search, Eye, FileText, Presentation } from 'lucide-react'
import { DOCUMENTS } from '../data/documents'
import slidesIndex from '../data/slidesIndex.json'

const HOT_KEYWORDS = ['Kerckhoff', 'DES', 'SM4', 'RSA', 'DH', 'MD5', 'Salt', 'Kerberos', '零知识', 'BLP', 'Biba', 'RBAC', 'ACL']

export default function GlobalSearchView({ onOpenDoc }) {
  const [query, setQuery] = useState('')

  const docMap = useMemo(() => {
    const m = {}
    DOCUMENTS.forEach((d) => (m[d.id] = d))
    return m
  }, [])

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    const res = []
    for (const [docId, pages] of Object.entries(slidesIndex)) {
      for (const p of pages) {
        if (p.text.toLowerCase().includes(q)) {
          res.push({ docId, page: p.page, text: p.text })
          if (res.length >= 80) return res
        }
      }
    }
    return res
  }, [query])

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Search className="w-5 h-5 text-indigo-600" />
            全 451 页课件全文秒搜
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            输入任意名词、公式或人名，立刻定位它出现在哪几份 PPT / PDF 的第几页，点击直接打开该页。
          </p>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="例如：BLP、S盒、Kerberos、反射攻击、零知识、最小特权..."
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:border-indigo-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-slate-400 mr-1">高频考点快搜：</span>
          {HOT_KEYWORDS.map((kw) => (
            <button
              key={kw}
              onClick={() => setQuery(kw)}
              className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-indigo-100 text-slate-700 hover:text-indigo-700 text-xs font-medium transition cursor-pointer"
            >
              {kw}
            </button>
          ))}
        </div>
      </div>

      {query.trim() && (
        <div className="space-y-3">
          <div className="text-xs text-slate-500">
            共找到 <span className="font-bold text-slate-900">{matches.length}</span> 页包含 “{query}” 的课件内容
            {matches.length >= 80 ? '（仅展示前 80 条）' : ''}
          </div>

          {matches.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-10 text-center text-slate-500 text-sm">
              没有在 451 页课件中找到 “{query}”，请换个关键词试试。
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {matches.map((m, idx) => {
                const doc = docMap[m.docId]
                return (
                  <button
                    key={`${m.docId}-${m.page}-${idx}`}
                    onClick={() => onOpenDoc(m.docId, m.page)}
                    className="text-left bg-white rounded-xl border border-slate-200 hover:border-indigo-400 hover:shadow-sm p-4 transition cursor-pointer group"
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-1.5 min-w-0">
                        {doc?.type === 'PDF' ? (
                          <FileText className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        ) : (
                          <Presentation className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        )}
                        <span className="text-xs font-bold text-slate-800 truncate">
                          {doc?.shortTitle}
                        </span>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 group-hover:bg-indigo-600 group-hover:text-white text-xs font-mono font-bold transition shrink-0 inline-flex items-center gap-1">
                        <Eye className="w-3 h-3" /> P{m.page}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-4 whitespace-pre-line leading-relaxed">
                      {m.text}
                    </p>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
