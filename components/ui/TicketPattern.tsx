import Svg, { G, Text as SvgText } from "react-native-svg";

interface TicketPatternProps {
  width?: number | string;
  height?: number | string;
  fill?: string;
  fillOpacity?: number;
}

// 원본 SVG: public/patterns/ticket-text-pattern.svg
// "For your Ticket." 텍스트 22개를 -24도 회전된 그리드로 타일링
const PHRASE = "For your Ticket.";

// [x, y] 좌표 (원본 SVG 그대로)
const POSITIONS: [number, number][] = [
  [-220, -32],
  [-20, -32],
  [180, -32],
  [380, -32],
  [-160, -2],
  [40, -2],
  [240, -2],
  [440, -2],
  [-80, 28],
  [120, 28],
  [320, 28],
  [-160, 68],
  [40, 68],
  [240, 68],
  [440, 68],
  [-80, 98],
  [120, 98],
  [320, 98],
  [-160, 128],
  [40, 128],
  [240, 128],
  [440, 128],
];

export default function TicketPattern({
  width = "100%",
  height = "100%",
  fill = "#d1d5db",
  fillOpacity = 0.38,
}: TicketPatternProps) {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 420 96"
      preserveAspectRatio="xMidYMid slice"
    >
      <G
        transform="rotate(-24 210 48)"
        fill={fill}
        fillOpacity={fillOpacity}
        fontFamily="Arial, sans-serif"
        fontSize={22}
        fontWeight="800"
        letterSpacing={-0.5}
      >
        {POSITIONS.map(([x, y], i) => (
          <SvgText key={i} x={x} y={y}>
            {PHRASE}
          </SvgText>
        ))}
      </G>
    </Svg>
  );
}
