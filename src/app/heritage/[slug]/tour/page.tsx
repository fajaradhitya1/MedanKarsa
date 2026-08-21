"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { X, Info, Volume2, VolumeX, ChevronRight, ArrowLeft } from "lucide-react";

export default function VirtualTourPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [step, setStep] = useState<number>(0);
  const [activeInfo, setActiveInfo] = useState<string>("Memuat tur virtual...");
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const [isPannellumLoaded, setIsPannellumLoaded] = useState<boolean>(false);

  const [tourTitle, setTourTitle] = useState<string>("TUR VIRTUAL MEDANKARSA");
  const [tourIntro, setTourIntro] = useState<string>("Selamat datang di situs bersejarah Kota Medan.");
  const [coverImage, setCoverImage] = useState<string>("/assets/360tamanbunga.png");
  const [scenesData, setScenesData] = useState<Record<string, any>>({});
  const [currentSceneId, setCurrentSceneId] = useState<string>("front");

  const viewerRef = useRef<HTMLDivElement>(null);
  const pannellumInstance = useRef<any>(null);

  // Kamus / Database konfigurasi 360 khusus berdasarkan slug heritage
  const heritageTourDatabase: Record<string, any> = {
    "rumah-tjong-yong-hian": {
      title: "Rumah Tjong Yong Hian",
      intro: "Kompleks memorial bersejarah milik Kapiten Tjong Yong Hian di Jalan Kejaksaan, Medan.",
      scenes: {
        front: {
          title: "Fasad & Taman Depan",
          image: "/assets/360tamanbunga.png", // File 360 khusus Rumah Tjong Yong Hian
          info: "Area halaman depan dengan lanskap asri dan kolam teratai.",
          hotspots: [
            {
              pitch: 0.59,
              yaw: -6.70,
              type: "info",
              text: "Informasi: Kompleks memorial Kapiten Tjong Yong Hian.",
            },
            {
              pitch: 6.0,
              yaw: -15.0,
              type: "scene",
              sceneId: "interior",
              text: "Lihat ke Area Makam ➔",
            }
          ]
        },
        interior: {
          title: "Area Makam & Galeri",
          image: "/assets/360makam.png", // File 360 bagian dalam
          info: "Bagian dalam kompleks makam dan galeri sejarah.",
          hotspots: [
            {
              pitch: 0,
              yaw: 180,
              type: "scene",
              sceneId: "front",
              text: "⬅ Kembali ke Taman Depan",
            }
          ]
        }
      }
    },
   "istana-maimun": {
      title: "Istana Maimun",
      intro: "Istana Kesultanan Deli yang memadukan unsur arsitektur Melayu, Islam, Spanyol, India, dan Italia.",
      scenes: {
        front: {
          title: "Halaman & Fasad Utama Istana",
          image: "/assets/istanamaimun/lapangan360.png",
          info: "Area halaman depan Istana Maimun yang memperlihatkan kemegahan arsitektur khas Kesultanan Deli berdominasi warna kuning.",
          hotspots: [
            {
              pitch: 2.0,
              yaw: 10.0,
              type: "info",
              text: "Arsitektur Istana: Perpaduan gaya Melayu, Timur Tengah, dan Eropa.",
            },
            {
              pitch: -1.0,
              yaw: -5.0,
              type: "scene",
              sceneId: "singgasana",
              text: "Masuk ke Ruang Singgasana ➔",
            }
          ]
        },
        singgasana: {
          title: "Ruang Singgasana Sultan",
          image: "/assets/istanamaimun/singgasana360.png", // Ganti dengan path file 360 ruang singgasana Anda
          info: "Ruang utama tempat singgasana Sultan Deli berada, saksi bisu berbagai penobatan dan acara adat penting.",
          hotspots: [
            {
              pitch: 5.0,
              yaw: 0.0,
              type: "info",
              text: "Singgasana Utama: Singgasana megah bernuansa emas dan kuning.",
            },
            {
              pitch: -2.0,
              yaw: 110.0,
              type: "scene",
              sceneId: "front",
              text: "⬅ Kembali ke Halaman Depan",
            },
            {
              pitch: -2.0,
              yaw: 250.0,
              type: "scene",
              sceneId: "galeri",
              text: "Menuju Galeri / Ruang Koleksi ➔",
            }
          ]
        },
        galeri: {
          title: "Galeri & Koleksi Historis",
          image: "/assets/istanamaimun/galeri360.png", // Ganti dengan path file 360 galeri Anda
          info: "Menyimpan berbagai koleksi foto tempo dulu, senjata tradisional, dan peninggalan keluarga Kesultanan Deli.",
          hotspots: [
            {
              pitch: 0.0,
              yaw: -90.0,
              type: "info",
              text: "Koleksi Senjata & Foto: Memuat arsip sejarah dan atribut kerajaan.",
            },
            {
              pitch: -2.0,
              yaw: -190.0,
              type: "scene",
              sceneId: "front",
              text: "⬅ Kembali ke Taman Depan",
            },
            {
              pitch: -2.0,
              yaw: -10.0,
              type: "scene",
              sceneId: "singgasana",
              text: "⬅ Kembali ke Ruang Singgasana",
            }
          ]
        }
      }
    },
    "rumah-tjong-a-fie": {
      title: "Tjong A Fie Mansion",
      intro: "Rumah bersejarah milik pengusaha sukses Tjong A Fie, dengan perpaduan arsitektur Tionghoa, Eropa, dan Melayu.",
      scenes: {
        front: {
          title: "Fasad & Halaman Depan",
          image: "/assets/tjongafi/halaman360.png", // Ganti dengan path file 360 Anda
          info: "Arsitektur megah bangunan ini mencerminkan pengaruh budaya Tionghoa yang kuat pada masa kolonial Medan.",
          hotspots: [
            {
              pitch: 0.5,
              yaw: -10.0,
              type: "info",
              text: "Pintu Masuk Utama: Bergaya klasik dengan ornamen khas.",
            },
            {
              pitch: -5.0,
              yaw: -10.0,
              type: "scene",
              sceneId: "ruang-tamu",
              text: "Masuk ke Ruang Tamu ➔",
            }
          ]
        },
        "ruang-tamu": {
          title: "Ruang Tamu Utama",
          image: "/assets/tjongafi/ruangtamu360.png", // Ganti dengan path file 360 Anda
          info: "Ruangan mewah tempat Tjong A Fie menerima tamu-tamu kehormatan dan rekan bisnis penting.",
          hotspots: [
            {
              pitch: 10.0,
              yaw: 0.0,
              type: "info",
              text: "Lampu Kristal: Didatangkan khusus dari Eropa.",
            },
            {
              pitch: -2.0,
              yaw: 160.0,
              type: "scene",
              sceneId: "front",
              text: "⬅ Kembali ke Halaman",
            },
            {
              pitch: -2.0,
              yaw: -100.0,
              type: "scene",
              sceneId: "ruang-makan",
              text: "Lanjut ke Ruang Makan ➔",
            }
          ]
        },
        "ruang-makan": {
          title: "Ruang Makan & Galeri",
          image: "/assets/tjongafi/ruangan360.png", // Ganti dengan path file 360 Anda
          info: "Tempat keluarga menyantap hidangan, dihiasi dengan koleksi keramik dan foto sejarah keluarga.",
          hotspots: [
            {
              pitch: 0.0,
              yaw: 90.0,
              type: "info",
              text: "Koleksi Keramik: Peninggalan autentik keluarga Tjong A Fie.",
            },
            {
              pitch: -2.0,
              yaw: 60.0,
              type: "scene",
              sceneId: "ruang-tamu",
              text: "⬅ Kembali ke Ruang Tamu",
            }
          ]
        }
      }
    },
  };

  // Ambil data heritage dan cocokkan dengan database tur di atas
  useEffect(() => {
    if (slug) {
      fetch(`/api/heritage/${slug}`)
        .then((res) => res.json())
        .then((data) => {
          if (data) {
            setCoverImage(data.coverImage || "/assets/360tamanbunga.png");

            // Cek apakah slug terdaftar di kamus tur kita
            if (heritageTourDatabase[slug]) {
              const tourInfo = heritageTourDatabase[slug];
              setTourTitle(tourInfo.title);
              setTourIntro(tourInfo.intro);
              setScenesData(tourInfo.scenes);
              setCurrentSceneId(Object.keys(tourInfo.scenes)[0]);
            } else {
              // Fallback umum jika slug belum didaftarkan di kamus
              setTourTitle(data.name || "TUR VIRTUAL");
              setTourIntro(data.description || "Tur virtual cagar budaya.");
              setScenesData({
                front: {
                  title: data.name,
                  image: data.coverImage || "/assets/360tamanbunga.png",
                  info: data.description,
                  hotspots: []
                }
              });
              setCurrentSceneId("front");
            }
          }
        })
        .catch((err) => {
          console.error("Gagal memuat data tur:", err);
        });
    }
  }, [slug]);

  // Memuat script dan CSS Pannellum secara dinamis lewat CDN
  useEffect(() => {
    if (step === 2) {
      if (!window.document.getElementById("pannellum-css")) {
        const link = document.createElement("link");
        link.id = "pannellum-css";
        link.rel = "stylesheet";
        link.href = "https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css";
        document.head.appendChild(link);
      }

      if (!window.document.getElementById("pannellum-js")) {
        const script = document.createElement("script");
        script.id = "pannellum-js";
        script.src = "https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js";
        script.async = true;
        script.onload = () => setIsPannellumLoaded(true);
        document.body.appendChild(script);
      } else {
        setIsPannellumLoaded(true);
      }
    }
  }, [step]);

  // Inisialisasi Viewer 360
  useEffect(() => {
    if (step === 2 && isPannellumLoaded && viewerRef.current && (window as any).pannellum && Object.keys(scenesData).length > 0 && currentSceneId) {
      const activeScene = scenesData[currentSceneId];
      if (activeScene) {
        setActiveInfo(activeScene.info || "");
      }

      const scenesConfig: Record<string, any> = {};
      Object.keys(scenesData).forEach((key) => {
        const s = scenesData[key];
        scenesConfig[key] = {
          title: s.title,
          type: "equirectangular",
          panorama: s.image,
          hotSpots: (s.hotspots || []).map((hs: any) => ({
            pitch: hs.pitch,
            yaw: hs.yaw,
            type: hs.type === "scene" ? "scene" : "info",
            text: hs.text,
            clickHandlerFunc: hs.type === "scene" ? () => switchScene(hs.sceneId) : undefined,
          })),
        };
      });

      if (pannellumInstance.current) {
        pannellumInstance.current.destroy();
      }

      pannellumInstance.current = (window as any).pannellum.viewer(viewerRef.current, {
        default: {
          firstScene: currentSceneId,
          autoLoad: true,
          compass: true,
          hfov: 110,
          minHfov: 50,
          maxHfov: 130,
        },
        scenes: scenesConfig,
      });
    }

    return () => {
      if (pannellumInstance.current && pannellumInstance.current.destroy) {
        pannellumInstance.current.destroy();
        pannellumInstance.current = null;
      }
    };
  }, [step, isPannellumLoaded, currentSceneId, scenesData]);

  const switchScene = (sceneId: string) => {
    setCurrentSceneId(sceneId);
    if (pannellumInstance.current && pannellumInstance.current.loadScene) {
      pannellumInstance.current.loadScene(sceneId);
    }
  };

  const currentSceneTitle = scenesData[currentSceneId]?.title || "Eksplorasi";

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-black text-white font-serif">
      
      {/* STEP 0: LANDING / COVER */}
      {step === 0 && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-between bg-black/40 p-8 text-center backdrop-blur-[2px]">
          <div className="w-full flex justify-start items-center">
            <h1 className="text-2xl font-bold tracking-widest text-[#f1c76e]">MedanKarsa</h1>
          </div>

          <div className="max-w-2xl space-y-4">
            <h2 className="text-4xl font-bold tracking-wide sm:text-6xl drop-shadow-md uppercase">
              {tourTitle}
            </h2>
            <p className="text-base sm:text-lg text-gray-200 tracking-wide font-sans">
              Tur Virtual Eksklusif Cagar Budaya Kota Medan
            </p>
            <div className="pt-6">
              <button
                onClick={() => setStep(1)}
                className="rounded-full border border-white/80 bg-black/30 px-8 py-3 text-sm font-sans font-semibold tracking-widest text-white backdrop-blur-md transition hover:bg-white hover:text-black cursor-pointer"
              >
                Mulai Tur
              </button>
            </div>
          </div>

          <div className="text-xs text-gray-400 font-sans tracking-widest">
            <span>Indonesia</span> • <span className="text-white">English</span>
          </div>

          <div 
            className="absolute inset-0 -z-10 bg-cover bg-center brightness-50" 
            style={{ backgroundImage: `url(${coverImage})` }}
          />
        </div>
      )}

      {/* STEP 1: PENGANTAR / STORY */}
      {step === 1 && (
        <div className="absolute inset-0 z-50 flex flex-col justify-between bg-black/60 p-8 sm:p-16 backdrop-blur-xs">
          <div className="w-full flex justify-between items-center">
            <h1 className="text-2xl font-bold tracking-widest text-[#f1c76e]">MedanKarsa</h1>
            <button onClick={() => router.back()} className="text-sm font-sans text-gray-300 hover:text-white cursor-pointer">Keluar ✕</button>
          </div>

          <div className="max-w-xl space-y-6">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-wide">Mengenal Lebih Dekat</h2>
            <p className="text-sm sm:text-base leading-relaxed text-gray-200 font-sans">
              {tourIntro}
            </p>
            <button
              onClick={() => setStep(2)}
              className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-black/40 px-8 py-3 text-sm font-sans font-semibold tracking-widest text-white backdrop-blur-md transition hover:bg-white hover:text-black cursor-pointer"
            >
              Mulai Eksplorasi 360° <ChevronRight size={16} />
            </button>
          </div>

          <div className="text-xs text-gray-400 font-sans">
            Virtual Tour Cagar Budaya Kota Medan
          </div>

          <div 
            className="absolute inset-0 -z-10 bg-cover bg-center brightness-40" 
            style={{ backgroundImage: `url(${coverImage})` }}
          />
        </div>
      )}

      {/* STEP 2: PANORAMA 360 */}
      {step === 2 && (
        <div className="fixed inset-0 z-[9999] h-screen w-screen bg-black">
          <div ref={viewerRef} className="absolute inset-0 h-full w-full" />
          {/* Header Navigasi Atas */}
          <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between p-6 bg-gradient-to-b from-black/80 to-transparent pointer-events-auto">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setStep(1)} 
                className="flex items-center gap-1.5 text-xs font-sans text-gray-300 hover:text-white bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10 cursor-pointer"
              >
                <ArrowLeft size={14} /> Kembali
              </button>
              <div>
                <h1 className="text-lg font-bold tracking-wide text-[#f1c76e]">{tourTitle}</h1>
                <p className="text-[11px] text-gray-300 font-sans">{currentSceneTitle}</p>
              </div>
            </div>

            <button 
              onClick={() => router.push("/heritage")}
              className="rounded-full bg-black/50 p-2.5 text-white backdrop-blur-md border border-white/20 hover:bg-white hover:text-black transition cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Sidebar Menu Kiri */}
          <div className="absolute left-6 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-3">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md border border-white/20 shadow-lg transition hover:bg-white hover:text-black cursor-pointer"
              title="Informasi Tempat"
            >
              <Info size={20} />
            </button>
            <button 
              onClick={() => setIsAudioPlaying(!isAudioPlaying)}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md border border-white/20 shadow-lg transition hover:bg-white hover:text-black cursor-pointer"
              title="Audio Narasi"
            >
              {isAudioPlaying ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </button>
          </div>

          {/* Panel Informasi Samping Kanan */}
          {isSidebarOpen && (
            <div className="absolute right-0 top-0 bottom-0 z-30 w-full max-w-md bg-black/85 p-8 text-white backdrop-blur-md border-l border-white/10 flex flex-col justify-between animate-fadeIn font-sans">
              <div>
                <div className="flex justify-between items-center mb-6">
                  <span className="text-[10px] font-bold tracking-[.2em] px-3 py-1 rounded-full bg-[#f1c76e]/20 text-[#f1c76e]">
                    VIRTUAL TOUR 360°
                  </span>
                  <button onClick={() => setIsSidebarOpen(false)} className="text-gray-400 hover:text-white cursor-pointer">
                    <X size={20} />
                  </button>
                </div>

                <h3 className="font-serif text-2xl font-bold mb-4">
                  {currentSceneTitle}
                </h3>

                <p className="text-sm leading-relaxed text-gray-300">
                  {activeInfo}
                </p>
              </div>

              <div className="pt-6 border-t border-white/10 text-xs text-gray-400">
                <p>💡 Tip: Geser layar untuk melihat sudut pandang lain. Klik hotspot untuk membaca informasi atau berpindah ruangan.</p>
              </div>
            </div>
          )}

          {/* Tombol Navigasi Ruangan di Bawah */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-3 bg-black/50 px-5 py-2.5 rounded-full backdrop-blur-md border border-white/20 font-sans">
            {Object.keys(scenesData).map((sceneKey) => (
              <button 
                key={sceneKey}
                type="button"
                onClick={() => switchScene(sceneKey)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${currentSceneId === sceneKey ? "bg-white text-black" : "text-white hover:bg-white/20"}`}
              >
                {scenesData[sceneKey].title || sceneKey}
              </button>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}