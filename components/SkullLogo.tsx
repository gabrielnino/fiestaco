export default function SkullLogo({ size = 32 }: { size?: number }) {
  return (
    <img
      src="/logo.png"
      alt="Fiestaco skull logo"
      width={size}
      height={size}
      style={{ objectFit: "contain", display: "block" }}
    />
  );
}
