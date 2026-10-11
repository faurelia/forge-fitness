"use client";

import "leaflet/dist/leaflet.css";

import * as React from "react";
import L from "leaflet";
import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";

export type LatLng = { lat: number; lng: number };

const DEFAULT_CENTER: LatLng = { lat: 40.7128, lng: -74.006 };

// Inline SVG pin, so we don't depend on Leaflet's default marker image files
// (which break under most bundlers).
const pinIcon = L.divIcon({
  className: "",
  iconSize: [32, 40],
  iconAnchor: [16, 40],
  html: `<svg width="32" height="40" viewBox="0 0 24 30" xmlns="http://www.w3.org/2000/svg" style="filter:drop-shadow(0 2px 2px rgba(0,0,0,.35))">
    <path d="M12 29s9-8.2 9-16A9 9 0 1 0 3 13c0 7.8 9 16 9 16z" fill="#ef4444" stroke="#fff" stroke-width="1.5"/>
    <circle cx="12" cy="13" r="3.5" fill="#fff"/>
  </svg>`,
});

function ClickToPlace({ onChange }: { onChange: (p: LatLng) => void }) {
  useMapEvents({
    click(e) {
      onChange({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

function MapController({
  value,
  focusToken,
}: {
  value: LatLng | null;
  focusToken: number;
}) {
  const map = useMap();

  // The map usually mounts inside an animating dialog, so its size is wrong at
  // first. Recalculate once the dialog has settled.
  React.useEffect(() => {
    const t = setTimeout(() => map.invalidateSize(), 250);
    return () => clearTimeout(t);
  }, [map]);

  // Re-center only when the parent asks (form reset, address lookup, typed
  // coordinates). Dragging the pin must not make the map jump around.
  React.useEffect(() => {
    if (value) map.setView([value.lat, value.lng], Math.max(map.getZoom(), 16));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusToken]);

  return null;
}

export default function LocationPicker({
  value,
  onChange,
  focusToken,
}: {
  value: LatLng | null;
  onChange: (p: LatLng) => void;
  focusToken: number;
}) {
  const start = value ?? DEFAULT_CENTER;

  return (
    <div className="isolate h-72 w-full overflow-hidden rounded-lg border">
      <MapContainer
        center={[start.lat, start.lng]}
        zoom={value ? 16 : 11}
        scrollWheelZoom
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ClickToPlace onChange={onChange} />
        <MapController value={value} focusToken={focusToken} />
        {value && (
          <Marker
            position={[value.lat, value.lng]}
            icon={pinIcon}
            draggable
            eventHandlers={{
              dragend: (e) => {
                const ll = (e.target as L.Marker).getLatLng();
                onChange({ lat: ll.lat, lng: ll.lng });
              },
            }}
          />
        )}
      </MapContainer>
    </div>
  );
}
