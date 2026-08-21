"use client";

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useState } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const customIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function MapPicker({
  latitude,
  longitude,
  onLocationSelect,
}: {
  latitude: number;
  longitude: number;
  onLocationSelect: (lat: number, lng: number, address: string) => void;
}) {
  const [position, setPosition] = useState<[number, number]>([latitude, longitude]);

  // Fungsi untuk mengambil nama alamat berdasarkan koordinat
  const fetchAddress = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      const data = await response.json();
      // Mengambil nama tempat yang paling akurat dari data hasil
      const address = data.display_name || "Lokasi terpilih";
      onLocationSelect(lat, lng, address);
    } catch (error) {
      console.error("Gagal reverse geocoding:", error);
    }
  };

  function MapEvents() {
    useMapEvents({
      click(e) {
        setPosition([e.latlng.lat, e.latlng.lng]);
        fetchAddress(e.latlng.lat, e.latlng.lng);
      },
    });
    return null;
  }

  return (
    <MapContainer
      center={position}
      zoom={14}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker
        position={position}
        icon={customIcon}
        draggable={true}
        eventHandlers={{
          dragend(e) {
            const coord = e.target.getLatLng();
            setPosition([coord.lat, coord.lng]);
            fetchAddress(coord.lat, coord.lng);
          },
        }}
      />
      <MapEvents />
    </MapContainer>
  );
}