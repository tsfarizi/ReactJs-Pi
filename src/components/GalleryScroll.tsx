import { useRef, useState, useEffect, type MouseEvent } from "react";
import { getAllGalleryDecorations } from "../services/galleryService";
import type { GalleryItem } from "../models/model";

export default function GalleryScroll() {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const onMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const onMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const onMouseUp = () => setIsDragging(false);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await getAllGalleryDecorations();
        setGallery(res.data);
      } catch (error) {
        console.error("Gagal memuat gallery:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

  return (
    <div className="px-2 pb-5 mt-5">
      <div
        ref={scrollRef}
        className="overflow-x-hidden cursor-grab active:cursor-grabbing"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseUp}
        onMouseUp={onMouseUp}
      >
        <div className="flex flex-nowrap space-x-4 select-none">
          {loading
            ? Array.from({ length: 5 }).map((_, idx) => (
                <div
                  key={idx}
                  className="h-64 w-64 bg-gray-200 animate-pulse rounded-lg"
                />
              ))
            : gallery.map((item) => (
                <img
                  key={item.id}
                  src={item.image}
                  alt={item.title}
                  className="h-64 w-auto rounded-lg object-cover flex-shrink-0"
                  draggable={false}
                />
              ))}
        </div>
      </div>
    </div>
  );
}
