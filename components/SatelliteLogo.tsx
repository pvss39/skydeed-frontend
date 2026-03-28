export default function SatelliteLogo({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Orbit ring */}
      <ellipse
        cx="16"
        cy="16"
        rx="13"
        ry="6"
        stroke="#c9a84c"
        strokeWidth="1.2"
        fill="none"
        opacity="0.5"
        transform="rotate(-30 16 16)"
      />
      {/* Satellite body */}
      <rect
        x="13"
        y="13"
        width="6"
        height="6"
        rx="1.5"
        fill="#c9a84c"
      />
      {/* Solar panel left */}
      <rect
        x="5"
        y="14.5"
        width="6"
        height="3"
        rx="0.75"
        fill="#d4b866"
        opacity="0.85"
      />
      {/* Solar panel right */}
      <rect
        x="21"
        y="14.5"
        width="6"
        height="3"
        rx="0.75"
        fill="#d4b866"
        opacity="0.85"
      />
      {/* Signal dot */}
      <circle cx="16" cy="7" r="1.5" fill="#e8c97a" opacity="0.9" />
      {/* Signal line */}
      <line
        x1="16"
        y1="13"
        x2="16"
        y2="9"
        stroke="#c9a84c"
        strokeWidth="1"
        strokeDasharray="1.5 1"
      />
    </svg>
  );
}
