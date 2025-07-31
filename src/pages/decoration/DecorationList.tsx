import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllDecorations } from "../../services/decorationService";
import Navbar from "../../components/Navbar";
import type { Decoration } from "../../models/model";

export default function DecorationList() {
  const [decorations, setDecorations] = useState<Decoration[]>([]);
  const [filteredDecorations, setFilteredDecorations] = useState<Decoration[]>(
    []
  );
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllDecorations();
        setDecorations(data.data);
        setFilteredDecorations(data.data);
      } catch (err) {
        console.error("❌ Gagal mengambil dekorasi:", err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    let result = decorations;

    if (search.trim()) {
      result = result.filter((item) =>
        item.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (categoryFilter) {
      result = result.filter((item) => item.category === categoryFilter);
    }

    setFilteredDecorations(result);
  }, [search, categoryFilter, decorations]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-5xl mx-auto pt-28 px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          All Package Decorations
        </h1>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Search by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-1/2 p-2 border rounded-md"
          />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full md:w-1/2 p-2 border rounded-md"
          >
            <option value="">All Categories</option>
            <option value="wedding">Wedding</option>
            <option value="engagement">Engagement</option>
          </select>
        </div>

        <div className="text-sm text-gray-600 mb-4">
          Total: {filteredDecorations.length} decorations
        </div>

        {filteredDecorations.length === 0 ? (
          <div className="text-center text-gray-500 mt-12">
            Tidak ada dekorasi ditemukan.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredDecorations.map((item) => (
              <Link to={`/decorations/${item.id}`} key={item.id}>
                <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition duration-300">
                  <h2 className="text-2xl font-semibold text-secondary mb-2">
                    {item.title}
                  </h2>
                  <p className="text-gray-700">
                    Rp {item.base_price.toLocaleString("id-ID")}
                  </p>
                  <span className="text-sm text-gray-500 capitalize">
                    {item.category}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
