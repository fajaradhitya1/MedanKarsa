"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { ExternalLink } from "lucide-react";

interface UmkmItem {
  id: string;
  name: string;
  category: string;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  image: string | null;
}

const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

export default function ClientLeafletMap({ umkms }: { umkms: UmkmItem[] }) {
  // Pusat Kota Medan sebagai titik tengah default peta
  const defaultCenter: [number, number] = [3.5952, 98.6722];

  return (
    <MapContainer
      center={umkms.length > 0 && umkms[0].latitude ? [umkms[0].latitude, umkms[0].longitude] : defaultCenter}
      zoom={13}
      scrollWheelZoom={false}
      className="h-[420px] w-full rounded-2xl z-10"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {umkms.map((umkm) => {
        // Pastikan latitude dan longitude ada, jika tidak gunakan titik pusat Medan dengan sedikit offset agar tidak tertumpuk
        const lat = umkm.latitude ?? 3.5952;
        const lng = umkm.longitude ?? 98.6722;

        return (
          <Marker key={umkm.id} position={[lat, lng]} icon={defaultIcon}>
            <Popup>
              <div className="p-1 max-w-xs font-sans">
                <span className="text-[10px] font-bold uppercase bg-[#f2eadb] text-[#a27731] px-2 py-0.5 rounded-full">
                  {umkm.category}
                </span>
                <h3 className="font-serif font-bold text-sm text-[#173d2b] mt-1">{umkm.name}</h3>
                <p className="text-xs text-gray-600 mt-1 line-clamp-2">{umkm.description}</p>
                <p className="text-[11px] text-gray-500 mt-1 italic">📍 {umkm.address}</p>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-[#173d2b] hover:underline"
                >
                  Buka di Google Maps <ExternalLink size={12} />
                </a>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}