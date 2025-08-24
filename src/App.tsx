import React, { useEffect, useMemo, useRef, useState } from "react"
import { Menu, X, Moon, Sun, Snowflake, Shield, Truck, Package, Fish, ArrowRight, Info } from "lucide-react"
import { motion, type Variants } from "framer-motion" 

const hero: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}

const line: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
}

type Product = {
  id: string
  name: string
  summary: string
  price: string
  size: string
  img: string
  tags: string[]
  storage: string
  cook: string[]
  desc: string
}

const BUSINESS = {
  brand: "정도 正道",
  domain: "koreanshrimp.com",
  origin: "전남 영암",
  ceo: "임태산",
  phone: "010-8285-6500",
  bank: { name: "농협", number: "000-00-000000", holder: "임태산" },
  cutoff: "당일 발송 마감 14:00",
  tagline: "좋은 새우는 정직한 길에서 온다",
}

const PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "상품 1 | 왕새우",
    summary: "대/특대 사이즈 신선 동결 왕새우",
    price: "시세",
    size: "대/특대",
    img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1600&auto=format&fit=crop",
    tags: ["왕새우", "대/특대"],
    storage: "영하 18℃ 이하, 해동 후 재냉동 비권장",
    cook: ["소금구이", "버터구이", "새우탕"],
    desc: "영암 산지 직도매 → 선별·세척 → 급속동결 → 콜드체인 유통.",
  },
  {
    id: "p2",
    name: "상품 2 | 왕새우 믹스팩",
    summary: "가정·소분용 혼합 팩",
    price: "시세",
    size: "대/특대 혼합",
    img: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1600&auto=format&fit=crop",
    tags: ["혼합팩", "가정용"],
    storage: "영하 18℃ 이하",
    cook: ["감바스", "파스타", "튀김"],
    desc: "용도에 맞게 골라 쓰는 구성. 손님 접대용으로 인기.",
  },
  {
    id: "p3",
    name: "상품 3 | 특대 왕새우 선물세트",
    summary: "명절·기념일 선물 포장 세트",
    price: "시세",
    size: "특대",
    img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1600&auto=format&fit=crop",
    tags: ["선물세트", "특대"],
    storage: "영하 18℃ 이하",
    cook: ["그릴", "버터갈릭", "찜"],
    desc: "선별 등급 상향 구성. 보냉 포장 강화로 안전 배송.",
  },
  {
    id: "p4",
    name: "상품 4 | 패밀리팩 2kg",
    summary: "가정용 대용량 구성",
    price: "시세",
    size: "대",
    img: "https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?q=80&w=1600&auto=format&fit=crop",
    tags: ["가정용", "대용량"],
    storage: "영하 18℃ 이하",
    cook: ["에어프라이", "버터구이", "튀김"],
    desc: "가성비 중량 패키지. 캠핑·홈파티에 적합.",
  },
]

function useDark() {
  const [dark, setDark] = useState<boolean>(() => localStorage.getItem("theme") === "dark")
  useEffect(() => {
    const root = document.documentElement
    if (dark) { root.classList.add("dark"); localStorage.setItem("theme", "dark") }
    else { root.classList.remove("dark"); localStorage.setItem("theme", "light") }
  }, [dark])
  return { dark, setDark }
}

function ImageWithFallback({ src, alt }: { src: string; alt: string }) {
  const [s, setS] = useState(src)
  return (
    <img
      src={s}
      alt={alt}
      onError={() =>
        setS("https://images.unsplash.com/photo-1553621042-f6e147245754?q=80&w=1600&auto=format&fit=crop")
      }
      className="w-full h-full object-cover"
    />
  )
}

type SectionVariant = "a" | "b" | "c";

