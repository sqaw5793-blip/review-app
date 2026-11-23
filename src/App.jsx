import { useState, useEffect } from 'react'
import {
  LayoutDashboard,
  FileText,
  Presentation,
  Search,
  Layers,
  Sparkles,
  Eye,
  Menu,
  X,
  ShieldCheck,
  PanelRightOpen,
} from 'lucide-react'
import { DOCUMENTS, CHAPTER_TOPICS } from './data/documents'
import OverviewDashboard from './components/OverviewDashboard'
import KnowledgeView from './components/KnowledgeView'
import FlashcardsView from './components/FlashcardsView'
import QuizView from './components/QuizView'
import GlobalSearchView from './components/GlobalSearchView'
import DocViewer from './components/DocViewer'

const STORAGE_KEY = 'infosec_review_mastered_v1'

export default function App() {
  const [activeView, setActiveView] = useState('overview') // 'overview' | 'search' | 'flashcards' | 'quiz' | docId
  const [viewerState, setViewerState] = useState({
    open: false,
    docId: 'ch2_1',
    page: 1,
    expanded: false,
  })
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [masteredIds, setMasteredIds] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(masteredIds))
    } catch {
      // ignore storage errors
    }
  }, [masteredIds])

  const allTopics = Object.values(CHAPTER_TOPICS).flat()
  const progressPct = allTopics.length
    ? Math.round((masteredIds.length / allTopics.length) * 100)
    : 0

  const handleToggleMastered = (topicId) => {
    setMasteredIds((prev) =>
      prev.includes(topicId)
        ? prev.filter((id) => id !== topicId)
        : [...prev, topicId]
    )
  }

  const handleOpenDoc = (docId, page = 1) => {
    setViewerState((prev) => ({
      ...prev,
      open: true,
      docId,
      page,
    }))
  }

  const handleSelectNav = (viewId) => {
    setActiveView(viewId)
    setMobileMenuOpen(false)
    if (viewerState.expanded) {
      setViewerState((prev) => ({ ...prev, expanded: false }))
    }
  }

  const isChapterView = DOCUMENTS.some((d) => d.id === activeView)

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-slate-50">
      {/* Top Navbar */}
      <header className="h-14 bg-white border-b border-slate-200 px-4 flex items-center justify-between gap-3 shrink-0 z-30">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div
            onClick={() => handleSelectNav('overview')}
            className="flex items-center gap-2 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-slate-900 text-sm leading-tight">
                信息安全期末复习工作台
              </div>
              <div className="text-[11px] text-slate-400 leading-tight hidden sm:block">
                PPT / PDF 原文直开 · 考点精炼 · 闪卡刷题
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleSelectNav('search')}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-medium transition cursor-pointer"
          >
            <Search className="w-3.5 h-3.5" />
            搜 451 页课件
          </button>

          <button
            onClick={() =>
              setViewerState((prev) => ({
                ...prev,
                open: !prev.open,
                docId: isChapterView ? activeView : prev.docId,
              }))
            }
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              viewerState.open
                ? 'bg-indigo-600 text-white hover:bg-indigo-500'
                : 'bg-slate-900 text-white hover:bg-slate-800'
            }`}
          >
            <PanelRightOpen className="w-3.5 h-3.5" />
            {viewerState.open ? '隐藏课件预览' : '打开 PPT / PDF'}
          </button>
        </div>
      </header>

      {/* Main Body */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Mobile Backdrop */}
        {mobileMenuOpen && (
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-slate-900/40 z-20 lg:hidden"
          />
        )}

        {/* Left Sidebar */}
        <aside
          className={`fixed lg:static inset-y-0 left-0 top-14 lg:top-0 z-20 w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 transition-transform duration-200 ${
            mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <div className="flex-1 overflow-y-auto p-3 space-y-5">
            {/* General Nav */}
            <div className="space-y-1">
              <div className="px-2.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                复习导航
              </div>
              {[
                { id: 'overview', label: '复习总览 & 对比表', icon: LayoutDashboard },
                { id: 'search', label: '全文搜课件 (451页)', icon: Search },
                { id: 'flashcards', label: '高频闪卡背诵', icon: Layers },
                { id: 'quiz', label: '考前模拟自测', icon: Sparkles },
              ].map((item) => {
                const Icon = item.icon
                const active = activeView === item.id
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectNav(item.id)}
                    className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
                      active
                        ? 'bg-indigo-50 text-indigo-700'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </button>
                )
              })}
            </div>

            {/* Chapters List */}
            <div className="space-y-1">
              <div className="px-2.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                课件知识点（6 份）
              </div>
              {DOCUMENTS.map((doc) => {
                const active = activeView === doc.id
                const topics = CHAPTER_TOPICS[doc.id] || []
                const done = topics.filter((t) => masteredIds.includes(t.id)).length
                return (
                  <div
                    key={doc.id}
                    className={`group flex items-center gap-1 rounded-lg transition ${
                      active ? 'bg-indigo-50' : 'hover:bg-slate-100'
                    }`}
                  >
                    <button
                      onClick={() => handleSelectNav(doc.id)}
                      className={`flex-1 flex items-center gap-2 px-2.5 py-2 text-left text-xs font-medium min-w-0 cursor-pointer ${
                        active ? 'text-indigo-700 font-semibold' : 'text-slate-700'
                      }`}
                    >
                      {doc.type === 'PDF' ? (
                        <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <Presentation className="w-4 h-4 text-amber-600 shrink-0" />
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="truncate">{doc.shortTitle}</div>
                        <div className="text-[10px] text-slate-400">
                          {doc.pageCount}页 · 已掌握 {done}/{topics.length}
                        </div>
                      </div>
                    </button>
                    <button
                      onClick={() => handleOpenDoc(doc.id, 1)}
                      title={`直接打开 ${doc.filename}`}
                      className="p-1.5 mr-1 rounded-md text-slate-400 hover:text-indigo-600 hover:bg-white transition cursor-pointer shrink-0"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Bottom Progress */}
          <div className="p-3.5 border-t border-slate-100 bg-slate-50/70">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-semibold text-slate-700">总复习进度</span>
              <span className="font-bold text-indigo-600">{progressPct}%</span>
            </div>
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              已掌握 {masteredIds.length} / {allTopics.length} 个核心模块
            </div>
          </div>
        </aside>

        {/* Center Content Area */}
        {(!viewerState.open || !viewerState.expanded) && (
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 min-w-0">
            <div className="max-w-5xl mx-auto">
              {activeView === 'overview' && (
                <OverviewDashboard
                  masteredIds={masteredIds}
                  onSelectChapter={(id) => handleSelectNav(id)}
                  onOpenDoc={handleOpenDoc}
                  onNavigate={handleSelectNav}
                />
              )}
              {isChapterView && (
                <KnowledgeView
                  docId={activeView}
                  masteredIds={masteredIds}
                  onToggleMastered={handleToggleMastered}
                  onOpenDoc={handleOpenDoc}
                />
              )}
              {activeView === 'flashcards' && (
                <FlashcardsView onOpenDoc={handleOpenDoc} />
              )}
              {activeView === 'quiz' && <QuizView onOpenDoc={handleOpenDoc} />}
              {activeView === 'search' && (
                <GlobalSearchView onOpenDoc={handleOpenDoc} />
              )}
            </div>
          </main>
        )}

        {/* Right Dockable PPT / PDF Live Viewer */}
        {viewerState.open && (
          <section
            className={`shrink-0 h-full transition-all duration-200 ${
              viewerState.expanded
                ? 'flex-1 w-full'
                : 'w-full md:w-[46%] xl:w-[48%] fixed md:static inset-0 top-14 md:top-0 z-20'
            }`}
          >
            <DocViewer
              docId={viewerState.docId}
              page={viewerState.page}
              isExpanded={viewerState.expanded}
              onToggleExpand={() =>
                setViewerState((prev) => ({ ...prev, expanded: !prev.expanded }))
              }
              onClose={() =>
                setViewerState((prev) => ({ ...prev, open: false, expanded: false }))
              }
              onSelectDoc={(docId, page) =>
                setViewerState((prev) => ({ ...prev, docId, page }))
              }
              onPageChange={(page) =>
                setViewerState((prev) => ({ ...prev, page }))
              }
            />
          </section>
        )}
      </div>
    </div>
  )
}
