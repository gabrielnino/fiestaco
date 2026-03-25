export default function SkullLogo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="50" cy="44" rx="34" ry="36" fill="#F5E6D3" stroke="#1A1A1A" strokeWidth="3" />
      <rect x="28" y="68" width="44" height="22" rx="6" fill="#F5E6D3" stroke="#1A1A1A" strokeWidth="3" />
      <circle cx="37" cy="44" r="11" fill="#1A1A1A" />
      <circle cx="63" cy="44" r="11" fill="#1A1A1A" />
      <circle cx="37" cy="44" r="7" fill="#FF7A00" opacity="0.8" />
      <circle cx="63" cy="44" r="7" fill="#FF7A00" opacity="0.8" />
      <path d="M38 72 L38 82 M50 70 L50 82 M62 72 L62 82" stroke="#1A1A1A" strokeWidth="3" strokeLinecap="round" />
      <path d="M42 52 Q50 48 58 52" stroke="#2EC4B6" strokeWidth="2" strokeLinecap="round" />
      <circle cx="50" cy="20" r="5" fill="#E6399B" />
      <path d="M40 18 Q50 10 60 18" stroke="#FF7A00" strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  );
}
