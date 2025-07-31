import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getProjectDecorationById } from "../services/projectDecorationService";
import type { ProjectDecorationDetail } from "../models/model";

export default function DetailProjectDecoration() {
  const { id } = useParams<{ id: string }>();
  const [projectDetail, setProjectDetail] =
    useState<ProjectDecorationDetail | null>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!id) return;
      try {
        const res = await getProjectDecorationById(id);
        setProjectDetail(res.data);
      } catch (error) {
        console.error("Error fetching detail:", error);
      }
    };

    fetchDetail();
  }, [id]);

  return (
    <div>
      <Navbar />

      <div className="mt-32 pb-32 flex flex-col justify-center items-center">
        <div className="text-5xl font-semibold text-center px-4">
          {projectDetail?.title}
        </div>

        <div className="mt-10 text-justify text-gray-700 mx-5 sm:mx-10 md:mx-36 xl:mx-56">
          {projectDetail?.description}
        </div>

        <div className="mx-5 sm:mx-10 md:mx-36 xl:mx-56 mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-4 select-none">
          {projectDetail?.images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Gallery ${index + 1}`}
              className="h-64 w-full object-cover rounded-lg"
              draggable={false}
              loading="lazy"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
