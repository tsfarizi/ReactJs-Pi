import { useRef, useState, useEffect, type MouseEvent } from "react";
import { Link } from "react-router-dom";
import type { ProjectDecoration } from "../models/model";
import { getAllProjectDecorations } from "../services/projectDecorationService";

export default function ProjectDecorationGrid() {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [projects, setProjects] = useState<ProjectDecoration[]>([]);
  const [loading, setLoading] = useState(true);

  const onMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (scrollRef.current) {
      setIsDragging(true);
      setStartX(e.pageX - scrollRef.current.offsetLeft);
      setScrollLeft(scrollRef.current.scrollLeft);
    }
  };

  const onMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = x - startX;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const onMouseUp = () => setIsDragging(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await getAllProjectDecorations();
        setProjects(res.data);
      } catch (err) {
        console.error("Error fetching projects:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="px-4 pb-10">
      <div
        ref={scrollRef}
        className="overflow-x-auto cursor-grab active:cursor-grabbing"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseUp}
        onMouseUp={onMouseUp}
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 select-none border-none">
          {loading
            ? Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="border p-2 flex flex-col justify-start items-start animate-pulse"
                >
                  <div className="h-64 w-full bg-gray-200 rounded-lg" />
                  <div className="mt-2 h-4 w-1/2 bg-gray-200 rounded" />
                  <div className="mt-1 h-3 w-3/4 bg-gray-200 rounded" />
                </div>
              ))
            : projects.map((project, index) => (
                <Link
                  to={`/project-decorations/${project.id}`}
                  key={project.id}
                >
                  <div className="border p-2 flex flex-col justify-start items-start">
                    <img
                      src={project.cover_image}
                      alt={`Gallery ${project.id}`}
                      className="h-64 w-full object-cover rounded-lg"
                      draggable={false}
                      loading="lazy"
                    />
                    <div className="mt-2">
                      <sup className="text-lg">{index + 1}</sup>/{project.title}
                    </div>
                    <div className="text-sm text-gray-600 line-clamp-2">
                      {project.description}
                    </div>
                  </div>
                </Link>
              ))}
        </div>
      </div>
    </div>
  );
}
