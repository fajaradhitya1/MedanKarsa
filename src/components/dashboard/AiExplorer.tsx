"use client";

import { useState, useEffect } from "react";
import { Sparkles, Send, Clock, X, Loader2, MapPin, ExternalLink } from "lucide-react";
import { useSession } from "next-auth/react";

interface Destination {
  name: string;
  category: string;
  duration: string;
  image: string;
  query: string;
  description: string;
}

interface Message {
  sender: "ai" | "user";
  text?: string;
  options?: string[];
  destinations?: Destination[];
}

// DATABASE LOKAL TERLENGKAP KHUSUS KOTA MEDAN (DIJAMIN KELUAR & BERVARIASI)
const medanDatabase: Destination[] = [
  {
    name: "Tip Top Restaurant & Bakery",
    category: "Legendaris & Nongkrong",
    duration: "1.5 Jam",
    image: "/assets/tiptop.jpg",
    query: "Tip Top Restaurant Medan",
    description: "Restoran dan bakery bergaya kolonial belanda legendaris di Jl. Jend. Ahmad Yani yang wajib dikunjungi.",
  },
  {
    name: "Merdeka Walk",
    category: "Pusat Nongkrong Malam",
    duration: "2 Jam",
    image: "/assets/lapmer.jpeg",
    query: "Merdeka Walk Medan",
    description: "Pusat kuliner outdoor dan tempat nongkrong paling populer di jantung Kota Medan.",
  },
  {
    name: "7 Sumatra Beans",
    category: "Specialty Coffee",
    duration: "1 Jam",
    image: "/assets/7sumatra.jpeg",
    query: "7 Sumatra Beans Medan",
    description: "Kedai kopi dengan biji kopi pilihan terbaik dari berbagai penjuru tanah Sumatra.",
  },
  {
    name: "Blind Tribe Coffee",
    category: "Cafe & Nongkrong",
    duration: "1.5 Jam",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=600&auto=format&fit=crop",
    query: "Blind Tribe Coffee Medan",
    description: "Coffee shop unik di Medan yang dikelola oleh komunitas tunanetra dengan suasana hangat.",
  },
  {
    name: "Potrait Coffee Lab",
    category: "Modern Cafe",
    duration: "1 Jam",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=600&auto=format&fit=crop",
    query: "Potrait Coffee Lab Medan",
    description: "Tempat ngopi dan nongkrong favorit anak muda dengan interior minimalis estetik.",
  },
  {
    name: "Soto Medan Sinar Pagi",
    category: "Kuliner Legendaris",
    duration: "1 Jam",
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?q=80&w=600&auto=format&fit=crop",
    query: "Soto Medan Sinar Pagi Jl Sei Deli",
    description: "Soto berkuah santan kental dengan rempah khas yang sangat tersohor di Medan.",
  },
  {
    name: "Ucok Durian",
    category: "Surga Durian",
    duration: "1.5 Jam",
    image: "https://images.unsplash.com/photo-1519895600678-83b9e28e945c?q=80&w=600&auto=format&fit=crop",
    query: "Ucok Durian Medan",
    description: "Destinasi wajib pencinta durian di Jalan Wahid Hasyim yang buka 24 jam.",
  },
  {
    name: "Tjong A Fie Mansion",
    category: "Wisata Heritage",
    duration: "1.5 Jam",
    image: "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?q=80&w=600&auto=format&fit=crop",
    query: "Tjong A Fie Mansion Medan",
    description: "Rumah megah bersejarah peninggalan saudagar Tionghoa berarsitektur menawan.",
  },
  {
    name: "Istana Maimun",
    category: "Wisata Sejarah",
    duration: "1.5 Jam",
    image: "/assets/istanamaimun/cover1.jpg",
    query: "Istana Maimun Medan",
    description: "Istana Kesultanan Deli yang ikonik di Jl. Brigjen Katamso.",
  },
  {
    name: "Lethal Cafe & Resto",
    category: "Nongkrong Malam",
    duration: "2 Jam",
    image: "https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?q=80&w=600&auto=format&fit=crop",
    query: "Lethal Medan",
    description: "Tempat nongkrong populer malam hari dengan live music dan menu variatif.",
  },
];

