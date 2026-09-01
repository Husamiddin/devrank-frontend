import React, { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import Editor from "@monaco-editor/react";
import {
  Activity,
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronRight,
  Code2,
  ExternalLink,
  Eye,
  FileCode2,
  Flame,
  Globe2,
  Home,
  Layers3,
  LineChart,
  Loader2,
  LogIn,
  LogOut,
  Menu,
  MessageSquare,
  Pencil,
  Play,
  Plus,
  RefreshCw,
  Rocket,
  Search,
  Shield,
  Sparkles,
  Star,
  Terminal,
  Trash2,
  Trophy,
  User,
  Users,
  WalletCards,
  X,
} from "lucide-react";

const API_URL = "https://devrank-backend-production.up.railway.app";
const API_BASE_URL = API_URL || import.meta.env.VITE_API_URL || "https://devrank-backend-production.up.railway.app";

const STORAGE = {
  token: "devrank_token",
  user: "devrank_user",
};

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 25000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(STORAGE.token);
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

function apiMessage(error, fallback = "Server bilan bog‘lanishda xatolik yuz berdi.") {
  if (error?.response?.data?.message) return error.response.data.message;
  if (error?.response?.status === 429) return "Juda ko‘p so‘rov yuborildi. Bir ozdan keyin qayta urinib ko‘ring.";
  if (error?.request) return "Backend javob bermadi. Server ishlayotganini tekshiring.";
  return error?.message || fallback;
}

function cn(...items) {
  return items.filter(Boolean).join(" ");
}

function initials(name = "") {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((item) => item[0]?.toUpperCase() || "")
      .join("") || "DU"
  );
}

function formatScore(value) {
  return new Intl.NumberFormat("uz-UZ").format(Number(value || 0));
}

function normalizeUser(raw) {
  const user = raw?.user || raw?.profile || raw || {};
  return {
    id: user.id || "",
    name: user.name || "",
    username: user.username || "",
    email: user.email || "",
    phone: user.phone || "",
    bio: user.bio || "",
    role: user.role || "Full Stack Developer",
    level: Number(user.level || 1),
    province: user.province || "Toshkent shahri",
    avatar: user.avatar || "",
    primaryCategory: user.primaryCategory || "web",
    score: Number(user.score || 0),
    rank: Number(user.rank || 0),
    projectsCount: Number(user.projectsCount || 0),
    followersCount: Number(user.followersCount || 0),
    topPercent: Number(user.topPercent || 100),
    growth: Number(user.growth || 0),
    online: Boolean(user.online),
    skills: Array.isArray(user.skills) ? user.skills : [],
    projects: Array.isArray(user.projects) ? user.projects : [],
  };
}

const CATEGORIES = [
  { id: "web", title: "Web Development", desc: "Frontend, Backend, APIs & Cloud", icon: Globe2 },
  { id: "ai", title: "AI & Machine Learning", desc: "Python, Models, LLMs & Vectors", icon: Sparkles },
  { id: "cyber", title: "Cyber Security", desc: "AppSec, OWASP, Auth & Systems", icon: Shield },
  { id: "ux", title: "UI / UX Design", desc: "Design Systems, WCAG & Accessibility", icon: Layers3 },
];

const LANGUAGES = [
  ["javascript", "JavaScript", "js"],
  ["typescript", "TypeScript", "ts"],
  ["python", "Python", "py"],
  ["cpp", "C++", "cpp"],
  ["csharp", "C#", "cs"],
];

const PROVINCES = [
  "Toshkent shahri",
  "Toshkent viloyati",
  "Samarqand",
  "Buxoro",
  "Farg‘ona",
  "Andijon",
  "Namangan",
  "Qashqadaryo",
  "Surxondaryo",
  "Xorazm",
  "Navoiy",
  "Jizzax",
  "Sirdaryo",
  "Qoraqalpog‘iston",
];

function Glass({ children, className = "", onClick }) {
  const Tag = onClick ? "button" : "div";
  return (
    <Tag
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={cn(
        "rounded-2xl border border-white/[0.08] bg-[#0d0f17]/80 text-left backdrop-blur-xl shadow-lg transition-all",
        onClick && "cursor-pointer hover:border-violet-500/30 hover:bg-[#121522]/90",
        className
      )}
    >
      {children}
    </Tag>
  );
}

function Button({
  children,
  icon: Icon,
  variant = "primary",
  disabled = false,
  className = "",
  onClick,
  type = "button",
}) {
  const styles = {
    primary: "bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-bold hover:brightness-110 shadow-lg shadow-violet-900/30",
    secondary: "border border-white/10 bg-white/[0.06] text-white hover:bg-white/[0.12]",
    ghost: "border border-transparent text-slate-400 hover:text-white hover:bg-white/[0.05]",
    danger: "border border-red-500/30 bg-red-500/10 text-red-300 hover:bg-red-500/20",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50",
        styles[variant],
        className
      )}
    >
      {Icon ? <Icon size={16} className={disabled ? "animate-spin" : ""} /> : null}
      {children}
    </button>
  );
}

function Field({ label, icon: Icon, error, ...props }) {
  return (
    <label className="block">
      <div className="mb-1.5 flex justify-between text-xs text-slate-400 font-medium">
        <span>{label}</span>
        {error ? <span className="text-red-400">{error}</span> : null}
      </div>
      <div
        className={cn(
          "flex items-center gap-3 rounded-xl border bg-white/[0.02] px-3.5 py-2.5 transition focus-within:border-violet-500 focus-within:ring-1 focus-within:ring-violet-500/30",
          error ? "border-red-500/40" : "border-white/10"
        )}
      >
        {Icon ? <Icon size={16} className="shrink-0 text-slate-500" /> : null}
        <input {...props} className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-600" />
      </div>
    </label>
  );
}

function Avatar({ user, size = "md" }) {
  const sizes = {
    sm: "h-9 w-9 text-xs",
    md: "h-11 w-11 text-sm",
    lg: "h-16 w-16 text-lg",
    xl: "h-20 w-20 text-2xl",
  };

  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-violet-600 via-indigo-600 to-cyan-500 font-bold text-white shadow-inner flex items-center justify-center",
        sizes[size]
      )}
    >
      {user?.avatar ? (
        <img src={user.avatar.startsWith("http") ? user.avatar : `${API_BASE_URL}${user.avatar}`} alt={user.name} className="h-full w-full object-cover" />
      ) : (
        <span>{initials(user?.name)}</span>
      )}
      {user?.online ? (
        <span className="absolute bottom-0.5 right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#07080e] bg-emerald-400 ring-1 ring-emerald-400/50" />
      ) : null}
    </div>
  );
}

function Progress({ label, value, color = "from-violet-500 to-cyan-400" }) {
  const number = Math.max(0, Math.min(100, Number(value) || 0));
  return (
    <div>
      <div className="mb-1.5 flex justify-between text-xs">
        <span className="text-slate-400 font-medium">{label}</span>
        <span className="font-bold text-white">{number}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
        <div className={`h-full rounded-full bg-gradient-to-r ${color} transition-all duration-300`} style={{ width: `${number}%` }} />
      </div>
    </div>
  );
}

