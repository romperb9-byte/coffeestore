import React, { useState } from 'react';

interface RevenueChartProps {
  exchangeRate: number;
}

export const RevenueChart: React.FC<RevenueChartProps> = ({ exchangeRate }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const data = [
    { day: "Mon", value: 980 },
    { day: "Tue", value: 1120 },
    { day: "Wed", value: 1060 },
    { day: "Thu", value: 1360 },
    { day: "Fri", value: 1284 },
    { day: "Sat", value: 1570 },
    { day: "Sun", value: 1460 }
  ];

  const yMin = 900;
  const yMax = 1600;
  const ySteps = [1600, 1500, 1400, 1300, 1200, 1100, 1000, 900];

  // SVG dimensions
  const width = 640;
  const height = 230;
  const paddingLeft = 45;
  const paddingRight = 20;
  const paddingTop = 15;
  const paddingBottom = 30;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const getX = (index: number) => {
    return paddingLeft + (index / (data.length - 1)) * chartWidth;
  };

  const getY = (val: number) => {
    const ratio = (val - yMin) / (yMax - yMin);
    return paddingTop + chartHeight - ratio * chartHeight;
  };

  const points = data.map((d, i) => ({
    x: getX(i),
    y: getY(d.value),
    day: d.day,
    value: d.value
  }));

  // Build smooth cubic bezier path
  const buildSmoothPath = (pts: { x: number; y: number }[]) => {
    if (pts.length === 0) return '';
    let d = `M ${pts[0].x},${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = i > 0 ? pts[i - 1] : pts[i];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = i != pts.length - 2 ? pts[i + 2] : p2;

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;

      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      d += ` C ${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`;
    }
    return d;
  };

  const linePath = buildSmoothPath(points);
  const areaPath = `${linePath} L ${points[points.length - 1].x},${paddingTop + chartHeight} L ${points[0].x},${paddingTop + chartHeight} Z`;

  return (
    <div className="relative w-full overflow-hidden select-none">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto overflow-visible"
        style={{ minHeight: '220px' }}
      >
        <defs>
          <linearGradient id="warmRevenueGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c77c35" stopOpacity="0.28" />
            <stop offset="85%" stopColor="#e8d5c4" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#fff8f0" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Y-axis grid lines and labels */}
        {ySteps.map((yVal) => {
          const yPos = getY(yVal);
          return (
            <g key={yVal}>
              <line
                x1={paddingLeft}
                y1={yPos}
                x2={width - paddingRight}
                y2={yPos}
                stroke="#ead8c3"
                strokeWidth="1"
                strokeOpacity="0.55"
              />
              <text
                x={paddingLeft - 8}
                y={yPos + 3.5}
                textAnchor="end"
                className="fill-[#846b5c] text-[10px] font-medium tracking-tight"
              >
                {yVal.toLocaleString()}
              </text>
            </g>
          );
        })}

        {/* Gradient Area Fill */}
        <path d={areaPath} fill="url(#warmRevenueGradient)" />

        {/* Smooth Spline Line */}
        <path
          d={linePath}
          fill="none"
          stroke="#c77c35"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Points & Interactive Targets */}
        {points.map((p, idx) => {
          const isHovered = hoveredIdx === idx;
          return (
            <g key={idx} className="cursor-pointer">
              {/* Outer halo on hover */}
              {isHovered && (
                <circle
                  cx={p.x}
                  cy={p.y}
                  r="9"
                  fill="#c77c35"
                  fillOpacity="0.25"
                />
              )}
              {/* Solid point matching screenshot */}
              <circle
                cx={p.x}
                cy={p.y}
                r="4.2"
                fill="#6f4e37"
                stroke="#fffdf9"
                strokeWidth="1.5"
              />
              {/* Invisible large target for touch/hover */}
              <circle
                cx={p.x}
                cy={p.y}
                r="16"
                fill="transparent"
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              />
              {/* X-axis Day Label */}
              <text
                x={p.x}
                y={height - 8}
                textAnchor="middle"
                className={`text-[11px] font-semibold tracking-tight transition-colors ${
                  isHovered ? 'fill-[#6f4e37] font-bold' : 'fill-[#846b5c]'
                }`}
              >
                {p.day}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Floating Tooltip when hovering a point */}
      {hoveredIdx !== null && (
        <div
          className="absolute pointer-events-none transform -translate-x-1/2 -translate-y-full transition-all duration-150 z-20"
          style={{
            left: `${(points[hoveredIdx].x / width) * 100}%`,
            top: `${(points[hoveredIdx].y / height) * 100 - 8}%`
          }}
        >
          <div className="bg-[#261711] text-[#fff8f0] px-3 py-1.5 rounded-xl shadow-xl border border-[#583b27] text-xs font-bold whitespace-nowrap text-center">
            <p className="text-[10px] text-[#dec8b4] font-medium">{points[hoveredIdx].day} Sales</p>
            <p className="text-amber-400 font-extrabold text-sm">${points[hoveredIdx].value.toLocaleString()}</p>
            <p className="text-[10px] text-[#dec8b4]/90">
              {Math.round(points[hoveredIdx].value * exchangeRate).toLocaleString()} ៛
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