function SectionCard(
  { children, variant = "a" }: { children: React.ReactNode; variant?: SectionVariant }
) {
  const cls =
    variant === "a"
      ? "rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/70 p-6 md:p-10"
      : variant === "b"
      ? "rounded-3xl border border-slate-200 bg-sky-50 shadow-sm dark:border-slate-800 dark:bg-gradient-to-b dark:from-slate-900 dark:to-slate-950 p-6 md:p-10"
      : "rounded-3xl border border-slate-200 bg-slate-50/90 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/60 p-6 md:p-10";
  return <div className={cls}>{children}</div>;
}


export default function App() {
  const { dark, setDark } = useDark()
  const [menuOpen, setMenuOpen] = useState(false)
  const [q, setQ] = useState("")
  const [tag, setTag] = useState("all")
  const [open, setOpen] = useState<Product | null>(null)
  const closeBtnRef = useRef<HTMLButtonElement | null>(null)
  useEffect(() => {
    if (open && closeBtnRef.current) closeBtnRef.current.focus()
  }, [open])

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [open])

  const tags = ["all", ...Array.from(new Set(PRODUCTS.flatMap(p => p.tags)))]
  const filtered = useMemo(() => {
    return PRODUCTS.filter(p => {
      const hit = [p.name, p.summary].join(" ").toLowerCase().includes(q.toLowerCase())
      const t = tag === "all" ? true : p.tags.includes(tag)
      return hit && t
    })
  }, [q, tag])

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-cyan-50 to-white text-slate-900 dark:from-slate-950 dark:via-slate-950 dark:to-slate-950 dark:text-slate-100">
      <header className="sticky top-0 z-30 border-b border-sky-100/70 bg-white/60 backdrop-blur dark:border-slate-800 dark:bg-slate-950/60">
        <div className="mx-auto max-w-6xl px-4">
          <div className="h-14 flex items-center">
            <div className="font-semibold">{BUSINESS.brand} <span className="text-sky-700/80">| {BUSINESS.domain}</span></div>
            <nav className="hidden md:flex gap-6 ml-auto mr-3 md:mr-6">
              <a href="#intro" className="text-sm hover:text-sky-700">소개</a>
              <a href="#process" className="text-sm hover:text-sky-700">과정</a>
              <a href="#products" className="text-sm hover:text-sky-700">상품</a>
              <a href="#contact" className="text-sm hover:text-sky-700">문의</a>
            </nav>
            <div className="ml-auto md:ml-0 flex items-center gap-2">
              <button onClick={() => setDark(!dark)} className="h-9 w-9 inline-flex items-center justify-center rounded-md border border-sky-200 hover:bg-sky-50 dark:border-slate-700 dark:hover:bg-slate-900">
                {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
              <button onClick={() => setMenuOpen(v => !v)} className="md:hidden h-9 w-9 inline-flex items-center justify-center rounded-md border border-sky-200 hover:bg-sky-50 dark:border-slate-700 dark:hover:bg-slate-900">
                {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
          {menuOpen && (
            <div className="md:hidden pb-3">
              <div className="flex flex-col gap-2 items-end">
                <a onClick={() => setMenuOpen(false)} href="#intro" className="px-3 py-2 rounded hover:bg-sky-50 dark:hover:bg-slate-900">소개</a>
                <a onClick={() => setMenuOpen(false)} href="#process" className="px-3 py-2 rounded hover:bg-sky-50 dark:hover:bg-slate-900">과정</a>
                <a onClick={() => setMenuOpen(false)} href="#products" className="px-3 py-2 rounded hover:bg-sky-50 dark:hover:bg-slate-900">상품</a>
                <a onClick={() => setMenuOpen(false)} href="#contact" className="px-3 py-2 rounded hover:bg-sky-50 dark:hover:bg-slate-900">문의</a>
              </div>
            </div>
          )}
        </div>
      </header>

      <div className="w-full border-b border-sky-100 bg-sky-50/70 text-slate-800 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300">
        <div className="mx-auto max-w-6xl px-4 py-2 text-[13px] md:text-sm flex items-center gap-2 text-slate-800 dark:text-slate-300">
          <Info className="h-4 w-4 text-sky-700 dark:text-slate-300" />
          <span className="truncate">{BUSINESS.cutoff} · 아이스팩/아이스박스 포함 · 냉동 제품</span>
        </div>
      </div>

      <section className="mx-auto max-w-6xl px-4 py-10" id="intro">
        <SectionCard variant="a">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <div>
              <motion.h1
                variants={hero}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="font-extrabold leading-[1.12] tracking-[-0.01em] text-[clamp(28px,6vw,48px)]"
              >
                <motion.span variants={line} className="block">좋은 새우는,</motion.span>
                <motion.span variants={line} className="block">정직한 길에서 옵니다.</motion.span>
              </motion.h1>

              <p className="mt-4 text-slate-900 dark:text-slate-200">
                전남 영암 산지에서 정직하게 들여온 왕새우.
                <span className="block">전자상거래 없이 계좌입금과 문자로만 판매.</span>
              </p>

              <div className="mt-6 flex gap-3">
                <a href="#products" className="px-4 py-2 rounded-md bg-sky-600 text-white hover:bg-sky-700 inline-flex items-center gap-2">상품 보러가기 <ArrowRight className="h-4 w-4" /></a>
                <a href="#process" className="px-4 py-2 rounded-md border border-sky-200 text-sky-900 hover:bg-sky-50 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-900">안심 과정 보기</a>
              </div>
              <div className="mt-6 flex gap-2 text-sm">
                <span className="rounded-full bg-sky-100 text-sky-900 px-3 py-1 inline-flex items-center gap-1"><Fish className="h-4 w-4" />산지직도매</span>
                <span className="rounded-full bg-cyan-100 text-cyan-900 px-3 py-1 inline-flex items-center gap-1"><Snowflake className="h-4 w-4" />콜드체인</span>
                <span className="rounded-full bg-sky-100 text-sky-900 px-3 py-1 inline-flex items-center gap-1"><Shield className="h-4 w-4" />시세판매</span>
              </div>
            </div>
            <div className="rounded-2xl border border-sky-100 p-6 bg-white shadow dark:bg-slate-950 dark:border-slate-800">
              <div className="grid sm:grid-cols-3 gap-3">
                <div className="rounded-xl border p-4 text-sm flex items-center gap-2 dark:border-slate-700"><Snowflake className="h-4 w-4" />급속동결</div>
                <div className="rounded-xl border p-4 text-sm flex items-center gap-2 dark:border-slate-700"><Shield className="h-4 w-4" />선별·세척</div>
                <div className="rounded-xl border p-4 text-sm flex items-center gap-2 dark:border-slate-700"><Truck className="h-4 w-4" />신속배송</div>
              </div>
            </div>
          </div>
        </SectionCard>
      </section>

      <section id="process" className="mx-auto max-w-6xl px-4 py-10">
        <SectionCard variant="b">
          <h2 className="text-2xl md:text-3xl font-semibold text-center">안심 유통 과정</h2>
          <div className="grid md:grid-cols-3 gap-4 mt-8">
            <div className="border rounded-2xl p-5 dark:border-slate-700">
              <div className="font-medium inline-flex items-center gap-2"><Package className="h-4 w-4" />산지 도매 확보</div>
              <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">{BUSINESS.origin} 직도매(대표 {BUSINESS.ceo})</p>
            </div>
            <div className="border rounded-2xl p-5 dark:border-slate-700">
              <div className="font-medium inline-flex items-center gap-2"><Shield className="h-4 w-4" />선별·세척</div>
              <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">사이즈·상태 검수</p>
            </div>
            <div className="border rounded-2xl p-5 dark:border-slate-700">
              <div className="font-medium inline-flex items-center gap-2"><Snowflake className="h-4 w-4" />급속동결·콜드체인</div>
              <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">저온 유지로 신선도 보존</p>
            </div>
          </div>
        </SectionCard>
      </section>

      <section id="products" className="mx-auto max-w-6xl px-4 py-10">
        <SectionCard variant="a">
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <h2 className="text-2xl md:text-3xl font-semibold">상품</h2>
              <p className="text-slate-900 dark:text-slate-200 mt-1">클릭하면 구매안내가 열림</p>
            </div>
            <div className="flex gap-2">
              <input
                value={q}
                onChange={e => setQ(e.target.value)}
                placeholder="검색: 왕새우, 혼합팩…"
                className="h-10 w-44 md:w-64 rounded-md border border-sky-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-sky-300 dark:bg-slate-950 dark:border-slate-700"
              />
              <select
                value={tag}
                onChange={e => setTag(e.target.value)}
                className="h-10 rounded-md border border-sky-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-sky-300 dark:bg-slate-950 dark:border-slate-700"
              >
                {tags.map((t) => (
                  <option key={t} value={t}>{t === "all" ? "전체" : t}</option>
                ))}
              </select>

            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mt-6">
            {filtered.map(p => (
              <div key={p.id} className="overflow-hidden rounded-2xl border border-sky-100 bg-white hover:-translate-y-0.5 hover:shadow-lg transition dark:bg-slate-950 dark:border-slate-800">
                <div className="aspect-[16/9] bg-sky-100/50 dark:bg-slate-900">
                  <ImageWithFallback src={p.img} alt={p.name} />
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-center">
                    <div className="text-lg font-semibold">{p.name}</div>
                    <div className="flex gap-1">
                      {p.tags.map(t => <span key={t} className="rounded-full bg-sky-100 text-sky-900 dark:bg-slate-800 dark:text-slate-200 text-xs px-2 py-1">{t}</span>)}
                    </div>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 mt-1">{p.summary}</p>
                  <button
                    onClick={() => setOpen(p)}
                    className="mt-3 text-sm px-3 py-2 rounded-md bg-sky-600 text-white hover:bg-sky-700"
                  >
                    자세히/구매안내
                  </button>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </section>

      <section id="contact" className="mx-auto max-w-6xl px-4 py-10">
        <SectionCard variant="c">
          <h2 className="text-2xl md:text-3xl font-semibold">문의/주문</h2>
          <p className="mt-1 text-slate-900 dark:text-slate-200">전자상거래 없이 연락처·계좌로 진행</p>
          <div className="grid sm:grid-cols-2 gap-4 mt-6">
            <div className="rounded-2xl border p-4 dark:border-slate-700">
              <div className="font-medium">대표 연락처</div>
              <div className="mt-2 inline-flex items-center gap-2 rounded-xl border px-3 py-2 dark:border-slate-700">{BUSINESS.phone}</div>
            </div>
            <div className="rounded-2xl border p-4 dark:border-slate-700">
              <div className="font-medium">입금 계좌</div>
              <div className="mt-2 rounded-xl border px-3 py-2 text-sm bg-sky-50 dark:bg-slate-900 dark:border-slate-700">
                {BUSINESS.bank.name} {BUSINESS.bank.number} ({BUSINESS.bank.holder})
              </div>
            </div>
          </div>
          <ul className="list-disc pl-5 text-sm text-slate-900 dark:text-slate-300 mt-4">
            <li>시세 변동에 따라 금액이 달라질 수 있음</li>
            <li>냉동 제품 특성상 해동 후 단순 변심 반품 불가</li>
            <li>도서·산간 지역은 배송 일정 추가 소요</li>
          </ul>
        </SectionCard>
      </section>

      <footer className="border-t border-sky-100 dark:border-slate-800 py-8 text-sm">
        <div className="mx-auto max-w-6xl px-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div className="text-slate-800 dark:text-slate-300">© {new Date().getFullYear()} {BUSINESS.brand}. {BUSINESS.domain}</div>
          <div className="flex gap-4 text-slate-800 dark:text-slate-300">
            <a href="#intro" className="hover:text-sky-700">소개</a>
            <a href="#process" className="hover:text-sky-700">과정</a>
            <a href="#products" className="hover:text-sky-700">상품</a>
            <a href="#contact" className="hover:text-sky-700">문의</a>
          </div>
        </div>
      </footer>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onKeyDown={(e) => e.key === "Escape" && setOpen(null)}>
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(null)} />
          <div className="relative z-10 w-[92%] max-w-2xl rounded-2xl bg-white shadow-xl ring-1 ring-slate-200/60 dark:bg-slate-950 dark:ring-slate-700 max-h-[85vh] flex flex-col">
            <div className="sticky top-0 flex items-center justify-between p-4 border-b dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur rounded-t-2xl">
              <div className="text-lg font-semibold">{open.name}</div>
              <button ref={closeBtnRef} onClick={() => setOpen(null)} className="rounded-md p-2 hover:bg-slate-100 dark:hover:bg-slate-900">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="overflow-y-auto p-4 space-y-4">
              <div className="aspect-[16/9] w-full rounded-lg overflow-hidden bg-sky-50 dark:bg-slate-900">
                <ImageWithFallback src={open.img} alt={open.name} />
              </div>
              <div>
                <div className="text-sm text-slate-800 dark:text-slate-300">사이즈: {open.size} · 가격: {open.price}</div>
                <p className="mt-3 text-slate-900 dark:text-slate-200">{open.desc}</p>
                <ul className="list-disc pl-5 text-sm text-slate-900 dark:text-slate-300 mt-3">
                  <li>보관: {open.storage}</li>
                  <li>추천 요리: {open.cook.join(", ")}</li>
                </ul>
              </div>
              <div className="rounded-2xl border p-4 text-sm dark:border-slate-700">
                <div className="font-medium flex items-center gap-2"><Truck className="h-4 w-4" />배송/보관 안내</div>
                <div className="mt-2 space-y-1">
                  <div>전국 택배, {BUSINESS.cutoff}</div>
                  <div>아이스팩/아이스박스 포함</div>
                  <div>해동 후 재냉동 비권장</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="font-semibold">입금 계좌</div>
                <div className="rounded-xl border p-3 text-sm bg-sky-50 dark:bg-slate-900 dark:border-slate-700">
                  {BUSINESS.bank.name} {BUSINESS.bank.number} ({BUSINESS.bank.holder})
                </div>
                <div className="text-xs text-slate-700 dark:text-slate-400">시세 판매로 금액은 문의 시 안내</div>
              </div>
              <div className="space-y-2">
                <div className="font-semibold">주문 문자 보내기</div>
                <div className="rounded-xl border p-3 text-sm whitespace-pre-line dark:border-slate-700">
                  입금했습니다.
                  {"\n"}주문자: (성함)
                  {"\n"}연락처: (번호)
                  {"\n"}주소: (도로명주소)
                  {"\n"}상품: {open.name}
                  {"\n"}요청사항: (예: 수령희망일/부재시 문앞)
                </div>
              </div>
            </div>
            <div className="sticky bottom-0 flex items-center justify-end gap-2 p-3 border-t dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur rounded-b-2xl">
              <button
                onClick={() => navigator.clipboard.writeText(`입금했습니다.\n주문자: (성함)\n연락처: (번호)\n주소: (도로명주소)\n상품: ${open.name}\n요청사항: (예: 수령희망일/부재시 문앞)`)}
                className="px-3 py-2 rounded-md border text-sm hover:bg-sky-50 dark:border-slate-700 dark:hover:bg-slate-900"
              >
                양식 복사
              </button>
              <a href={`sms:${BUSINESS.phone}`} className="px-3 py-2 rounded-md bg-sky-600 text-white text-sm hover:bg-sky-700">
                문자앱 열기
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
