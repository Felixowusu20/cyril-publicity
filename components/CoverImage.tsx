type CoverImageProps = {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
};

export function CoverImage({
  src,
  alt,
  className = "cover-image",
  priority = false,
}: CoverImageProps) {
  return (
    // Native img keeps gallery/hero photos visible on mobile; next/image fill
    // was collapsing inside flex cards under the global img max-width rule.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={className}
      decoding={priority ? "sync" : "async"}
      fetchPriority={priority ? "high" : "auto"}
    />
  );
}
