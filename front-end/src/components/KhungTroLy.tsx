import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useTroLy } from '../store/troLy'

const sample = [
  { from: 'bot', text: 'Chào bạn, mình là trợ lý TechZone. Mình có thể **tư vấn linh kiện**, **so sánh sản phẩm**, gợi ý **cấu hình theo ngân sách** hoặc **viết mô tả** cho sản phẩm.' },
  { from: 'me', text: 'So sánh RTX 4060 và RX 7600 giúp mình.' },
  {
    from: 'bot',
    text: '| Tiêu chí | RTX 4060 | RX 7600 |\n|---|---|---|\n| Giá | 8.190.000 ₫ | 6.490.000 ₫ |\n| VRAM | 8GB GDDR6 | 8GB GDDR6 |\n| Công suất | 115W | 165W |\n\nNếu ưu tiên tiết kiệm điện, **RTX 4060** là lựa chọn phù hợp hơn.',
  },
]

const quick = ['Tư vấn card đồ họa dưới 9 triệu', 'Build PC gaming 20 triệu']

export default function KhungTroLy() {
  const { open, show, hide } = useTroLy()

  if (!open)
    return (
      <button
        onClick={show}
        className="fixed right-4 bottom-4 z-40 h-14 rounded-full bg-brand px-6 font-semibold text-white shadow-lg transition-colors hover:bg-brand-dark sm:right-6 sm:bottom-6"
      >
        Hỏi TechZone AI
      </button>
    )

  return (
    <section
      aria-label="Trợ lý TechZone"
      className="rise fixed inset-x-0 bottom-0 z-50 flex h-[78vh] flex-col overflow-hidden rounded-t-xl bg-white shadow-2xl sm:inset-x-auto sm:right-6 sm:bottom-6 sm:h-[34rem] sm:w-[25rem] sm:rounded-xl"
    >
      <header className="flex items-center justify-between bg-brand px-4 py-3 text-white">
        <div>
          <div className="font-bold">TechZone AI</div>
          <div className="text-sm text-white/80">Tư vấn, so sánh, build cấu hình</div>
        </div>
        <button onClick={hide} aria-label="Đóng trò chuyện" className="-m-2 p-2 text-2xl leading-none">
          ×
        </button>
      </header>
      <div className="flex-1 space-y-3 overflow-y-auto bg-surface p-4">
        {sample.map((m, i) => (
          <div key={i} className={m.from === 'me' ? 'flex justify-end' : 'flex'}>
            <div
              className={
                m.from === 'me'
                  ? 'max-w-[85%] rounded-lg bg-brand px-3 py-2 text-[15px] text-white'
                  : 'prose prose-sm max-w-[92%] overflow-x-auto rounded-lg bg-white px-3 py-2'
              }
            >
              {m.from === 'me' ? m.text : <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.text}</ReactMarkdown>}
            </div>
          </div>
        ))}
        <div className="flex flex-col items-start gap-2 pt-1">
          {quick.map((q) => (
            <button key={q} type="button" className="rounded-full bg-white px-3 py-1.5 text-left text-sm font-medium text-brand-dark hover:bg-brand-soft">
              {q}
            </button>
          ))}
        </div>
      </div>
      <form onSubmit={(e) => e.preventDefault()} className="flex gap-2 bg-white p-3">
        <input
          placeholder="Nhập câu hỏi của bạn"
          aria-label="Nhập câu hỏi"
          className="h-11 flex-1 rounded-md bg-surface px-3 text-[15px] focus:bg-white focus:outline-2 focus:outline-brand"
        />
        <button className="h-11 rounded-md bg-brand px-4 font-semibold text-white hover:bg-brand-dark">Gửi</button>
      </form>
    </section>
  )
}