export default function AiExplorer() {
  const { data: session } = useSession();
  const userName = session?.user?.name || "Sobat MedanKarsa";

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  
  const [step, setStep] = useState<"ask_duration" | "ask_search">("ask_duration");
  const [selectedHours, setSelectedHours] = useState<string>("");

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          sender: "ai",
          text: `Halo, ${userName}! Berapa jam waktu luangmu di Medan hari ini?`,
          options: ["⏱️ 2 Jam (Kilat)", "⏱️ 4 Jam (Santai)", "⏱️ Seharian Penuh"],
        },
      ]);
    }
  }, [isOpen, userName]);

  // Fungsi pencarian cerdas mencocokkan teks user dengan database lokal Medan
  const handleSearch = (keyword: string) => {
    setLoading(true);
    const query = keyword.toLowerCase();

    setTimeout(() => {
      let filtered = medanDatabase.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query)
      );

      // Jika user mengetik umum seperti "nongkrong" atau "ngopi" tapi tidak spesifik
      if (filtered.length === 0) {
        if (query.includes("nongkrong") || query.includes("tip top") || query.includes("cafe")) {
          filtered = medanDatabase.filter((i) => i.category.includes("Nongkrong") || i.category.includes("Coffee"));
        } else {
          // Default tampilkan beberapa rekomendasi menarik jika tidak ditemukan persis
          filtered = medanDatabase.slice(0, 4);
        }
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: `Hasil rekomendasi untuk "${keyword}" di Medan:`,
          destinations: filtered,
          options: ["🔍 Cari Tempat Lain", "⏱️ Ganti Durasi Waktu"],
        },
      ]);
      setLoading(false);
      setStep("ask_search");
    }, 400);
  };

  const handleOptionClick = (optionText: string) => {
    setMessages((prev) => [...prev, { sender: "user", text: optionText }]);

    if (step === "ask_duration") {
      setSelectedHours(optionText);
      setStep("ask_search");
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            sender: "ai",
            text: `Durasi **${optionText}** dicatat! Sekarang mau cari tempat apa? Ketik bebas (misal: "tip top", "nongkrong", "soto") atau klik tombol di bawah!`,
            options: ["☕ Tempat Ngopi", "🔥 Tempat Nongkrong / Tip Top", "🍜 Kuliner Legendaris", "🏛️ Wisata Sejarah"],
          },
        ]);
      }, 400);
    } else {
      const cleanKeyword = optionText.replace(/^[^\w\s]+/, "").trim();
      handleSearch(cleanKeyword);
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input;
    setInput("");
    setMessages((prev) => [...prev, { sender: "user", text: userText }]);
    handleSearch(userText);
  };

  const resetChat = () => {
    setStep("ask_duration");
    setSelectedHours("");
    setMessages([
      {
        sender: "ai",
        text: `Mari kita mulai ulang. Berapa jam waktu luangmu di Medan hari ini?`,
        options: ["⏱️ 2 Jam (Kilat)", "⏱️ 4 Jam (Santai)", "⏱️ Seharian Penuh"],
      },
    ]);
  };

  return (
    <>
      <section className="mt-16 grid overflow-hidden rounded-3xl bg-[#eadfc9] lg:grid-cols-[1fr_.8fr]">
        <div className="p-7 sm:p-10 lg:p-14">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#173d2b] text-[#f1c76e]">
            <Sparkles size={23} />
          </div>

          <p className="mt-6 text-xs font-bold tracking-[.2em] text-[#8b6b36]">
            AI MEDAN EXPLORER
          </p>

          <h2 className="mt-2 max-w-xl font-serif text-3xl font-bold sm:text-4xl text-[#173d2b]">
            Bingung mau ke mana hari ini?
          </h2>

          <p className="mt-4 max-w-xl text-sm leading-7 text-[#66645d]">
            Cari tempat nongkrong, Tip Top, kafe, atau kuliner secara instan dengan tautan langsung ke Google Maps.
          </p>

          <button
            onClick={() => setIsOpen(true)}
            className="mt-7 flex items-center gap-2 rounded-xl bg-[#173d2b] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#0f291d]"
          >
            <Sparkles size={16} className="text-[#e2b45e]" /> Buatkan Rute Untukku
          </button>
        </div>

        <div className="relative min-h-[300px]">
          <img
            src="/assets/medan.jpeg"
            alt="Medan Explorer"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-[#173d2b]/30" />
        </div>
      </section>

      {/* MODAL CHATBOT */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-fadeIn">
          <div className="flex flex-col h-[700px] w-full max-w-xl rounded-3xl bg-white shadow-2xl overflow-hidden border border-[#e2d8c5]">
            
            {/* Header */}
            <div className="flex items-center justify-between bg-[#173d2b] px-6 py-4 text-white">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e2b45e] text-[#173d2b]">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg">MedanKarsa AI</h3>
                  <p className="text-[11px] text-[#a3c2b1]">Pencarian Tempat Nongkrong & Kuliner Akurat</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full p-2 text-white/80 hover:bg-white/10 transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body Chat */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#f8f3e8]/50">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
                >
                  <div className={`max-w-[90%] rounded-2xl p-4 text-sm leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-[#173d2b] text-white rounded-br-none"
                      : "bg-white text-[#173d2b] shadow-sm border border-[#e2d8c5] rounded-bl-none w-full"
                  }`}>
                    {msg.text && <p className="mb-2">{msg.text}</p>}

                    {/* Tombol Opsi */}
                    {msg.options && (
                      <div className="flex flex-wrap gap-2 mt-3 pt-2 border-t border-[#f2eadb]">
                        {msg.options.map((opt, oIdx) => (
                          <button
                            key={oIdx}
                            onClick={() => {
                              if (opt.includes("Ganti Durasi") || opt.includes("Cari Tempat Lain")) {
                                resetChat();
                              } else {
                                handleOptionClick(opt);
                              }
                            }}
                            className="rounded-xl bg-[#f5f0e6] px-3.5 py-2 text-xs font-bold text-[#173d2b] border border-[#e2d8c5] transition hover:bg-[#e8dfcf]"
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    )}
                    
                    {/* Card Destinasi */}
                    {msg.destinations && (
                      <div className="grid gap-3 mt-3">
                        {msg.destinations.map((dest, idx) => (
                          <div key={idx} className="flex flex-col sm:flex-row gap-3 rounded-2xl border border-[#e2d8c5] bg-[#fdfbf7] p-3 overflow-hidden shadow-xs">
                            <img src={dest.image} alt={dest.name} className="h-28 w-full sm:w-28 rounded-xl object-cover" />
                            <div className="flex flex-col justify-between flex-1">
                              <div>
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#e2b45e]/20 text-[#a27731]">{dest.category}</span>
                                  <span className="text-[11px] text-[#697067] flex items-center gap-1"><Clock size={12}/> {dest.duration}</span>
                                </div>
                                <h4 className="font-serif font-bold text-base text-[#173d2b] mt-1">{dest.name}</h4>
                                <p className="text-xs text-[#697067] line-clamp-2 mt-0.5">{dest.description}</p>
                              </div>
                              <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#e8dfcf]">
                                <span className="text-[11px] text-[#8b9189] flex items-center gap-1">
                                  <MapPin size={12} className="text-[#a27731]" /> Gmaps Terverifikasi
                                </span>
                                <a
                                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(dest.query)}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1.5 rounded-xl bg-[#173d2b] px-3 py-1.5 text-xs font-bold text-white transition hover:bg-[#0f291d]"
                                >
                                  Buka di Gmaps <ExternalLink size={12} />
                                </a>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm text-[#697067] shadow-sm border border-[#e2d8c5]">
                    <Loader2 className="animate-spin text-[#173d2b]" size={16} /> Mencari tempat di Medan...
                  </div>
                </div>
              )}
            </div>

            {/* Form Input Bebas */}
            <form onSubmit={handleSend} className="flex items-center gap-2 p-4 bg-white border-t border-[#e2d8c5]">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ketik apa saja (contoh: 'tip top', 'nongkrong')..."
                className="flex-1 rounded-xl border border-[#e2d8c5] bg-[#f8f3e8]/50 px-4 py-3 text-sm text-[#173d2b] outline-none focus:border-[#21633f]"
              />
              <button type="submit" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#173d2b] text-white transition hover:bg-[#0f291d]">
                <Send size={18} />
              </button>
            </form>

          </div>
        </div>
      )}
    </>
  );
}