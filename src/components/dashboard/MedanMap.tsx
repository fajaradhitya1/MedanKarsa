"use client";

import Link from "next/link";
import { useEffect, useMemo } from "react";
import {
  Circle,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import L from "leaflet";

import "leaflet/dist/leaflet.css";

type Coordinates = [number, number];

interface UserLocation {
  position: Coordinates;
  accuracy: number;
}

export interface MapPlace {
  id: string;
  name: string;
  category: "Heritage" | "UMKM" | "Event";
  position: Coordinates;
  href: string;
  coverImage?: string | null;
}

const MEDAN_CENTER: Coordinates = [3.5952, 98.6722];

function getCustomMarkerIcon(category: "Heritage" | "UMKM" | "Event") {
  let bgColor = "#21633f"; 
  let emoji = "🏛️";

  if (category === "UMKM") {
    bgColor = "#dcae59"; 
    emoji = "☕";
  } else if (category === "Event") {
    bgColor = "#b85d33"; 
    emoji = "🎉";
  }

  return L.divIcon({
    className: "custom-category-marker",
    html: `
      <div style="
        background-color: ${bgColor};
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 3px solid white;
        box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        font-size: 14px;
      ">
        ${emoji}
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
}

function UserLocationMarker({ location }: { location: UserLocation }) {
  const map = useMap();

  const userIcon = useMemo(() => {
    return L.divIcon({
      className: "user-location-icon",
      html: `
        <div style="position: relative; width: 26px; height: 26px;">
          <div style="position: absolute; inset: 0; background: rgba(33, 99, 63, 0.20); border-radius: 9999px; animation: pulse 2s infinite;"></div>
          <div style="position: absolute; top: 4px; left: 4px; width: 18px; height: 18px; background: #21633f; border: 4px solid white; border-radius: 9999px; box-shadow: 0 2px 8px rgba(0,0,0,.35);"></div>
        </div>
      `,
      iconSize: [26, 26],
      iconAnchor: [13, 13],
    });
  }, []);

  useEffect(() => {
    if (location.accuracy > 100) return;
    map.flyTo(location.position, 16, { duration: 1 });
  }, [map, location.position, location.accuracy]);

  return (
    <>
      <Circle
        center={location.position}
        radius={location.accuracy}
        pathOptions={{ color: "#21633f", fillColor: "#21633f", fillOpacity: 0.12, weight: 1 }}
      />
      <Marker position={location.position} icon={userIcon}>
        <Popup>
          <div className="min-w-[170px]">
            <h3 className="font-bold text-[#173d2b]">Lokasi Kamu</h3>
            <p className="mt-1 text-xs text-gray-500">Akurasi ± {Math.round(location.accuracy)} meter</p>
          </div>
        </Popup>
      </Marker>
    </>
  );
}

interface MedanMapProps {
  location: UserLocation | null;
  places: MapPlace[];
}

export default function MedanMap({ location, places }: MedanMapProps) {
  return (
    <MapContainer
      center={MEDAN_CENTER}
      zoom={13}
      scrollWheelZoom={true}
      className="h-full w-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {places.map((place) => (
        <Marker
          key={place.id}
          position={place.position}
          icon={getCustomMarkerIcon(place.category)}
        >
          <Popup>
            <div className="min-w-[190px]">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#173d2b]/10 text-[#173d2b]">
                {place.category}
              </span>
              <h3 className="font-bold text-[#173d2b] mt-1">{place.name}</h3>
              <Link
                href={place.href}
                className="mt-3 block rounded-lg bg-[#173d2b] px-3 py-2 text-center text-xs font-bold text-white transition hover:bg-[#0f291d]"
              >
                Lihat Detail
              </Link>
            </div>
          </Popup>
        </Marker>
      ))}

      {location && <UserLocationMarker location={location} />}
    </MapContainer>
  );
}