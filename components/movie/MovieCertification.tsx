import { View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface MovieCertificationProps {
  certification: string | null | undefined;
  size?: number;
}

// 웹 버전 그라데이션 (bg-linear-to-br: 좌상→우하)
// Tailwind 컬러 토큰 매칭
const certGradients: Record<string, [string, string]> = {
  ALL: ["#4ade80", "#16a34a"], // green-400 → green-600
  "12": ["#60a5fa", "#2563eb"], // blue-400 → blue-600
  "15": ["#eab308", "#a16207"], // yellow-500 → yellow-700
  "18": ["#f87171", "#dc2626"], // red-400 → red-600
  "19": ["#f87171", "#dc2626"], // red-400 → red-600
};

const DEFAULT_GRADIENT: [string, string] = ["#e5e7eb", "#9ca3af"]; // gray-200 → gray-400

const certLabels: Record<string, string> = {
  ALL: "전체",
  "12": "12",
  "15": "15",
  "18": "18",
};

const knownKeys = new Set(Object.keys(certLabels));

export default function MovieCertification({
  certification,
  size = 24,
}: MovieCertificationProps) {
  if (!certification || certification.trim() === "") return null;

  const colors = certGradients[certification] ?? DEFAULT_GRADIENT;
  const label = knownKeys.has(certification)
    ? certLabels[certification]
    : null;

  return (
    <LinearGradient
      colors={colors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {label && (
        <Text className="text-xs font-bold text-white">{label}</Text>
      )}
    </LinearGradient>
  );
}
