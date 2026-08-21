"use client";

import { useEffect } from "react";
import { Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";

interface LocationMarkerProps {
  position: [number, number];
}

export default function LocationMarker({
  position,
}: LocationMarkerProps) {
  const map = useMap();

  useEffect(() => {
    map.flyTo(position, 15, {
      duration: 1.2,
    });
  }, [map, position]);

  const userIcon = L.divIcon({
    className: "custom-user-location",
    html: `
      <div style="
        width: 22px;
        height: 22px;
        background: #21633f;
        border: 4px solid white;
        border-radius: 9999px;
        box-shadow: 0 2px 10px rgba(0,0,0,.3);
        position: relative;
      ">
        <div style="
          width: 8px;
          height: 8px;
          background: #e2b45e;
          border-radius: 9999px;
          position: absolute;
          top: 3px;
          left: 3px;
        "></div>
      </div>
    `,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
  });

  return (
    <Marker position={position} icon={userIcon}>
      <Popup>
        <div>
          <h3 className="font-bold text-[#173d2b]">
            Lokasi Kamu
          </h3>

          <p className="mt-1 text-xs text-gray-500">
            Posisi berdasarkan GPS perangkatmu.
          </p>
        </div>
      </Popup>
    </Marker>
  );
}