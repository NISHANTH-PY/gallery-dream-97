import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { categories, galleryImages, type Category, type GalleryImage } from "@/lib/gallery-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Lumina Gallery | Curated Photography" },
      { name: "description", content: "A responsive image gallery with category filters, hover effects, and a keyboard-navigable lightbox." },
      { property: "og:title", content: "Lumina Gallery | Curated Photography" },
      { property: "og:description", content: "Browse curated nature, architecture, people, and travel photography." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [lightboxImage, setLightboxImage] = useState<GalleryImage | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const filteredImages = useMemo(() => {
    if (activeCategory === "All") return galleryImages;
    return galleryImages.filter((image) => image.category === activeCategory);
  }, [activeCategory]);

  const openLightbox = (image: GalleryImage) => {
    setLightboxImage(image);
    setIsVisible(true);
  };

  const closeLightbox = () => {
    setIsVisible(false);
    setTimeout(() => setLightboxImage(null), 300);
  };

  const navigateLightbox = (direction: "prev" | "next") => {
    if (!lightboxImage) return;
    const currentIndex = filteredImages.findIndex((img) => img.id === lightboxImage.id);
    const newIndex =
      direction === "next"
        ? (currentIndex + 1) % filteredImages.length
        : (currentIndex - 1 + filteredImages.length) % filteredImages.length;
    const nextImage = filteredImages[newIndex];
    if (nextImage) {
      setLightboxImage(nextImage);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxImage) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") navigateLightbox("next");
      if (e.key === "ArrowLeft") navigateLightbox("prev");
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxImage, filteredImages]);

  useEffect(() => {
    if (lightboxImage) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [lightboxImage]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-12 pb-8 md:pt-16 md:pb-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent mb-3">
              Curated Collection
            </p>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground">
              Lumina Gallery
            </h1>
            <p className="mt-4 max-w-lg text-muted-foreground text-base md:text-lg leading-relaxed">
              A responsive image gallery with category filters, smooth hover transitions, and a full-screen lightbox.
            </p>
          </div>
          <div className="text-sm text-muted-foreground">
            {filteredImages.length} {filteredImages.length === 1 ? "image" : "images"} shown
          </div>
        </div>
      </header>

      <div className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mr-2 shrink-0">
              Filter
            </span>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`
                  shrink-0 rounded-full px-4 py-2 text-sm font-medium
                  transition-all duration-300 ease-out
                  ${
                    activeCategory === category
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "bg-secondary text-secondary-foreground hover:bg-primary/10 hover:text-primary"
                  }
                `}
                aria-pressed={activeCategory === category}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 pb-24">
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
          role="list"
        >
          {filteredImages.map((image, index) => (
            <button
              key={image.id}
              onClick={() => openLightbox(image)}
              className={`
                group relative overflow-hidden rounded-xl bg-card text-left
                shadow-[0_2px_8px_var(--gallery-shadow)]
                transition-all duration-500 ease-out
                hover:-translate-y-1 hover:shadow-[0_12px_32px_var(--gallery-shadow)]
                focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background
                ${image.aspect === "portrait" ? "row-span-2" : ""}
              `}
              style={{ animationDelay: `${index * 60}ms` }}
              role="listitem"
              aria-label={`Open ${image.title} in lightbox`}
            >
              <div className={`relative overflow-hidden ${image.aspect === "portrait" ? "aspect-[3/4]" : "aspect-[4/3]"}`}>
                <img
                  src={image.src}
                  alt={image.title}
                  loading="lazy"
                  width={image.aspect === "portrait" ? 800 : 1200}
                  height={image.aspect === "portrait" ? 1200 : 800}
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--gallery-overlay)] via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="absolute inset-x-0 bottom-0 p-4 translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  <p className="text-lg font-semibold text-white">{image.title}</p>
                  <p className="text-xs font-medium uppercase tracking-wider text-white/80 mt-1">
                    {image.category} · {image.location}
                  </p>
                </div>
                <div className="absolute top-3 right-3 rounded-full bg-white/90 backdrop-blur-sm px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-foreground opacity-0 transition-all duration-300 group-hover:opacity-100">
                  View
                </div>
              </div>
            </button>
          ))}
        </div>

        {filteredImages.length === 0 && (
          <div className="text-center py-24">
            <p className="text-muted-foreground text-lg">No images in this category yet.</p>
          </div>
        )}
      </main>

      {lightboxImage && (
        <div
          className={`
            fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6
            transition-opacity duration-300 ease-out
            ${isVisible ? "opacity-100" : "opacity-0"}
          `}
          role="dialog"
          aria-modal="true"
          aria-label="Image lightbox"
          onClick={closeLightbox}
        >
          <div className="absolute inset-0 bg-[var(--gallery-overlay)] backdrop-blur-md" />

          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-10 rounded-full bg-white/10 backdrop-blur-sm p-3 text-white transition-colors hover:bg-white/20"
            aria-label="Close lightbox"
          >
            <CloseIcon />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              navigateLightbox("prev");
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/10 backdrop-blur-sm p-3 text-white transition-all hover:bg-white/20 hover:scale-110 hidden sm:flex"
            aria-label="Previous image"
          >
            <ChevronLeftIcon />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              navigateLightbox("next");
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/10 backdrop-blur-sm p-3 text-white transition-all hover:bg-white/20 hover:scale-110 hidden sm:flex"
            aria-label="Next image"
          >
            <ChevronRightIcon />
          </button>

          <div
            className={`
              relative z-10 w-full max-w-5xl max-h-[85vh]
              transition-all duration-300 ease-out
              ${isVisible ? "scale-100 translate-y-0" : "scale-95 translate-y-4"}
            `}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={lightboxImage.src}
              alt={lightboxImage.title}
              className="max-h-[75vh] w-auto mx-auto rounded-lg object-contain shadow-[0_24px_60px_var(--gallery-shadow)]"
            />
            <div className="mt-4 text-center">
              <p className="text-xl font-semibold text-white">{lightboxImage.title}</p>
              <p className="text-sm text-white/70 mt-1">
                {lightboxImage.category} · {lightboxImage.location} ·{" "}
                {filteredImages.findIndex((img) => img.id === lightboxImage.id) + 1} /{" "}
                {filteredImages.length}
              </p>
            </div>
          </div>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 sm:hidden">
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigateLightbox("prev");
              }}
              className="rounded-full bg-white/10 backdrop-blur-sm p-3 text-white"
              aria-label="Previous image"
            >
              <ChevronLeftIcon />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigateLightbox("next");
              }}
              className="rounded-full bg-white/10 backdrop-blur-sm p-3 text-white"
              aria-label="Next image"
            >
              <ChevronRightIcon />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ChevronLeftIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
