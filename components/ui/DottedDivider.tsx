import { View } from "react-native";

interface DottedDividerProps {
  /** 가로 길이(px) */
  width: number;
  color?: string;
}

/**
 * RN의 borderStyle dotted는 플랫폼에서 무시되는 경우가 많아 점을 직접 배치
 */
export default function DottedDivider({
  width,
  color = "#d4d4d4",
}: DottedDividerProps) {
  const dotSize = 3;
  const gap = 7;
  const dotCount = Math.max(1, Math.floor(width / (dotSize + gap)));

  return (
    <View
      style={{
        width,
        height: dotSize,
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      {Array.from({ length: dotCount }).map((_, index) => (
        <View
          key={index}
          style={{
            width: dotSize,
            height: dotSize,
            borderRadius: dotSize / 2,
            backgroundColor: color,
          }}
        />
      ))}
    </View>
  );
}
