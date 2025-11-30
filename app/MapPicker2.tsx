"use client";
import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";

// تحديث الأيقونات الافتراضية لـ Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
});

// مكون GeoSearch + MapClick مدمج في Hook واحد
function MapInteractions({ onChange }: { onChange: (d: any) => void }) {
  const map = useMap();

  // التعامل مع البحث
  useEffect(() => {
    if (!map) return;

    const provider = new OpenStreetMapProvider();
    const searchControl = (GeoSearchControl as any)({
      provider,
      style: " button",
      autoComplete: true,
      autoCompleteDelay: 250,
      searchLabel: "ابحث عن موقع المطعم...",
      notFoundMessage: "لم يتم العثور على نتيجة",
      showPopup: false,
    });
    map.addControl(searchControl);

    const handleShowLocation = (e: any) => {
      const loc = e.location ?? e.results?.[0];
      if (!loc) return;
      const lat = Number(loc.y ?? loc.lat);
      const lng = Number(loc.x ?? loc.lon);
      const address = loc.label ?? loc.properties?.label ?? "";
      onChange({ lat, lng, address });
      map.setView([lat, lng], 15);
    };

    map.on("geosearch/showlocation", handleShowLocation);
    try {
      searchControl.on("results", handleShowLocation);
    } catch {}

    return () => {
      map.off("geosearch/showlocation", handleShowLocation);
      map.removeControl(searchControl);
    };
  }, [map, onChange]);

  // التعامل مع النقر على الخريطة
  useMapEvents({
    click: async (e) => {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;
      // طلب العنوان من OpenStreetMap
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
        );
        const data = await (res.ok ? res.json() : null);
        const address = data?.display_name ?? "";
        onChange({ lat, lng, address });
      } catch {
        onChange({ lat, lng, address: "" });
      }
    },
  });

  return null;
}

type Props = {
  defaultPosition?: [number, number];
  onChange?: (data: { lat: number; lng: number; address: string }) => void;
  lat?: number;
  lng?: number;
};

export default function MapPicker({
  defaultPosition = [30.0444, 31.2357],
  onChange,
  lat,
  lng,
}: Props) {
  const initialMarker: [number, number] | null =
    lat !== undefined && lng !== undefined ? [lat, lng] : null;
  const [marker, setMarker] = useState<[number, number] | null>(initialMarker);

  // تحديث Marker + عنوان عند أي حدث (نقر أو بحث)
  const handleChange = (data: {
    lat: number;
    lng: number;
    address: string;
  }) => {
    setMarker([data.lat, data.lng]);
    onChange?.(data);
  };

  return (
    <MapContainer
      center={marker ?? defaultPosition} // استخدم الماركر إذا موجود
      zoomControl={false}
      zoom={15}
      style={{ height: "10rem", width: "100%" }}
      className="rounded-xl h-40 p-5  border-2 border-orange-100"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="© OpenStreetMap contributors"
      />
      <MapInteractions onChange={handleChange} />
      {marker && <Marker position={marker} />}
    </MapContainer>
  );
}
