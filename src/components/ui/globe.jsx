"use client";
import dynamic from "next/dynamic";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

const World = dynamic(() => import("./world").then((mod) => mod.World), {
  ssr: false,
  loading: () => <div className="h-full w-full flex items-center justify-center" />
});

const globeConfig = {
  pointSize: 4,
  globeColor: "#6b7280", // Gray color
  showAtmosphere: false,
  atmosphereColor: "#6b7280",
  atmosphereAltitude: 0.1,
  emissive: "#6b7280",
  emissiveIntensity: 0.1,
  shininess: 0.9,
  polygonColor: "rgba(255,255,255,0.7)",
  ambientLight: "#6b7280",
  directionalLeftLight: "#6b7280",
  directionalTopLight: "#6b7280",
  pointLight: "#6b7280",
  arcTime: 1000,
  arcLength: 0.9,
  rings: 1,
  maxRings: 3,
  initialPosition: { lat: 14.5995, lng: 120.9842 },
  autoRotate: true,
  autoRotateSpeed: 0.5,
};

const colors = ["#6b7280", "#9ca3af", "#d1d5db"];

const sampleArcs = [
  {
    order: 1,
    startLat: 19.076,
    startLng: 72.877,
    endLat: -15.7801,
    endLng: -47.9292,
    arcAlt: 0.1,
    color: colors[Math.floor(Math.random() * (colors.length - 1))],
  },
  {
    order: 2,
    startLat: 28.6139,
    startLng: 77.209,
    endLat: 3.139,
    endLng: 101.6869,
    arcAlt: 0.2,
    color: colors[Math.floor(Math.random() * (colors.length - 1))],
  },
  {
    order: 3,
    startLat: -19.885592,
    startLng: -43.951191,
    endLat: -1.303396,
    endLng: 36.852443,
    arcAlt: 0.5,
    color: colors[Math.floor(Math.random() * (colors.length - 1))],
  },
  {
    order: 4,
    startLat: 1.3521,
    startLng: 103.8198,
    endLat: 35.6762,
    endLng: 139.6503,
    arcAlt: 0.2,
    color: colors[Math.floor(Math.random() * (colors.length - 1))],
  },
  {
    order: 5,
    startLat: 51.5072,
    startLng: -0.1276,
    endLat: 3.139,
    endLng: 101.6869,
    arcAlt: 0.3,
    color: colors[Math.floor(Math.random() * (colors.length - 1))],
  },
  {
    order: 6,
    startLat: -15.432563,
    startLng: 28.315853,
    endLat: 1.094136,
    endLng: -63.34546,
    arcAlt: 0.3,
    color: colors[Math.floor(Math.random() * (colors.length - 1))],
  },
  {
    order: 7,
    startLat: 37.5665,
    startLng: 126.9780,
    endLat: 35.6762,
    endLng: 139.6503,
    arcAlt: 0.3,
    color: colors[Math.floor(Math.random() * (colors.length - 1))],
  },
  {
    order: 8,
    startLat: 22.3193,
    startLng: 114.1694,
    endLat: 51.5072,
    endLng: -0.1276,
    arcAlt: 0.3,
    color: colors[Math.floor(Math.random() * (colors.length - 1))],
  },
  {
    order: 9,
    startLat: -19.885592,
    startLng: -43.951191,
    endLat: -15.595412,
    endLng: -56.05918,
    arcAlt: 0.1,
    color: colors[Math.floor(Math.random() * (colors.length - 1))],
  },
  {
    order: 10,
    startLat: 48.8566,
    startLng: 2.3522,
    endLat: 52.52,
    endLng: 13.405,
    arcAlt: 0.1,
    color: colors[Math.floor(Math.random() * (colors.length - 1))],
  },
  {
    order: 11,
    startLat: 52.52,
    startLng: 13.405,
    endLat: 34.0522,
    endLng: -118.2437,
    arcAlt: 0.2,
    color: colors[Math.floor(Math.random() * (colors.length - 1))],
  },
  {
    order: 12,
    startLat: -15.432563,
    startLng: 28.315853,
    endLat: 37.5665,
    endLng: 126.9780,
    arcAlt: 0.2,
    color: colors[Math.floor(Math.random() * (colors.length - 1))],
  },
  {
    order: 13,
    startLat: 22.3193,
    startLng: 114.1694,
    endLat: -19.885592,
    endLng: -43.951191,
    arcAlt: 0.2,
    color: colors[Math.floor(Math.random() * (colors.length - 1))],
  },
  {
    order: 14,
    startLat: 52.52,
    startLng: 13.405,
    endLat: 62.0115,
    endLng: -129.5802,
    arcAlt: 0.1,
    color: colors[Math.floor(Math.random() * (colors.length - 1))],
  },
  {
    order: 15,
    startLat: 37.5665,
    startLng: 126.9780,
    endLat: 40.7128,
    endLng: -74.0060,
    arcAlt: 0.1,
    color: colors[Math.floor(Math.random() * (colors.length - 1))],
  },
];

export default function Globe() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="w-full h-full relative">
      <World data={sampleArcs} globeConfig={globeConfig} />
    </div>
  );
}
