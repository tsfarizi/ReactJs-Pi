import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { useState, useEffect } from "react";
import type { DecorationDetail } from "../../models/model";
import { getDecorationById } from "../../services/decorationService";

export default function DecorationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [decoration, setDecoration] = useState<DecorationDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDecoration = async () => {
      try {
        if (id) {
          const res = await getDecorationById(id);
          setDecoration(res.data);
        }
      } catch (error) {
        console.error("Gagal mengambil detail dekorasi:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDecoration();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-lg text-gray-600">Memuat detail dekorasi...</p>
      </div>
    );
  }

  if (!decoration) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-xl text-red-500">Dekorasi tidak ditemukan.</p>
      </div>
    );
  }

  return (
    <div>
      <Navbar />

      <div className="mt-32 flex flex-col justify-center items-center py-6">
        <h1 className="text-3xl sm:text-5xl md:text-4xl text-center transition-all duration-300">
          {decoration.title}
        </h1>
        <div className="mt-2 capitalize text-gray-600">
          Kategori: <span className="font-medium">{decoration.category}</span>
        </div>
        <div className="mt-10 text-justify mx-5 sm:mx-10 md:mx-36 xl:mx-56">
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {decoration.description.replace(/\\n/g, "\n")}
          </p>
        </div>

        {/* Tombol Pesan Sekarang */}
        <div className="mt-12">
          <button
            onClick={() => {
              if (decoration.id) {
                navigate(`/book-now/${decoration.id}`);
              }
            }}
            className="px-6 py-3 bg-secondary text-white rounded-xl shadow hover:bg-secondary/90 transition"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}