function Toasts({ items, onRemove }) {
  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[100] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2.5">
      {items.map((item) => (
        <div
          key={item.id}
          className={cn(
            "pointer-events-auto rounded-xl border p-4 backdrop-blur-xl shadow-2xl transition animate-in slide-in-from-top-2",
            item.type === "success" ? "border-emerald-500/30 bg-[#0c1813]/95 text-emerald-100" : "border-red-500/30 bg-[#1a0c0e]/95 text-red-100"
          )}
        >
          <div className="flex gap-3">
            <AlertCircle size={18} className={cn("mt-0.5 shrink-0", item.type === "success" ? "text-emerald-400" : "text-red-400")} />
            <div className="min-w-0 flex-1">
              <div className="text-sm font-bold">{item.title}</div>
              <div className="mt-0.5 text-xs text-slate-300 leading-5">{item.message}</div>
            </div>
            <button type="button" onClick={() => onRemove(item.id)} className="text-slate-400 hover:text-white">
              <X size={14} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function Header({ eyebrow, title, subtitle, action }) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between border-b border-white/[0.06] pb-6">
      <div>
        {eyebrow ? <div className="text-xs font-bold uppercase tracking-wider text-violet-400">{eyebrow}</div> : null}
        <h1 className="mt-1 text-2xl sm:text-3xl font-black tracking-tight text-white">{title}</h1>
        {subtitle ? <p className="mt-1.5 text-sm text-slate-400">{subtitle}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

function Empty({ text, sub, icon: Icon = AlertCircle, action }) {
  return (
    <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.01] p-10 text-center flex flex-col items-center justify-center">
      <div className="rounded-2xl bg-white/[0.03] p-3 text-slate-500 mb-3">
        <Icon size={24} />
      </div>
      <div className="text-base font-bold text-slate-300">{text}</div>
      <div className="mt-1 text-xs text-slate-500 max-w-sm">{sub}</div>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

// ----------------- AUTH VIEW -----------------
function AuthView({ onAuthenticated, toast }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(e) {
    e.preventDefault();
    setError("");

    if (!form.email.trim() || !form.email.includes("@")) {
      setError("Email manzilini to‘g‘ri kiriting.");
      return;
    }
    if (form.password.length < 6) {
      setError("Parol kamida 6 ta belgidan iborat bo‘lishi kerak.");
      return;
    }
    if (mode === "register" && form.name.trim().length < 2) {
      setError("Ismingizni to‘liq kiriting.");
      return;
    }

    setLoading(true);
    try {
      const endpoint = mode === "login" ? "/api/login" : "/api/register";
      const payload =
        mode === "login"
          ? { email: form.email.trim(), password: form.password }
          : { name: form.name.trim(), email: form.email.trim(), phone: form.phone.trim(), password: form.password };

      const response = await api.post(endpoint, payload);
      const token = response.data.token;
      const nextUser = normalizeUser(response.data.user);

      localStorage.setItem(STORAGE.token, token);
      localStorage.setItem(STORAGE.user, JSON.stringify(nextUser));

      onAuthenticated(nextUser);
      toast("success", mode === "login" ? "Xush kelibsiz!" : "Hisob yaratildi!", "Real PostgreSQL profilingiz tayyor.");
    } catch (err) {
      setError(apiMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#07080e] flex items-center justify-center p-4 sm:p-6 text-white selection:bg-violet-500/30">
      <div className="w-full max-w-5xl grid lg:grid-cols-2 rounded-3xl border border-white/10 bg-[#0d0f17]/90 backdrop-blur-2xl shadow-2xl overflow-hidden">
        {/* Left hero banner */}
        <div className="hidden lg:flex flex-col justify-between p-10 border-r border-white/10 bg-gradient-to-br from-violet-950/20 via-black to-[#07080e]">
          <div>
            <div className="flex items-center gap-3">
              <img src="/devrank_logo.png" alt="DevRank UZ Logo" className="w-10 h-10 object-contain rounded-xl" />
              <div>
                <span className="font-black text-xl tracking-tight">DevRank</span>{" "}
                <span className="font-bold text-xs bg-violet-500/20 text-violet-300 px-2 py-0.5 rounded-full border border-violet-500/30">UZ</span>
              </div>
            </div>

            <div className="mt-16">
              <span className="text-xs font-bold uppercase tracking-widest text-violet-400">Developer Ecosystem</span>
              <h1 className="mt-3 text-4xl font-black leading-tight text-white">
                O‘zbekiston dasturchilarining <span className="bg-gradient-to-r from-violet-400 to-cyan-300 bg-clip-text text-transparent">haqiqiy reyting platformasi</span>
              </h1>
              <p className="mt-4 text-sm text-slate-400 leading-6">
                DevRank UZ - bu O‘zbekiston dasturchilarining haqiqiy ko‘rsatkichlarini aniqlash va reytinglash uchun yaratilgan platforma. Har bir foydalanuvchi o‘zining real kodlash qobiliyatini sinab ko‘rishi va boshqa dasturchilar bilan solishtirishi mumkin.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3 text-center">
              <div className="text-xs text-slate-500 font-medium">PostgreSQL</div>
              <div className="mt-1 text-sm font-bold text-emerald-400">100% Real</div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3 text-center">
              <div className="text-xs text-slate-500 font-medium">Test Runner</div>
              <div className="mt-1 text-sm font-bold text-cyan-400">Isolated JS/PY</div>
            </div>
          </div>
        </div>

        {/* Right Form */}
        <div className="p-8 sm:p-12 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <div className="mb-6">
              <h2 className="text-2xl font-black text-white">{mode === "login" ? "Tizimga kirish" : "Ro‘yxatdan o‘tish"}</h2>
              <p className="text-xs text-slate-400 mt-1">
                {mode === "login" ? "DevRank hisobingiz orqali platformaga kiring." : "Yangi dasturchi profili yarating va reytingda qatnashing."}
              </p>
            </div>

            <div className="grid grid-cols-2 p-1 rounded-xl bg-white/[0.04] border border-white/10 mb-5">
              <button
                type="button"
                onClick={() => { setMode("login"); setError(""); }}
                className={cn("py-2 text-xs font-bold rounded-lg transition", mode === "login" ? "bg-white/[0.08] text-white" : "text-slate-400 hover:text-white")}
              >
                Kirish
              </button>
              <button
                type="button"
                onClick={() => { setMode("register"); setError(""); }}
                className={cn("py-2 text-xs font-bold rounded-lg transition", mode === "register" ? "bg-white/[0.08] text-white" : "text-slate-400 hover:text-white")}
              >
                Ro‘yxatdan o‘tish
              </button>
            </div>

            <form onSubmit={submit} className="space-y-4">
              {mode === "register" ? (
                <Field
                  label="To‘liq ismingiz"
                  icon={User}
                  placeholder="Ali Valiyev"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              ) : null}

              <Field
                label="Email manzil"
                icon={Globe2}
                type="email"
                placeholder="ali@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />

              {mode === "register" ? (
                <Field
                  label="Telefon raqam"
                  icon={Activity}
                  placeholder="+998 90 123 45 67"
                  value={form.phone}
                  onChange={(e) => {
                    let val = e.target.value;
                    if (!val.startsWith("+998")) val = "+998 " + val.replace(/\D/g, "");
                    setForm({ ...form, phone: val });
                  }}
                  required
                />
              ) : null}

              <Field
                label="Parol"
                icon={Shield}
                type="password"
                placeholder="Kamida 6 ta belgi"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />

              {error ? (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300 flex items-center gap-2">
                  <AlertCircle size={16} className="shrink-0 text-red-400" />
                  <span>{error}</span>
                </div>
              ) : null}

              <Button type="submit" disabled={loading} className="w-full py-3" icon={loading ? Loader2 : mode === "login" ? LogIn : Plus}>
                {loading ? "Tekshirilmoqda..." : mode === "login" ? "Kirish" : "Hisob yaratish"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

// ----------------- SIDEBAR -----------------
function Sidebar({ view, setView, onLogout, user, mobileOpen, setMobileOpen }) {
  const navItems = [
    { id: "dashboard", label: "Bosh sahifa", icon: Home },
    { id: "leaderboard", label: "Reyting", icon: Trophy },
    { id: "code", label: "AI Code Lab", icon: Code2 },
    { id: "profile", label: "Profil & Portfolio", icon: User },
    { id: "content", label: "Yangiliklar & Tadbirlar", icon: CalendarDays },
    { id: "messages", label: "Xabarlar", icon: MessageSquare },
  ];

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[260px] border-r border-white/[0.08] bg-[#090a11]/95 px-5 py-6 lg:flex lg:flex-col backdrop-blur-2xl">
        <div className="flex items-center gap-3">
          <img src="/devrank_logo.png" alt="DevRank UZ Logo" className="w-9 h-9 object-contain rounded-xl" />
          <div>
            <div className="font-black tracking-tight text-base text-white">
              DevRank <span className="text-violet-400">UZ</span>
            </div>
            <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Education</div>
          </div>
        </div>

        <nav className="mt-8 space-y-1.5 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = view === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setView(item.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-left text-sm font-semibold transition",
                  active
                    ? "bg-violet-600/15 text-white border border-violet-500/30"
                    : "text-slate-400 hover:bg-white/[0.04] hover:text-white"
                )}
              >
                <Icon size={17} className={active ? "text-violet-400" : "text-slate-500"} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User Mini Card at Bottom */}
        <div className="pt-4 border-t border-white/[0.08]">
          <div className="flex items-center gap-3 mb-3 p-2 rounded-xl bg-white/[0.02] border border-white/[0.04]">
            <Avatar user={user} size="sm" />
            <div className="min-w-0 flex-1">
              <div className="truncate text-xs font-bold text-white">{user.name}</div>
              <div className="text-[10px] text-slate-400 font-medium">Level {user.level} • {formatScore(user.score)} pts</div>
            </div>
          </div>

          <button
            type="button"
            onClick={onLogout}
            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-400 hover:bg-red-500/10 hover:text-red-300 transition"
          >
            <LogOut size={15} />
            <span>Tizimdan chiqish</span>
          </button>
        </div>
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen ? (
        <div className="fixed inset-0 z-50 bg-black/80 lg:hidden" onClick={() => setMobileOpen(false)}>
          <aside className="h-full w-[270px] bg-[#090a11] p-6 border-r border-white/10 flex flex-col justify-between" onClick={(e) => e.stopPropagation()}>
            <div>
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <img src="/devrank_logo.png" alt="DevRank UZ Logo" className="w-8 h-8 object-contain rounded-xl" />
                  <div className="font-black text-lg">DevRank UZ</div>
                </div>
                <button type="button" onClick={() => setMobileOpen(false)} className="text-slate-400">
                  <X size={20} />
                </button>
              </div>

              <nav className="space-y-1.5">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = view === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setView(item.id);
                        setMobileOpen(false);
                      }}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-left text-sm font-semibold",
                        active ? "bg-violet-600/20 text-white" : "text-slate-400"
                      )}
                    >
                      <Icon size={17} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            <button
              type="button"
              onClick={onLogout}
              className="flex items-center gap-2 rounded-xl p-3 text-xs font-bold text-red-300 bg-red-500/10 border border-red-500/20"
            >
              <LogOut size={16} />
              <span>Chiqish</span>
            </button>
          </aside>
        </div>
      ) : null}
    </>
  );
}

// ----------------- TOPBAR -----------------
function Topbar({ user, onMenu, onProfile, onOpenSearch }) {
  return (
    <header className="sticky top-0 z-30 border-b border-white/[0.08] bg-[#07080e]/85 backdrop-blur-2xl px-4 sm:px-8 py-3.5">
      <div className="flex items-center justify-between gap-4 max-w-[1480px] mx-auto">
        <div className="flex items-center gap-3">
          <button type="button" onClick={onMenu} className="rounded-xl border border-white/10 p-2 text-slate-400 lg:hidden hover:bg-white/[0.04]">
            <Menu size={18} />
          </button>

          {/* Quick Search Button */}
          <button
            type="button"
            onClick={onOpenSearch}
            className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-2 text-xs text-slate-400 hover:border-violet-500/30 hover:bg-white/[0.05] transition w-64 sm:w-80 text-left"
          >
            <Search size={14} className="text-slate-500" />
            <span className="truncate">Dasturchi, skill yoki loyiha...</span>
            <kbd className="ml-auto hidden sm:inline-block rounded bg-white/[0.06] px-1.5 py-0.5 text-[10px] text-slate-500">Ctrl K</kbd>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onProfile}
            className="flex items-center gap-3 rounded-xl p-1.5 hover:bg-white/[0.04] transition"
          >
            <Avatar user={user} size="sm" />
            <div className="hidden sm:block text-left">
              <div className="text-xs font-bold text-white max-w-32 truncate">{user.name}</div>
              <div className="text-[10px] text-violet-400 font-medium">#{user.rank || "—"} Reyting</div>
            </div>
            <ChevronDown size={14} className="text-slate-500" />
          </button>
        </div>
      </div>
    </header>
  );
}

// ----------------- TRACK SELECTOR COMPONENT -----------------
const TRACK_OPTIONS = [
  { id: "web", label: "Web Development", icon: "🌐", color: "text-cyan-400" },
  { id: "ai", label: "AI & Machine Learning", icon: "🤖", color: "text-violet-400" },
  { id: "cyber", label: "Cyber Security", icon: "🛡️", color: "text-red-400" },
  { id: "ux", label: "UI / UX Design", icon: "🎨", color: "text-pink-400" },
];

function TrackSelector({ user, toast, refreshUser }) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const current = TRACK_OPTIONS.find((t) => t.id === (user.primaryCategory || "web")) || TRACK_OPTIONS[0];

  async function selectTrack(trackId) {
    setSaving(true);
    try {
      await api.patch("/api/profile", { primaryCategory: trackId });
      await refreshUser();
      toast("success", "Yo'nalish o'zgartirildi", `Yangi yo'nalish: ${TRACK_OPTIONS.find(t => t.id === trackId)?.label}`);
    } catch (err) {
      toast("error", "Xato", apiMessage(err));
    } finally {
      setSaving(false);
      setOpen(false);
    }
  }

  return (
    <div className="relative">
      <Glass
        className="p-5 cursor-pointer hover:border-white/20 transition"
        onClick={() => setOpen((v) => !v)}
      >
        <div className="flex justify-between items-center text-slate-500 mb-3">
          <span className="text-xs font-bold uppercase tracking-wider">Yo'nalish</span>
          <div className="flex items-center gap-1">
            <Pencil size={12} className="text-slate-600" />
            <Globe2 size={16} className="text-emerald-400" />
          </div>
        </div>
        <div className={cn("text-2xl font-black capitalize", current.color)}>
          {current.icon} {current.label.split(" ")[0]}
        </div>
        <div className="mt-1 text-[11px] text-slate-500">Asosiy ixtisoslik • O'zgartirish uchun bosing</div>
      </Glass>

      {open && (
        <div className="absolute top-full left-0 right-0 z-50 mt-2 rounded-2xl border border-white/10 bg-[#0d0f1a] shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-2 space-y-1">
            {TRACK_OPTIONS.map((t) => (
              <button
                key={t.id}
                type="button"
                disabled={saving}
                onClick={() => selectTrack(t.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-sm font-medium transition",
                  t.id === current.id
                    ? "bg-violet-600/20 border border-violet-500/30 text-white"
                    : "hover:bg-white/[0.04] text-slate-300 border border-transparent"
                )}
              >
                <span className="text-xl">{t.icon}</span>
                <span>{t.label}</span>
                {t.id === current.id && <Check size={14} className="ml-auto text-violet-400" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ----------------- DASHBOARD VIEW -----------------
function DashboardView({ user, leaderboard, setView, toast, refreshUser }) {
  const scoreProgress = ((user.score % 100) + 100) % 100;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <Header
        eyebrow="Dashboard"
        title={`Assalomu alaykum, ${user.name}!`}
        subtitle="Haqiqiy coding ko'rsatkichlaringiz, profilingiz va reytingdagi o'rningiz."
        action={
          <Button onClick={() => setView("code")} icon={Code2}>
            AI Code Labga o'tish
          </Button>
        }
      />

      {/* Hero Stats Card */}
      <Glass className="overflow-hidden border-violet-500/20 bg-gradient-to-br from-violet-950/20 via-[#0d0f17] to-cyan-950/10 p-6 sm:p-8">
        <div className="grid lg:grid-cols-[1fr_1.3fr] gap-8 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs font-bold text-violet-300 mb-3">
              <Trophy size={14} />
              <span>O‘rningiz: #{user.rank || "—"}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Level {user.level} Developer
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-400 max-w-md">
              Haqiqiy testlar va avtomatlashtirilgan kod tahlili asosida hisoblangan toza ball.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-5 backdrop-blur-md">
            <div className="flex justify-between items-center text-xs mb-2">
              <span className="text-slate-400 font-medium">Hozirgi Score</span>
              <span className="font-black text-cyan-300 text-sm">{formatScore(user.score)} pts</span>
            </div>
            <Progress label="Keyingi Levelga progress" value={scoreProgress} />

            <div className="grid grid-cols-3 gap-3 mt-5 pt-4 border-t border-white/[0.08]">
              <div className="text-center">
                <div className="text-lg font-black text-white">{user.projectsCount}</div>
                <div className="text-[10px] text-slate-500 font-medium">Loyihalar</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-black text-white">{user.skills?.length || 0}</div>
                <div className="text-[10px] text-slate-500 font-medium">Skills</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-black text-emerald-400">+{user.growth}</div>
                <div className="text-[10px] text-slate-500 font-medium">O'sish</div>
              </div>
            </div>
          </div>
        </div>
      </Glass>

      {/* 4 Stat Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Glass className="p-5">
          <div className="flex justify-between items-center text-slate-500 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">Foydalanuvchilar</span>
            <Users size={16} className="text-violet-400" />
          </div>
          <div className="text-2xl font-black text-white">{leaderboard.length}</div>
          <div className="mt-1 text-[11px] text-slate-500">PostgreSQL ro'yxatdan o'tganlar</div>
        </Glass>

        <Glass className="p-5">
          <div className="flex justify-between items-center text-slate-500 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">Sizning Score</span>
            <WalletCards size={16} className="text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-white">{formatScore(user.score)}</div>
          <div className="mt-1 text-[11px] text-slate-500">To'plangan umumiy ball</div>
        </Glass>

        <TrackSelector user={user} toast={toast} refreshUser={refreshUser} />

        <Glass className="p-5">
          <div className="flex justify-between items-center text-slate-500 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">Hudud</span>
            <Activity size={16} className="text-fuchsia-400" />
          </div>
          <div className="text-2xl font-black text-white truncate">{user.province || "—"}</div>
          <div className="mt-1 text-[11px] text-slate-500">Mintaqaviy guruh</div>
        </Glass>
      </div>

      {/* Leaderboard Top 5 & Quick Actions */}
      <div className="grid lg:grid-cols-[1.3fr_0.9fr] gap-6">
        <Glass className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-white">Top Dasturchilar</h3>
              <p className="text-xs text-slate-400">Faqat haqiqiy ro'yxatdan o'tgan foydalanuvchilar</p>
            </div>
            <button
              type="button"
              onClick={() => setView("leaderboard")}
              className="text-xs font-bold text-violet-400 hover:text-violet-300 transition"
            >
              Barchasi →
            </button>
          </div>

          {leaderboard.length === 0 ? (
            <Empty text="Hali developerlar yo‘q" sub="Foydalanuvchilar ro‘yxatdan o‘tganda shu yerda chiqadi." />
          ) : (
            <div className="space-y-2">
              {leaderboard.slice(0, 5).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-3 rounded-xl border border-white/[0.04] bg-white/[0.01] hover:bg-white/[0.04] transition"
                >
                  <div className="w-6 text-center text-xs font-bold text-slate-500">#{item.rank}</div>
                  <Avatar user={item} size="sm" />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-white truncate">{item.name}</div>
                    <div className="text-[10px] text-slate-500">{item.province || "—"}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-black text-white">{formatScore(item.score)}</div>
                    <div className="text-[10px] text-violet-400 font-medium">Level {item.level}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Glass>

        {/* Quick Actions */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Tezkor amallar</h3>
          <Glass onClick={() => setView("code")} className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/20">
                <Rocket size={18} />
              </div>
              <div>
                <div className="text-sm font-bold text-white">Challenge topshirish</div>
                <div className="text-xs text-slate-400">Web, AI, Cyber, UI/UX topshiriqlari</div>
              </div>
            </div>
            <ChevronRight size={16} className="text-slate-600" />
          </Glass>

          <Glass onClick={() => setView("profile")} className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <Pencil size={18} />
              </div>
              <div>
                <div className="text-sm font-bold text-white">Profilni to‘ldirish</div>
                <div className="text-xs text-slate-400">Skills va yangi loyiha qo‘shing</div>
              </div>
            </div>
            <ChevronRight size={16} className="text-slate-600" />
          </Glass>

          <Glass onClick={() => setView("content")} className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/20">
                <CalendarDays size={18} />
              </div>
              <div>
                <div className="text-sm font-bold text-white">Yangiliklar va Hackathonlar</div>
                <div className="text-xs text-slate-400">Eng so‘nggi IT tadbirlar</div>
              </div>
            </div>
            <ChevronRight size={16} className="text-slate-600" />
          </Glass>
        </div>
      </div>
    </div>
  );
}

// ----------------- LEADERBOARD VIEW -----------------
function LeaderboardView({ toast, onOpenProfile }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("all");
  const [period, setPeriod] = useState("all");
  const [province, setProvince] = useState("all");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/leaderboard", {
        params: {
          category,
          period,
          province: province === "all" ? undefined : province,
        },
      });
      setItems(Array.isArray(response.data?.users) ? response.data.users : []);
    } catch (err) {
      toast("error", "Reyting xatosi", apiMessage(err));
    } finally {
      setLoading(false);
    }
  }, [category, period, province, toast]);

  useEffect(() => {
    load();
  }, [load]);

  // Connect SSE or polling for live updates
  useEffect(() => {
    const timer = setInterval(() => {
      load();
    }, 15000);
    return () => clearInterval(timer);
  }, [load]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <Header
        eyebrow="Ecosystem"
        title="Dasturchilar Reytingi"
        subtitle="Faqat PostgreSQL bazasida mavjud haqiqiy foydalanuvchilar."
        action={
          <Button variant="secondary" onClick={load} icon={RefreshCw}>
            Yangilash
          </Button>
        }
      />

      {/* Filter Bar */}
      <div className="grid sm:grid-cols-3 gap-3">
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="rounded-xl border border-white/10 bg-[#0d0f17] px-3.5 py-2.5 text-xs text-white outline-none focus:border-violet-500"
        >
          <option value="all">Barcha vaqtlar</option>
          <option value="month">Oylik reyting</option>
          <option value="week">Haftalik reyting</option>
        </select>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-xl border border-white/10 bg-[#0d0f17] px-3.5 py-2.5 text-xs text-white outline-none focus:border-violet-500"
        >
          <option value="all">Barcha kategoriyalar</option>
          {CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </select>

        <select
          value={province}
          onChange={(e) => setProvince(e.target.value)}
          className="rounded-xl border border-white/10 bg-[#0d0f17] px-3.5 py-2.5 text-xs text-white outline-none focus:border-violet-500"
        >
          <option value="all">Barcha hududlar</option>
          {PROVINCES.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      {/* Top 3 Podium Cards if available */}
      {items.length >= 3 ? (
        <div className="grid md:grid-cols-3 gap-4 pt-2">
          {/* #2 */}
          <Glass onClick={() => onOpenProfile(items[1].id)} className="p-5 text-center border-slate-500/20 order-2 md:order-1">
            <div className="inline-block rounded-full bg-slate-500/20 px-2.5 py-0.5 text-xs font-bold text-slate-300 mb-2">#2 O‘rin</div>
            <Avatar user={items[1]} size="lg" />
            <h4 className="mt-3 font-black text-white text-base truncate">{items[1].name}</h4>
            <div className="text-xs text-slate-400">{items[1].province || "—"}</div>
            <div className="mt-3 text-lg font-black text-cyan-300">{formatScore(items[1].score)} pts</div>
          </Glass>

          {/* #1 Champion */}
          <Glass onClick={() => onOpenProfile(items[0].id)} className="p-6 text-center border-amber-500/30 bg-gradient-to-b from-amber-500/5 to-transparent order-1 md:order-2 scale-105">
            <div className="inline-block rounded-full bg-amber-500/20 px-3 py-1 text-xs font-black text-amber-300 mb-2">👑 #1 Chempion</div>
            <Avatar user={items[0]} size="xl" />
            <h4 className="mt-3 font-black text-white text-lg truncate">{items[0].name}</h4>
            <div className="text-xs text-slate-400">{items[0].province || "—"}</div>
            <div className="mt-3 text-2xl font-black text-amber-300">{formatScore(items[0].score)} pts</div>
          </Glass>

          {/* #3 */}
          <Glass onClick={() => onOpenProfile(items[2].id)} className="p-5 text-center border-amber-800/20 order-3">
            <div className="inline-block rounded-full bg-amber-800/20 px-2.5 py-0.5 text-xs font-bold text-amber-500 mb-2">#3 O‘rin</div>
            <Avatar user={items[2]} size="lg" />
            <h4 className="mt-3 font-black text-white text-base truncate">{items[2].name}</h4>
            <div className="text-xs text-slate-400">{items[2].province || "—"}</div>
            <div className="mt-3 text-lg font-black text-violet-300">{formatScore(items[2].score)} pts</div>
          </Glass>
        </div>
      ) : null}

      {/* Main Leaderboard Table / Rows */}
      <Glass className="p-6">
        {loading && !items.length ? (
          <div className="py-16 text-center text-slate-500 text-sm flex items-center justify-center gap-2">
            <Loader2 className="animate-spin" size={18} />
            <span>Reyting yuklanmoqda...</span>
          </div>
        ) : items.length === 0 ? (
          <Empty text="Hali developerlar yo‘q" sub="Foydalanuvchilar ro‘yxatdan o‘tganda ushbu filtr bo‘yicha natijalar paydo bo‘ladi." />
        ) : (
          <div className="space-y-2">
            {items.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onOpenProfile(item.id)}
                className="w-full flex items-center gap-4 p-3.5 rounded-xl border border-white/[0.04] bg-white/[0.01] hover:border-violet-500/30 hover:bg-white/[0.04] transition text-left"
              >
                <div className="w-8 text-center text-xs font-bold text-slate-400">#{item.rank}</div>
                <Avatar user={item} size="sm" />
                <div className="min-w-0 flex-1">
                  <div className="text-xs sm:text-sm font-bold text-white truncate">{item.name}</div>
                  <div className="text-[10px] text-slate-500">{item.province || "Hudud kiritilmagan"}</div>
                </div>

                <div className="hidden sm:flex flex-wrap gap-1 max-w-xs justify-end">
                  {(item.skills || []).slice(0, 3).map((s) => (
                    <span key={s} className="rounded-full bg-white/[0.04] px-2 py-0.5 text-[10px] text-slate-400 border border-white/[0.06]">
                      {s}
                    </span>
                  ))}
                </div>

                <div className="text-right pl-2">
                  <div className="text-xs sm:text-sm font-black text-white">{formatScore(item.score)} pts</div>
                  <div className="text-[10px] text-violet-400 font-bold">Level {item.level}</div>
                </div>
              </button>
            ))}
          </div>
        )}
      </Glass>
    </div>
  );
}

// ----------------- AI CODE LAB VIEW -----------------
function CodeLabView({ toast, refreshUser }) {
  const [category, setCategory] = useState("web");
  const [challenges, setChallenges] = useState([]);
  const [selected, setSelected] = useState(null);
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [quizAnswer, setQuizAnswer] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadChallenges = useCallback(async () => {
    try {
      const response = await api.get("/api/challenges", { params: { category } });
      setChallenges(Array.isArray(response.data?.items) ? response.data.items : []);
    } catch (err) {
      setChallenges([]);
      toast("error", "Challenge xatosi", apiMessage(err));
    }
  }, [category, toast]);

  useEffect(() => {
    loadChallenges();
    setSelected(null);
    setResult(null);
    setQuizAnswer(null);
  }, [loadChallenges]);

  async function openChallenge(item) {
    try {
      const response = await api.get(`/api/challenges/${item.id}`);
      const c = response.data?.challenge || response.data;
      setSelected(c);
      setCode(c.starterCode || "");
      setLanguage(c.language || "javascript");
      setQuizAnswer(null);
      setResult(null);
    } catch (err) {
      toast("error", "Challenge", apiMessage(err));
    }
  }

  function openNextQuiz() {
    if (!selected) return;
    const quizList = challenges.filter((c) => c.type === "QUIZ");
    const currentIdx = quizList.findIndex((c) => c.id === selected.id);
    const next = quizList[currentIdx + 1];
    if (next) {
      openChallenge(next);
    } else {
      toast("info", "Tugadi", "Bu yo'nalishda barcha quiz savollar ko'rib chiqildi!");
      setSelected(null);
    }
  }

  async function submitSolution() {
    if (!selected || loading) return;

    if (selected.type === "QUIZ" && quizAnswer === null) {
      toast("error", "Javob tanlanmadi", "Iltimos, variantlardan birini belgilang.");
      return;
    }
    if (selected.type !== "QUIZ" && !code.trim()) {
      toast("error", "Kod kiritilmadi", "Iltimos, yechim kodini yozing.");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const payload =
        selected.type === "QUIZ"
          ? { answer: Number(quizAnswer) }
          : { code, language };

      const response = await api.post(`/api/challenges/${selected.id}/submit`, payload);
      setResult(response.data);

      await refreshUser();
      await loadChallenges();

      toast(
        response.data?.passed ? "success" : "error",
        response.data?.passed ? "Topshiriq bajarildi!" : "Natija qoniqarsiz",
        `Umumiy ball: ${response.data?.score ?? 0}/100.`
      );
    } catch (err) {
      toast("error", "Submit xatosi", apiMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <Header
        eyebrow="AI Code Lab"
        title="Dasturlash & AI Topshiriqlari"
        subtitle="Real subprocess test runner va AI bilan tekshiriladigan topshiriqlar."
      />

      {/* 4 Category Selector Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {CATEGORIES.map((c) => {
          const Icon = c.icon;
          const active = category === c.id;
          return (
            <Glass
              key={c.id}
              onClick={() => setCategory(c.id)}
              className={cn("p-4 transition", active ? "border-violet-500 bg-violet-600/10" : "hover:border-white/20")}
            >
              <Icon size={20} className={active ? "text-violet-400" : "text-slate-400"} />
              <div className="mt-2 text-xs sm:text-sm font-bold text-white">{c.title}</div>
              <div className="mt-0.5 text-[10px] text-slate-400 truncate">{c.desc}</div>
            </Glass>
          );
        })}
      </div>

      {!selected ? (
        <Glass className="p-6">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-white">
              {CATEGORIES.find((c) => c.id === category)?.title} Topshiriqlari
            </h3>
            <p className="text-xs text-slate-400">{challenges.length} ta mavjud topshiriq</p>
          </div>

          {challenges.length === 0 ? (
            <Empty text="Hali challenge mavjud emas" sub="Tez orada yangi topshiriqlar qo'shiladi." />
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {challenges.map((item) => (
                <Glass key={item.id} onClick={() => openChallenge(item)} className="p-5">
                  <div className="flex justify-between items-start">
                    <span className={cn(
                      "text-[10px] font-black uppercase px-2 py-0.5 rounded-full border",
                      item.type === "QUIZ" ? "bg-amber-500/10 text-amber-300 border-amber-500/20" : "bg-cyan-500/10 text-cyan-300 border-cyan-500/20"
                    )}>
                      {item.type}
                    </span>
                    <span className="text-xs font-bold text-amber-400">{item.points} pts</span>
                  </div>

                  <h4 className="mt-3 font-bold text-white text-base">{item.title}</h4>
                  <p className="mt-1 text-xs text-slate-400 leading-5 line-clamp-2">{item.description}</p>

                  <div className="mt-4 flex items-center justify-between pt-3 border-t border-white/[0.06] text-[10px] text-slate-500 font-medium">
                    <span className="capitalize">{item.difficulty} • {item.language}</span>
                    <span className="text-violet-400 font-bold">Ochish →</span>
                  </div>
                </Glass>
              ))}
            </div>
          )}
        </Glass>
      ) : (
        /* 3-Column Challenge Workspace */
        <div className="grid xl:grid-cols-[0.8fr_1.3fr_0.9fr] gap-4 items-start">
          {/* Left: Problem Description */}
          <Glass className="p-5 space-y-4">
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white"
            >
              <ArrowLeft size={14} />
              <span>Barcha topshiriqlar</span>
            </button>

            <div>
              <span className="text-[10px] font-bold uppercase text-violet-400">{selected.category} • {selected.difficulty}</span>
              <h3 className="text-xl font-bold text-white mt-1">{selected.title}</h3>
              <p className="mt-3 text-xs text-slate-300 leading-6 whitespace-pre-line">{selected.description}</p>
            </div>

            {selected.type === "QUIZ" ? (
              <div
                className="p-4 rounded-xl bg-white/[0.02] border border-white/10 select-none"
                onCopy={(e) => e.preventDefault()}
                onContextMenu={(e) => e.preventDefault()}
              >
                <div className="text-xs font-bold text-amber-300 mb-2">Savol:</div>
                <div className="text-sm font-semibold text-white leading-6">{selected.quiz?.question || selected.description}</div>
              </div>
            ) : (
              <div className="space-y-3 pt-2">
                {selected.inputExample ? (
                  <div>
                    <div className="text-[10px] font-bold uppercase text-slate-500 mb-1">Input misol:</div>
                    <pre className="p-3 rounded-xl bg-black/40 text-xs text-cyan-300 overflow-x-auto border border-white/5">{selected.inputExample}</pre>
                  </div>
                ) : null}
                {selected.outputExample ? (
                  <div>
                    <div className="text-[10px] font-bold uppercase text-slate-500 mb-1">Expected Output:</div>
                    <pre className="p-3 rounded-xl bg-black/40 text-xs text-emerald-300 overflow-x-auto border border-white/5">{selected.outputExample}</pre>
                  </div>
                ) : null}
              </div>
            )}
          </Glass>

          {/* Center: Code Editor or Quiz Selector */}
          <Glass className="overflow-hidden border-white/10">
            {selected.type === "QUIZ" ? (
              <div className="p-6 space-y-4">
                {/* Lock banner if already solved */}
                {selected.completed && !result && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <Check size={14} className="text-emerald-400 shrink-0" />
                    <span className="text-xs text-emerald-300 font-medium">Bu savolni avval to'g'ri yechgansiz. Faqat ko'rish mumkin.</span>
                  </div>
                )}

                <div className="text-xs font-bold uppercase text-slate-400">Variantni tanlang:</div>
                <div
                  className="space-y-2.5 select-none"
                  onCopy={(e) => e.preventDefault()}
                  onContextMenu={(e) => e.preventDefault()}
                >
                  {(selected.quiz?.options || []).map((opt, idx) => {
                    const isSelected = quizAnswer === idx;
                    const isAnswered = selected.completed || result;
                    const correctIdx = result ? (result.correctIndex ?? -1) : -1;
                    const isCorrect = result && idx === correctIdx;
                    const isWrong = result && isSelected && !isCorrect;

                    return (
                      <button
                        key={opt}
                        type="button"
                        disabled={!!isAnswered}
                        onClick={() => !isAnswered && setQuizAnswer(idx)}
                        className={cn(
                          "w-full p-4 rounded-xl border text-left text-xs sm:text-sm font-medium transition flex items-center gap-3",
                          isCorrect
                            ? "border-emerald-500 bg-emerald-600/20 text-white"
                            : isWrong
                            ? "border-red-500 bg-red-600/10 text-red-300"
                            : isSelected
                            ? "border-violet-500 bg-violet-600/20 text-white"
                            : isAnswered
                            ? "border-white/5 bg-white/[0.01] text-slate-500 cursor-not-allowed"
                            : "border-white/10 bg-white/[0.02] text-slate-300 hover:border-white/20"
                        )}
                      >
                        <span className={cn(
                          "h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0",
                          isCorrect ? "bg-emerald-500 text-white"
                          : isWrong ? "bg-red-500 text-white"
                          : isSelected ? "bg-violet-500 text-white"
                          : "bg-white/10 text-slate-400"
                        )}>
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span>{opt}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="pt-4 flex items-center justify-between gap-3">
                  {selected.completed && !result ? (
                    <button
                      type="button"
                      onClick={openNextQuiz}
                      className="ml-auto flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600/20 border border-violet-500/40 text-violet-300 text-xs font-bold hover:bg-violet-600/30 transition"
                    >
                      Keyingi savol →
                    </button>
                  ) : result ? (
                    <button
                      type="button"
                      onClick={openNextQuiz}
                      className="ml-auto flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600/20 border border-violet-500/40 text-violet-300 text-xs font-bold hover:bg-violet-600/30 transition"
                    >
                      Keyingi savol →
                    </button>
                  ) : (
                    <Button onClick={submitSolution} disabled={loading || quizAnswer === null} icon={loading ? Loader2 : Check} className="ml-auto">
                      {loading ? "Tekshirilmoqda..." : "Javobni yuborish"}
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-[#090a11]">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                    <FileCode2 size={15} className="text-violet-400" />
                    <span>solution.{LANGUAGES.find((l) => l[0] === language)?.[2] || "js"}</span>
                  </div>

                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="rounded-lg border border-white/10 bg-[#121522] px-2.5 py-1 text-xs text-white outline-none"
                  >
                    {LANGUAGES.map((l) => (
                      <option key={l[0]} value={l[0]}>{l[1]}</option>
                    ))}
                  </select>
                </div>

                <div className="h-[480px]">
                  <Editor
                    height="100%"
                    language={language === "csharp" ? "csharp" : language}
                    theme="vs-dark"
                    value={code}
                    onChange={(val) => setCode(val || "")}
                    options={{
                      minimap: { enabled: false },
                      fontSize: 13,
                      automaticLayout: true,
                      scrollBeyondLastLine: false,
                      padding: { top: 12 },
                    }}
                  />
                </div>

                <div className="flex items-center justify-between p-3.5 border-t border-white/10 bg-[#090a11]">
                  <span className="text-[11px] text-slate-500">Test runner + AI Review</span>
                  <Button onClick={submitSolution} disabled={loading} icon={loading ? Loader2 : Play}>
                    {loading ? "Testlar ishlamoqda..." : "Run Tests & AI Review"}
                  </Button>
                </div>
              </>
            )}
          </Glass>

          {/* Right: Terminal & AI Evaluation */}
          <div className="space-y-4">
            {/* Terminal Panel */}
            <Glass className="overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/10 bg-[#090a11]">
                <Terminal size={14} className="text-emerald-400" />
                <span className="text-xs font-bold text-slate-300">Terminal Output</span>
              </div>
              <div className="h-[220px] overflow-auto bg-black/50 p-4 font-mono text-xs text-slate-400 space-y-1">
                {result ? (
                  <>
                    <div className="text-cyan-400">› execution complete</div>
                    {(result.test?.results || []).map((t) => (
                      <div key={t.index} className={t.passed ? "text-emerald-400" : "text-red-400"}>
                        Test {t.index}: {t.passed ? "PASS" : "FAIL"} | exp: {t.expected} | got: {t.actual}
                      </div>
                    ))}
                    <div className="mt-2 text-slate-300 whitespace-pre-wrap">{result.test?.output}</div>
                  </>
                ) : (
                  <div className="text-slate-600">
                    › $ devrank runner ready...<br />
                    › Kodni yozib "Run Tests" tugmasini bosing.
                  </div>
                )}
              </div>
            </Glass>

            {/* AI Review Panel */}
            <Glass className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-violet-300">
                  <Sparkles size={16} />
                  <span>AI Review</span>
                </div>
                {result?.model ? (
                  <span className="text-[10px] rounded bg-violet-500/20 text-violet-300 px-2 py-0.5 border border-violet-500/30">
                    {result.model}
                  </span>
                ) : null}
              </div>

              {result ? (
                <div className="space-y-3 pt-1">
                  <div className="p-3.5 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300">Umumiy Ball:</span>
                    <span className="text-2xl font-black text-white">{result.score}/100</span>
                  </div>

                  <Progress label="To‘g‘rilik (Correctness)" value={result.correctness} color="from-emerald-500 to-cyan-400" />
                  <Progress label="Kod sifati (Quality)" value={result.quality} color="from-violet-500 to-indigo-400" />
                  <Progress label="Xavfsizlik (Security)" value={result.security} color="from-amber-500 to-emerald-400" />
                  <Progress label="Tezlik (Speed)" value={result.speed} color="from-cyan-500 to-blue-400" />

                  <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10 text-xs text-slate-300 leading-5">
                    {result.feedback}
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center text-xs text-slate-500">
                  Topshiriq natijasi va AI tahlili shu yerda chiqadi.
                </div>
              )}
            </Glass>
          </div>
        </div>
      )}
    </div>
  );
}

// ----------------- PROFILE VIEW & MODALS -----------------
function ProfileView({ user, own, toast, refreshUser }) {
  const [editing, setEditing] = useState(false);
  const [projectModal, setProjectModal] = useState(null);

  async function deleteProject(id) {
    if (!window.confirm("Haqiqatan ham ushbu loyihani o‘chirmoqchimisiz?")) return;
    try {
      await api.delete(`/api/projects/${id}`);
      await refreshUser();
      toast("success", "Loyiha o‘chirildi", "Portfolio ma’lumotlari yangilandi.");
    } catch (err) {
      toast("error", "Loyiha xatosi", apiMessage(err));
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <Header
        eyebrow="Profile"
        title={user.name || "Dasturchi"}
        subtitle="Haqiqiy PostgreSQL bazasidagi dasturchi profili va portfoliosi."
        action={
          own ? (
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => setEditing(true)} icon={Pencil}>
                Tahrirlash
              </Button>
              <Button onClick={() => setProjectModal({})} icon={Plus}>
                Loyiha qo‘shish
              </Button>
            </div>
          ) : null
        }
      />

      {/* Profile Hero Header */}
      <Glass className="p-6 sm:p-8 bg-gradient-to-br from-violet-950/20 via-[#0d0f17] to-transparent">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <Avatar user={user} size="xl" />
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-2xl sm:text-3xl font-black text-white">{user.name}</h2>
              <span className="rounded-full bg-violet-500/20 border border-violet-500/30 px-3 py-0.5 text-xs font-bold text-violet-300">
                Level {user.level}
              </span>
            </div>
            <div className="text-xs sm:text-sm text-slate-400 mt-1">{user.role} • {user.province}</div>
            <p className="mt-3 text-xs sm:text-sm text-slate-300 max-w-2xl leading-6">
              {user.bio || "Hali bio kiritilmagan."}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-center min-w-28">
            <div className="text-[10px] uppercase font-bold text-slate-500">Reyting</div>
            <div className="text-2xl font-black text-amber-400">#{user.rank || "—"}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">{formatScore(user.score)} pts</div>
          </div>
        </div>

        {/* Skills Chips */}
        <div className="mt-6 pt-5 border-t border-white/[0.08] flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-400 mr-2">Skills:</span>
          {user.skills?.length ? (
            user.skills.map((s) => (
              <span key={s} className="rounded-xl border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs font-semibold text-violet-300">
                {s}
              </span>
            ))
          ) : (
            <span className="text-xs text-slate-500">Skill qo'shilmagan.</span>
          )}
        </div>
      </Glass>

      {/* Portfolio Grid */}
      <Glass className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-bold text-white">Loyihalar & Portfolio</h3>
            <p className="text-xs text-slate-400">Foydalanuvchi tomonidan yuklangan haqiqiy loyihalar</p>
          </div>
          {own ? (
            <Button variant="secondary" onClick={() => setProjectModal({})} icon={Plus}>
              Yangi loyiha
            </Button>
          ) : null}
        </div>

        {!user.projects?.length ? (
          <Empty
            text="Hali loyihalar qo‘shilmagan"
            sub="Portfolioingizni boyitish uchun birinchi loyihangizni qo'shing."
            action={own ? <Button onClick={() => setProjectModal({})} icon={Plus}>Loyiha qo‘shish</Button> : null}
          />
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {user.projects.map((p) => (
              <div key={p.id} className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden flex flex-col justify-between">
                {p.images?.[0]?.url ? (
                  <div className="h-44 bg-black/40 overflow-hidden">
                    <img src={p.images[0].url.startsWith("http") ? p.images[0].url : `${API_BASE_URL}${p.images[0].url}`} alt={p.title} className="w-full h-full object-cover" />
                  </div>
                ) : null}

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-white text-base">{p.title}</h4>
                    <p className="mt-1 text-xs text-slate-400 leading-5">{p.description}</p>

                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {(p.technologies || []).map((t) => (
                        <span key={t} className="rounded-lg bg-white/[0.04] border border-white/[0.06] px-2 py-0.5 text-[10px] text-slate-300">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between">
                    <div className="flex gap-3 text-xs">
                      {p.githubUrl ? (
                        <a href={p.githubUrl} target="_blank" rel="noreferrer" className="text-violet-400 hover:underline flex items-center gap-1">
                          GitHub <ExternalLink size={11} />
                        </a>
                      ) : null}
                      {p.liveUrl ? (
                        <a href={p.liveUrl} target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline flex items-center gap-1">
                          Demo <ExternalLink size={11} />
                        </a>
                      ) : null}
                    </div>

                    {own ? (
                      <div className="flex gap-2">
                        <button type="button" onClick={() => setProjectModal(p)} className="p-1.5 rounded text-slate-400 hover:text-white">
                          <Pencil size={14} />
                        </button>
                        <button type="button" onClick={() => deleteProject(p.id)} className="p-1.5 rounded text-red-400 hover:text-red-300">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Glass>

      {/* Edit Profile Modal */}
      {editing ? (
        <ProfileModal
          user={user}
          onClose={() => setEditing(false)}
          toast={toast}
          refreshUser={refreshUser}
        />
      ) : null}

      {/* Add / Edit Project Modal */}
      {projectModal ? (
        <ProjectModal
          project={projectModal}
          onClose={() => setProjectModal(null)}
          toast={toast}
          refreshUser={refreshUser}
        />
      ) : null}
    </div>
  );
}

// ----------------- PROFILE EDIT MODAL -----------------
function ProfileModal({ user, onClose, toast, refreshUser }) {
  const [form, setForm] = useState({
    name: user.name || "",
    phone: user.phone || "",
    role: user.role || "Full Stack Developer",
    province: user.province || "Toshkent shahri",
    bio: user.bio || "",
    skills: (user.skills || []).join(", "),
  });
  const [loading, setLoading] = useState(false);

  async function save(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await api.patch("/api/profile", {
        name: form.name.trim(),
        phone: form.phone.trim(),
        role: form.role.trim(),
        province: form.province,
        bio: form.bio.trim(),
        technologies: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
      });

      await refreshUser();
      toast("success", "Profil saqlandi", "O‘zgarishlar PostgreSQL'ga yozildi.");
      onClose();
    } catch (err) {
      toast("error", "Saqlashda xatolik", apiMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="w-full max-w-xl rounded-2xl border border-white/10 bg-[#0d0f17] p-6 shadow-2xl space-y-4">
        <div className="flex justify-between items-center border-b border-white/[0.08] pb-3">
          <h3 className="text-lg font-bold text-white">Profilni tahrirlash</h3>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-white">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={save} className="space-y-3.5">
          <Field label="Ism Familiya" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <Field label="Kasbiy rolingiz" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} required />

          <label className="block">
            <div className="mb-1 text-xs text-slate-400 font-medium">Hudud</div>
            <select
              value={form.province}
              onChange={(e) => setForm({ ...form, province: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-white/[0.02] px-3.5 py-2.5 text-xs text-white outline-none"
            >
              {PROVINCES.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </label>

          <Field label="Telefon" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />

          <label className="block">
            <div className="mb-1 text-xs text-slate-400 font-medium">Bio (qisqacha o'zingiz haqingizda)</div>
            <textarea
              rows={3}
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-white/[0.02] p-3 text-xs text-white outline-none"
            />
          </label>

          <Field
            label="Skills (vergul bilan ajrating)"
            placeholder="React, Node.js, Python, PostgreSQL"
            value={form.skills}
            onChange={(e) => setForm({ ...form, skills: e.target.value })}
          />

          <div className="pt-3 border-t border-white/[0.08] flex justify-end gap-2">
            <Button variant="ghost" onClick={onClose}>Bekor qilish</Button>
            <Button type="submit" disabled={loading} icon={loading ? Loader2 : Check}>
              {loading ? "Saqlanmoqda..." : "Saqlash"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ----------------- PROJECT MODAL -----------------
function ProjectModal({ project, onClose, toast, refreshUser }) {
  const isEdit = Boolean(project?.id);
  const [form, setForm] = useState({
    title: project?.title || "",
    description: project?.description || "",
    purpose: project?.purpose || "",
    problem: project?.problem || "",
    technologies: (project?.technologies || []).join(", "),
    githubUrl: project?.githubUrl || "",
    liveUrl: project?.liveUrl || "",
  });
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  async function save(e) {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim() || !form.purpose.trim() || !form.problem.trim()) {
      toast("error", "Ma'lumot to'liq emas", "Nomi, tavsif, maqsad va muammo maydonlarini to'ldiring.");
      return;
    }

    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("description", form.description);
      fd.append("purpose", form.purpose);
      fd.append("problem", form.problem);
      fd.append("technologies", JSON.stringify(form.technologies.split(",").map((s) => s.trim()).filter(Boolean)));
      fd.append("githubUrl", form.githubUrl);
      fd.append("liveUrl", form.liveUrl);

      files.slice(0, 5).forEach((file) => {
        fd.append("images", file);
      });

      if (isEdit) {
        await api.patch(`/api/projects/${project.id}`, fd);
      } else {
        await api.post("/api/projects", fd);
      }

      await refreshUser();
      toast("success", isEdit ? "Loyiha yangilandi" : "Loyiha qo‘shildi", "Portfolio saqlandi.");
      onClose();
    } catch (err) {
      toast("error", "Xatolik", apiMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#0d0f17] p-6 shadow-2xl space-y-4">
        <div className="flex justify-between items-center border-b border-white/[0.08] pb-3">
          <h3 className="text-lg font-bold text-white">{isEdit ? "Loyihani tahrirlash" : "Yangi portfolio loyihasi"}</h3>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-white">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={save} className="space-y-3.5">
          <Field label="Loyiha nomi" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <Field label="Qisqacha tavsif" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />

          <label className="block">
            <div className="mb-1 text-xs text-slate-400 font-medium">Loyiha maqsadi nima?</div>
            <textarea
              rows={2}
              value={form.purpose}
              onChange={(e) => setForm({ ...form, purpose: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-white/[0.02] p-2.5 text-xs text-white outline-none"
              required
            />
          </label>

          <label className="block">
            <div className="mb-1 text-xs text-slate-400 font-medium">Qaysi muammoni hal qiladi?</div>
            <textarea
              rows={2}
              value={form.problem}
              onChange={(e) => setForm({ ...form, problem: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-white/[0.02] p-2.5 text-xs text-white outline-none"
              required
            />
          </label>

          <Field
            label="Texnologiyalar (vergul bilan)"
            placeholder="React, Node.js, PostgreSQL"
            value={form.technologies}
            onChange={(e) => setForm({ ...form, technologies: e.target.value })}
          />

          <div className="grid sm:grid-cols-2 gap-3">
            <Field label="GitHub URL" placeholder="https://github.com/..." value={form.githubUrl} onChange={(e) => setForm({ ...form, githubUrl: e.target.value })} />
            <Field label="Live Demo URL" placeholder="https://..." value={form.liveUrl} onChange={(e) => setForm({ ...form, liveUrl: e.target.value })} />
          </div>

          <div>
            <div className="mb-1 text-xs text-slate-400 font-medium">Loyihaga rasmlar (5 tagacha, PNG/JPG/WebP)</div>
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              multiple
              onChange={(e) => setFiles(Array.from(e.target.files || []))}
              className="w-full text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-white/[0.08] file:text-xs file:font-semibold file:text-white hover:file:bg-white/[0.12]"
            />
          </div>

          <div className="pt-3 border-t border-white/[0.08] flex justify-end gap-2">
            <Button variant="ghost" onClick={onClose}>Bekor qilish</Button>
            <Button type="submit" disabled={loading} icon={loading ? Loader2 : Check}>
              {loading ? "Saqlanmoqda..." : "Saqlash"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ----------------- CONTENT (NEWS & EVENTS) VIEW -----------------
function ContentView({ toast }) {
  const [news, setNews] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [nRes, eRes] = await Promise.all([api.get("/api/news"), api.get("/api/events")]);
      setNews(nRes.data?.items || []);
      setEvents(eRes.data?.items || []);
    } catch (err) {
      toast("error", "Xatolik", apiMessage(err));
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <Header
        eyebrow="Community"
        title="IT Yangiliklar & Tadbirlar"
        subtitle="O‘zbekiston va jahon IT ekotizimidagi rasmiy yangiliklar va hackathonlar."
        action={
          <Button variant="secondary" onClick={load} icon={RefreshCw}>
            Yangilash
          </Button>
        }
      />

      <div className="grid lg:grid-cols-2 gap-6">
        {/* News Column */}
        <Glass className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Globe2 size={18} className="text-cyan-400" />
            <h3 className="text-lg font-bold text-white">IT Yangiliklar</h3>
          </div>

          {loading ? (
            <div className="py-12 text-center text-slate-500 text-xs">Yuklanmoqda...</div>
          ) : news.length === 0 ? (
            <Empty text="Hali yangiliklar yo‘q" sub="Yangi xabarlar bazaga qo'shilganda shu yerda ko'rinadi." />
          ) : (
            <div className="space-y-3">
              {news.map((item) => (
                <div key={item.id} className="p-4 rounded-xl border border-white/[0.04] bg-white/[0.01]">
                  <h4 className="font-bold text-white text-sm">{item.title}</h4>
                  <p className="mt-1 text-xs text-slate-400 leading-5">{item.summary}</p>
                  {item.sourceUrl ? (
                    <a href={item.sourceUrl} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 text-[11px] text-violet-400 font-bold hover:underline">
                      Manba <ExternalLink size={11} />
                    </a>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </Glass>

        {/* Events Column */}
        <Glass className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <CalendarDays size={18} className="text-fuchsia-400" />
            <h3 className="text-lg font-bold text-white">Tadbirlar & Hackathonlar</h3>
          </div>

          {loading ? (
            <div className="py-12 text-center text-slate-500 text-xs">Yuklanmoqda...</div>
          ) : events.length === 0 ? (
            <Empty text="Hali tadbirlar yo‘q" sub="Kelgusi hackathon va uchrashuvlar bazaga kiritilganda e'lon qilinadi." />
          ) : (
            <div className="space-y-3">
              {events.map((item) => (
                <div key={item.id} className="p-4 rounded-xl border border-white/[0.04] bg-white/[0.01]">
                  <h4 className="font-bold text-white text-sm">{item.title}</h4>
                  <p className="mt-1 text-xs text-slate-400 leading-5">{item.description}</p>
                  <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                    <span>{item.location || "Online"} • {new Date(item.startsAt).toLocaleDateString("uz-UZ")}</span>
                    {item.eventUrl ? (
                      <a href={item.eventUrl} target="_blank" rel="noreferrer" className="text-cyan-400 font-bold hover:underline">
                        Ro‘yxatdan o‘tish →
                      </a>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Glass>
      </div>
    </div>
  );
}

// ----------------- MESSAGES VIEW -----------------
function MessagesView({ toast }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/messages");
      setItems(response.data?.items || []);
    } catch (err) {
      toast("error", "Xabarlar", apiMessage(err));
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    load();
  }, [load]);

  async function markRead(id) {
    try {
      await api.post(`/api/messages/${id}/read`);
      setItems((prev) => prev.map((m) => (m.id === id ? { ...m, read: true } : m)));
    } catch {}
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <Header
        eyebrow="Inbox"
        title="Bildirishnomalar"
        subtitle="Challenge natijalari, ballar va profilingiz yangilanishlari haqida bildirishnomalar."
        action={
          <Button variant="secondary" onClick={load} icon={RefreshCw}>
            Yangilash
          </Button>
        }
      />

      <Glass className="p-6">
        {loading ? (
          <div className="py-12 text-center text-slate-500 text-xs">Yuklanmoqda...</div>
        ) : items.length === 0 ? (
          <Empty text="Hali xabarlar yo‘q" sub="Challenge topshirganingizda yoki profilingiz o'zgarganda bildirishnomalar shu yerda chiqadi." />
        ) : (
          <div className="space-y-2.5">
            {items.map((item) => (
              <div
                key={item.id}
                onClick={() => markRead(item.id)}
                className={cn(
                  "p-4 rounded-xl border transition cursor-pointer flex items-start gap-3.5",
                  item.read ? "border-white/[0.04] bg-white/[0.01]" : "border-violet-500/30 bg-violet-600/5"
                )}
              >
                <div className={cn("p-2 rounded-lg mt-0.5", item.read ? "bg-white/[0.04] text-slate-500" : "bg-violet-500/20 text-violet-300")}>
                  <MessageSquare size={16} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-white text-sm">{item.title}</h4>
                    <span className="text-[10px] text-slate-500">{new Date(item.createdAt).toLocaleString("uz-UZ")}</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-400 leading-5">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Glass>
    </div>
  );
}

// ----------------- GLOBAL SEARCH MODAL -----------------
function SearchModal({ onClose, onOpenProfile, onOpenChallenge }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState({ users: [], projects: [], challenges: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults({ users: [], projects: [], challenges: [] });
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await api.get("/api/search", { params: { q: query } });
        setResults(res.data || { users: [], projects: [], challenges: [] });
      } catch {
        setResults({ users: [], projects: [], challenges: [] });
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/80 p-4 pt-16" onClick={onClose}>
      <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-[#0d0f17] shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="p-4 border-b border-white/[0.08] flex items-center gap-3">
          <Search size={18} className="text-slate-400" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Dasturchi ismi, skill, challenge yoki loyiha qidiring..."
            className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
          />
          {loading ? <Loader2 size={16} className="animate-spin text-slate-500" /> : null}
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-white">
            <X size={18} />
          </button>
        </div>

        <div className="p-4 max-h-[70vh] overflow-y-auto space-y-4">
          {query.trim().length < 2 ? (
            <div className="py-10 text-center text-xs text-slate-500">Kamida 2 ta belgi kiriting.</div>
          ) : results.users?.length === 0 && results.projects?.length === 0 && results.challenges?.length === 0 ? (
            <div className="py-10 text-center text-xs text-slate-500">Hech qanday ma'lumot topilmadi.</div>
          ) : (
            <>
              {results.users?.length ? (
                <div>
                  <div className="text-[10px] font-bold uppercase text-slate-500 mb-2">Dasturchilar</div>
                  <div className="space-y-1.5">
                    {results.users.map((u) => (
                      <button
                        key={u.id}
                        type="button"
                        onClick={() => { onOpenProfile(u.id); onClose(); }}
                        className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/[0.04] transition text-left"
                      >
                        <Avatar user={u} size="sm" />
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-bold text-white">{u.name}</div>
                          <div className="text-[10px] text-slate-400">{u.role} • {u.province}</div>
                        </div>
                        <div className="text-xs font-bold text-violet-400">#{u.rank}</div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              {results.challenges?.length ? (
                <div>
                  <div className="text-[10px] font-bold uppercase text-slate-500 mb-2">Challengelar</div>
                  <div className="space-y-1.5">
                    {results.challenges.map((c) => (
                      <div key={c.id} className="p-2.5 rounded-xl border border-white/[0.04] bg-white/[0.01] flex items-center justify-between text-xs">
                        <div>
                          <div className="font-bold text-white">{c.title}</div>
                          <div className="text-[10px] text-slate-400 capitalize">{c.category} • {c.difficulty}</div>
                        </div>
                        <span className="font-bold text-amber-400">{c.points} pts</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ----------------- MAIN APP COMPONENT -----------------
function App() {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE.user);
      return saved ? normalizeUser(JSON.parse(saved)) : null;
    } catch {
      return null;
    }
  });

  const [view, setView] = useState("dashboard");
  const [toasts, setToasts] = useState([]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const [profileOverride, setProfileOverride] = useState(null);
  const [loadingUser, setLoadingUser] = useState(Boolean(user));

  const toast = useCallback((type, title, message) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setToasts((prev) => [...prev, { id, type, title, message }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem(STORAGE.token);
    if (!token) return null;
    try {
      const response = await api.get("/api/profile");
      const next = normalizeUser(response.data?.user);
      setUser(next);
      localStorage.setItem(STORAGE.user, JSON.stringify(next));
      return next;
    } catch (err) {
      if (err?.response?.status === 401) {
        logout();
      }
      throw err;
    } finally {
      setLoadingUser(false);
    }
  }, []);

  const loadLeaderboard = useCallback(async () => {
    try {
      const response = await api.get("/api/leaderboard");
      setLeaderboard(Array.isArray(response.data?.users) ? response.data.users : []);
    } catch {
      setLeaderboard([]);
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    refreshUser().catch(() => {});
    loadLeaderboard();
  }, [user, refreshUser, loadLeaderboard]);

  // Keyboard shortcut Ctrl+K for search
  useEffect(() => {
    function handleKeyDown(e) {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  function logout() {
    localStorage.removeItem(STORAGE.token);
    localStorage.removeItem(STORAGE.user);
    setUser(null);
    setProfileOverride(null);
    setLeaderboard([]);
  }

  function onAuthenticated(nextUser) {
    setUser(normalizeUser(nextUser));
    setView("dashboard");
  }

  async function openProfile(id) {
    try {
      const response = await api.get(`/api/users/${id}`);
      setProfileOverride(normalizeUser(response.data?.user));
      setView("profile");
    } catch (err) {
      toast("error", "Profil", apiMessage(err));
    }
  }

  function renderPage() {
    if (view === "leaderboard") {
      return <LeaderboardView toast={toast} onOpenProfile={openProfile} />;
    }
    if (view === "code") {
      return <CodeLabView toast={toast} refreshUser={refreshUser} />;
    }
    if (view === "profile") {
      const target = profileOverride || user;
      return (
        <ProfileView
          user={target}
          own={!profileOverride || profileOverride.id === user.id}
          toast={toast}
          refreshUser={refreshUser}
        />
      );
    }
    if (view === "content") {
      return <ContentView toast={toast} />;
    }
    if (view === "messages") {
      return <MessagesView toast={toast} />;
    }
    return <DashboardView user={user} leaderboard={leaderboard} setView={setView} toast={toast} refreshUser={refreshUser} />;
  }

  if (!user) {
    return (
      <>
        <AuthView onAuthenticated={onAuthenticated} toast={toast} />
        <Toasts items={toasts} onRemove={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#07080e] text-white selection:bg-violet-500/30">
      <Sidebar
        view={view}
        setView={(v) => {
          setProfileOverride(null);
          setView(v);
        }}
        onLogout={logout}
        user={user}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div className="lg:pl-[260px]">
        <Topbar
          user={user}
          onMenu={() => setMobileOpen(true)}
          onProfile={() => {
            setProfileOverride(null);
            setView("profile");
          }}
          onOpenSearch={() => setSearchOpen(true)}
        />

        <main className="max-w-[1480px] mx-auto px-4 sm:px-8 py-8">
          {renderPage()}
        </main>
      </div>

      {searchOpen ? (
        <SearchModal
          onClose={() => setSearchOpen(false)}
          onOpenProfile={openProfile}
        />
      ) : null}

      <Toasts items={toasts} onRemove={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} />
    </div>
  );
}

export default App;