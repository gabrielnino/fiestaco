import Image from "next/image";

interface SkullLogoProps {
  size?: number;
  className?: string;
}

export default function SkullLogo({ size = 32, className = "" }: SkullLogoProps) {
  return (
    <Image
      src="/logo.png"
      alt="Fiestaco skull logo"
      width={size}
      height={size}
      className={className}
      style={{ objectFit: "contain", display: "block" }}
      priority
    />
  );
}
