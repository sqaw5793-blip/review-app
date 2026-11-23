import { useState, useEffect } from 'react'
import {
  X,
  Maximize2,
  Minimize2,
  Download,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  FileText,
  Presentation,
} from 'lucide-react'
import { DOCUMENTS } from '../data/documents'

export default function DocViewer({
  docId,
  page,
  isExpanded,
  onToggleExpand,
  onClose,
  onSelectDoc,
  onPageChange,
}) {
  const doc = DOCUMENTS.find((d) => d.id === docId) || DOCUMENTS[0]
  const [pageInput, setPageInput] = useState(String(page || 1))

  useEffect(() => {
    setPageInput(String(page || 1))
  }, [page, docId])

  const currentPage = Math.max(1, Math.min(doc.pageCount, Number(page) || 1))
  const iframeSrc = `${doc.pdfUrl}#page=${currentPage}&view=FitH`

  const handleJump = (e) => {
    e.preventDefault()
    const num = parseInt(pageInput, 10)
    if (!isNaN(num)) {
      const clamped = Math.max(1, Math.min(doc.pageCount, num))
      onPageChange(clamped)
      setPageInput(String(clamped))
    }
  }

  return (
    <div className="flex flex-col h-full bg-white border-l border-slate-200 shadow-xl">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-2 px-3 py-2.5 bg-slate-900 text-white shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          {doc.type === 'PDF' ? (
            <FileText className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <Presentation className="w-4 h-4 text-amber-400 shrink-0" />
          )}
          <select
            value={doc.id}
            onChange={(e) => onSelectDoc(e.target.value, 1)}
            className="bg-slate-800 text-white text-xs font-medium rounded-md px-2 py-1 border border-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-400 max-w-[200px] sm:max-w-[260px] truncate cursor-pointer"
          >
            {DOCUMENTS.map((d) => (
              <option key={d.id} value={d.id}>
                [{d.type}] {d.filename}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <a
            href={iframeSrc}
            target="_blank"
            rel="noopener noreferrer"
            title="在新标签页打开预览"
            className="p-1.5 rounded hover:bg-slate-700 text-slate-300 hover:text-white transition"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
          <a
            href={doc.origUrl}
            download={doc.filename}
            title={`下载原始 ${doc.type} 文件`}
            className="flex items-center gap-1 px-2 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">原文件</span>
          </a>
          <button
            onClick={onToggleExpand}
            title={isExpanded ? '恢复分屏' : '全宽查看'}
            className="p-1.5 rounded hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={onClose}
            title="关闭课件预览"
            className="p-1.5 rounded hover:bg-rose-600 text-slate-300 hover:text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Page Navigation Bar */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-slate-100 border-b border-slate-200 text-xs text-slate-600 shrink-0">
        <div className="flex items-center gap-1.5">
          <span className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 font-semibold">
            {doc.type === 'PDF' ? 'PDF 原件' : `${doc.type} 高保真预览`}
          </span>
          <span className="hidden md:inline text-slate-500 truncate max-w-[200px]">
            {doc.filename}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage <= 1}
            className="p-1 rounded hover:bg-slate-200 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
            title="上一页"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <form onSubmit={handleJump} className="flex items-center gap-1">
            <span>第</span>
            <input
              type="text"
              value={pageInput}
              onChange={(e) => setPageInput(e.target.value)}
              className="w-11 text-center bg-white border border-slate-300 rounded px-1 py-0.5 text-xs font-medium text-slate-800 focus:outline-none focus:border-indigo-500"
            />
            <span>/ {doc.pageCount} 页</span>
          </form>
          <button
            onClick={() => onPageChange(Math.min(doc.pageCount, currentPage + 1))}
            disabled={currentPage >= doc.pageCount}
            className="p-1 rounded hover:bg-slate-200 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
            title="下一页"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Embedded Native PDF/PPT Viewer */}
      <div className="flex-1 bg-slate-200 relative overflow-hidden">
        <iframe
          key={`${doc.id}-${currentPage}`}
          src={iframeSrc}
          title={doc.filename}
          className="w-full h-full border-0"
        />
      </div>
    </div>
  )
}
