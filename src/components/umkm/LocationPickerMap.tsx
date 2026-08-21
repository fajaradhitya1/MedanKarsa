"use client";

import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Komponen helper untuk mendeteksi klik pada peta
function ClickHandler({ setPosition }: { setPosition: (pos: { lat: number; lng: number }) => void }) {
  useMapEvents({
    click(e) {
      setPosition({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

interface LocationPickerProps {
  position: { lat: number; lng: number };
  setPosition: (pos: { lat: number; lng: number }) => void;
}

export default function LocationPickerMap({ position, setPosition }: LocationPickerProps) {
  return (
    <MapContainer
      center={[position.lat, position.lng]}
      zoom={14}
      scrollWheelZoom={true}
      className="h-[300px] w-full rounded-2xl z-10"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ClickHandler setPosition={setPosition} />
      <Marker position={[position.lat, position.lng]} icon={defaultIcon}>
        <Popup>Titik lokasi usaha Anda saat ini. Klik di mana saja pada peta untuk mengubahnya!</Popup>
      </Marker>
    </MapContainer>
  );
}