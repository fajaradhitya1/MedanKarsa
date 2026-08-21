"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Utensils, ShoppingBag, Scissors, Store, ExternalLink } from "lucide-react";
import { renderToStaticMarkup } from "react-dom/server";

interface UmkmItem {
  id: string;
  name: string;
  category: string;
  description: string;
  address: string;
  image: string | null;
}

interface GeocodedUmkm extends UmkmItem {
  lat: number;
  lng: number;
}

const getCategoryIcon = (category: string) => {
  let IconComponent = Store;
  let bgColor = "bg-[#173d2b]";

  if (category.toLowerCase().includes("kuliner") || category.toLowerCase().includes("makanan")) {
    IconComponent = Utensils;
    bgColor = "bg-amber-600";
  } else if (category.toLowerCase().includes("fashion") || category.toLowerCase().includes("pakaian")) {
    IconComponent = ShoppingBag;
    bgColor = "bg-purple-600";
  } else if (category.toLowerCase().includes("kerajinan") || category.toLowerCase().includes("souvenir")) {
    IconComponent = Scissors;
    bgColor = "bg-blue-600";
  }

  const iconMarkup = renderToStaticMarkup(
    <div className={`flex h-9 w-9 items-center justify-center rounded-full text-white shadow-lg border-2 border-white ${bgColor}`}>
      <IconComponent size={18} />
    </div>
  );

  return L.divIcon({
    html: iconMarkup,
    className: "custom-leaflet-icon",
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -20],
  });
};

export default function UmkmMap({ umkms }: { umkms: UmkmItem[] }) {
  const [markers, setMarkers] = useState<GeocodedUmkm[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCoordinates() {
      const geocodedList: GeocodedUmkm[] = [];

      for (const umkm of umkms) {
        try {
          const query = encodeURIComponent(`${umkm.address}, Medan, Sumatera Utara`);
          const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1`);
          const data = await res.json();

          if (data && data.length > 0) {
            geocodedList.push({
              ...umkm,
              lat: parseFloat(data[0].lat),
              lng: parseFloat(data[0].lon),
            });
          } else {
            geocodedList.push({
              ...umkm,
              lat: 3.5952,
              lng: 98.6722,
            });
          }
        } catch (error) {
          console.error("Gagal mendeteksi koordinat alamat:", error);
          geocodedList.push({
            ...umkm,
            lat: 3.5952,
            lng: 98.6722,
          });
        }
      }

      setMarkers(geocodedList);
      setLoading(false);
    }

    if (umkms.length > 0) {
      fetchCoordinates();
    } else {
      setLoading(false);
    }
  }, [umkms]);

  if (loading) {
    return (
      <div className="h-[420px] w-full bg-[#eee8dc] animate-pulse rounded-2xl flex items-center justify-center text-xs text-[#697067]">
        Mendeteksi titik koordinat alamat di peta...
      </div>
    );
  }

  const defaultCenter: [number, number] = [3.5952, 98.6722];

  return (
    <MapContainer
      center={markers.length > 0 ? [markers[0].lat, markers[0].lng] : defaultCenter}
      zoom={14}
      scrollWheelZoom={false}
      className="h-[420px] w-full rounded-2xl z-10"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {markers.map((umkm) => (
        <Marker
          key={umkm.id}
          position={[umkm.lat, umkm.lng]}
          icon={getCategoryIcon(umkm.category)}
        >
          <Popup>
            <div className="p-2 max-w-xs font-sans">
              <span className="text-[10px] font-bold uppercase bg-[#f2eadb] text-[#a27731] px-2 py-0.5 rounded-full">
                {umkm.category}
              </span>
              <h3 className="font-serif font-bold text-sm text-[#173d2b] mt-1">{umkm.name}</h3>
              <p className="text-xs text-gray-600 mt-1 line-clamp-2">{umkm.description}</p>
              <p className="text-[11px] text-gray-500 mt-1 italic">📍 {umkm.address}</p>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(umkm.address + ", Medan")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-[#173d2b] hover:underline"
              >
                Buka di Google Maps <ExternalLink size={12} />
              </a>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}