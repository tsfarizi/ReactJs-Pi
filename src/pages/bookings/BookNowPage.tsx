import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import type {
  AdditionalService,
  BookingPayload,
  DecorationDetail,
} from "../../models/model";
import { getAllAdditionalServices } from "../../services/additionalService";
import { getDecorationById } from "../../services/decorationService";
import { createBooking } from "../../services/bookingService";
import { toast } from "react-toastify";
import type { AxiosError } from "axios";

export default function BookNowPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [decoration, setDecoration] = useState<DecorationDetail | null>(null);
  const [services, setServices] = useState<AdditionalService[]>([]);
  const [selectedServices, setSelectedServices] = useState<
    { id: string; name: string; price: number; quantity: number }[]
  >([]);
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [isAgreed, setIsAgreed] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        if (!id) return;
        const [decorationRes, servicesRes] = await Promise.all([
          getDecorationById(id),
          getAllAdditionalServices(),
        ]);
        setDecoration(decorationRes.data);
        setServices(servicesRes.data);
      } catch (err) {
        console.error("❌ Gagal mengambil data:", err);
        toast.error("Gagal mengambil data dekorasi atau layanan tambahan.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  const handleQuantityChange = (serviceId: string, value: number) => {
    setSelectedServices((prev) => {
      const exists = prev.find((s) => s.id === serviceId);
      if (exists) {
        return prev.map((s) =>
          s.id === serviceId ? { ...s, quantity: value } : s
        );
      } else {
        const newService = services.find((s) => s.id === serviceId);
        if (!newService) return prev;
        return [
          ...prev,
          {
            id: newService.id,
            name: newService.name,
            price: newService.price,
            quantity: value,
          },
        ];
      }
    });
  };

  const handleSubmit = async () => {
    if (!isAgreed) {
      toast.error(
        "Anda harus menyetujui syarat dan ketentuan terlebih dahulu."
      );
      return;
    }

    if (submitting) return; // Hindari multiple submit

    if (!decoration || !date) {
      toast.error("Harap lengkapi semua data terlebih dahulu.");
      return;
    }

    try {
      setSubmitting(true);

      const payload: BookingPayload = {
        decoration_id: decoration.id,
        date,
        additional_services: selectedServices
          .filter((s) => s.quantity > 0)
          .map((s) => ({
            service_id: s.id,
            quantity: s.quantity,
          })),
      };

      const result = await createBooking(payload);

      setTimeout(() => {
        navigate("/booking", {
          state: {
            successMessage: result.message || "Booking berhasil dibuat!",
            whatsappLink: result.data.whatsapp_link,
          },
        });
      }, 2000);
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      console.error("❌ Gagal booking:", err);
      toast.error(err.response?.data?.message || "Gagal melakukan pemesanan.");
    } finally {
      setSubmitting(false);
    }
  };

  const formatRupiah = (angka: number): string => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(angka);
  };

  const totalAdditionalCost = selectedServices.reduce(
    (acc, service) => acc + service.price * service.quantity,
    0
  );

  const grandTotal = (decoration?.base_price || 0) + totalAdditionalCost;

  if (loading || !decoration) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-lg text-gray-600 animate-pulse">Memuat data...</p>
      </div>
    );
  }

  const getMinBookingDate = () => {
    const today = new Date();
    const minDate = new Date(today);
    if (decoration?.category?.toLowerCase() === "wedding") {
      minDate.setDate(today.getDate() + 21); // H-3 minggu
    } else if (decoration?.category?.toLowerCase() === "engagement") {
      minDate.setDate(today.getDate() + 5); // H-5 hari
    } else {
      // Default: minimal hari ini
      return today.toISOString().split("T")[0];
    }
    return minDate.toISOString().split("T")[0];
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-4xl mx-auto pt-28 px-4 pb-10">
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
            {decoration.title}
          </h1>
          <p className="text-gray-700 whitespace-pre-wrap mb-4">
            {decoration.description.replace(/\\n/g, "\n")}
          </p>

          {/* Tanggal Booking */}
          <div className="mb-5">
            <label className="block font-medium text-gray-700 mb-1">
              Pilih Tanggal
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={getMinBookingDate()}
              className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          {/* Layanan Tambahan */}
          <div className="mb-5">
            <h2 className="font-semibold text-gray-800 mb-2">
              Layanan Tambahan
            </h2>
            <div className="space-y-3">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-2"
                >
                  <div>
                    <p className="font-medium">{service.name}</p>
                    <p className="text-sm text-gray-600">
                      Rp {service.price.toLocaleString("id-ID")} /{" "}
                      {service.unit}
                    </p>
                  </div>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    className="w-20 border border-gray-300 p-1 rounded-md text-right focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    onChange={(e) =>
                      handleQuantityChange(
                        service.id,
                        parseInt(e.target.value) || 0
                      )
                    }
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Ringkasan Total Biaya */}
          <div className="mb-6 border-t pt-4">
            <h2 className="font-semibold text-gray-800 mb-3">
              Ringkasan Biaya
            </h2>
            <div className="flex justify-between text-gray-700 mb-1">
              <span>Harga Dekorasi</span>
              <span>{formatRupiah(decoration.base_price)}</span>
            </div>
            <div className="flex justify-between text-gray-700 mb-1">
              <span>Layanan Tambahan</span>
              <span>{formatRupiah(totalAdditionalCost)}</span>
            </div>
            <hr className="my-2" />
            <div className="flex justify-between font-bold text-lg text-gray-800">
              <span>Total</span>
              <span>{formatRupiah(grandTotal)}</span>
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="mb-4">
            <label className="flex items-start gap-2">
              <input
                type="checkbox"
                checked={isAgreed}
                onChange={(e) => setIsAgreed(e.target.checked)}
                className="mt-1"
              />
              <span className="text-sm text-gray-700 leading-tight">
                Dengan melakukan pemesanan, saya menyetujui{" "}
                <button
                  type="button"
                  onClick={() => setShowTerms(true)}
                  className="underline text-blue-600 hover:text-blue-800"
                >
                  syarat dan ketentuan
                </button>
                .
              </span>
            </label>
          </div>

          {showTerms && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <div className="bg-white max-w-lg w-full p-6 rounded-lg shadow-lg overflow-y-auto max-h-[80vh]">
                <h2 className="text-xl font-bold mb-4">Syarat dan Ketentuan</h2>
                <ol className="text-sm text-gray-700 space-y-2 list-decimal list-inside">
                  <li>
                    Client harus konfirmasi tanggal dan tempat acara untuk
                    booking.
                  </li>
                  <li>
                    Harga belum termasuk transportasi: Jakarta Rp300.000,
                    Bodetabek Rp500.000.
                  </li>
                  <li>Survey venue hanya 1 kali.</li>
                  <li>Meeting/Technical meeting hanya 1 kali.</li>
                  <li>Tidak termasuk charge venue (jika dikenakan).</li>
                  <li>
                    Kerusakan/kehilangan properti jadi tanggung jawab client.
                  </li>
                  <li>
                    Pembatalan karena Force Majeure tidak ada pengembalian dana.
                  </li>
                </ol>
                <div className="mt-6 text-right">
                  <button
                    onClick={() => setShowTerms(false)}
                    className="px-4 py-2 bg-secondary text-white rounded hover:bg-opacity-80"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tombol Pesan Sekarang */}
          <button
            onClick={handleSubmit}
            disabled={!isAgreed || submitting}
            className={`w-full py-3 rounded-md transition-all duration-300 shadow-md font-semibold ${
              isAgreed && !submitting
                ? "bg-secondary hover:bg-neutral-500 text-white hover:shadow-lg"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {submitting ? "Memproses..." : "Pesan Sekarang"}
          </button>
        </div>
      </div>
    </div>
  );
}
