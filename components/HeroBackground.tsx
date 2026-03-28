import Image from "next/image";

// Blur placeholder para background (generado automáticamente)
const BACKGROUND_BLUR_PLACEHOLDER = "data:image/webp;base64,UklGRmoAAABXRUJQVlA4IF4AAABwBACdASoUABQAPm0ukkakIqGhKA1QgA2JZQCdMoR8eBTj4wdEqdwsS7xQAAD+9cbmp4j8Ph+JfXnoV4vxReoAAI1UkMnh0QjrlcNUcA4JZQ/j7JDGZfzQvLVvAAAA";

export default function HeroBackground() {
  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: -1,
      overflow: 'hidden',
    }}>
      <Image
        src="/background.webp"
        alt="Mexican food background with traditional patterns"
        fill
        style={{
          objectFit: 'cover',
          objectPosition: 'center',
        }}
        quality={85}
        sizes="100vw"
        priority={true}
        placeholder="blur"
        blurDataURL={BACKGROUND_BLUR_PLACEHOLDER}
      />
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(to bottom, rgba(11, 11, 11, 0.7) 0%, rgba(11, 11, 11, 0.9) 100%)',
      }} />
    </div>
  );
}