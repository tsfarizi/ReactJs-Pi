import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getBookingDetail } from "../services/bookingService";
import type { BookingDetail, PaymentType } from "../models/model";

export default function InvoicePage() {
  const { id } = useParams<{ id: string }>();
  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    getBookingDetail(id)
      .then((res) => setBooking(res.data))
      .catch((err) => {
        console.error("Gagal mengambil data invoice:", err);
        alert("Gagal memuat data invoice.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const formatRupiah = (angka: number): string => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(angka);
  };

  const getStatusLabel = (status: string): string => {
    switch (status) {
      case "down_payment":
        return "Menunggu DP";
      case "down_payment_paid":
        return "DP Terbayar";
      case "final_payment":
        return "Menunggu Pelunasan";
      case "final_payment_paid":
        return "Pelunasan Terbayar";
      case "cancelled":
        return "Dibatalkan";
      default:
        return status;
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "down_payment":
        return "bg-yellow-100 text-yellow-800";
      case "down_payment_paid":
        return "bg-blue-100 text-blue-800";
      case "final_payment":
        return "bg-yellow-100 text-yellow-800";
      case "final_payment_paid":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading || !booking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-600">Memuat invoice...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-gray-400 text-white p-4 text-center">
          <h1 className="text-2xl font-bold">Invoice Pembayaran</h1>
          <p className="text-sm mt-1">ID Booking: {booking.id}</p>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex justify-between">
            <div>
              <h2 className="font-semibold">Kepada:</h2>
              <p>{booking.user.name}</p>
              <p className="text-sm text-gray-600">
                {booking.user.phone_number}
              </p>
            </div>
            <div className="text-right">
              <h2 className="font-semibold">Tanggal Booking:</h2>
              <p>{new Date(booking.created_at).toLocaleString("id-ID")}</p>
            </div>
          </div>

          <div
            className={`py-2 px-4 rounded-md ${getStatusColor(
              booking.status
            )} inline-block mb-4`}
          >
            <span className="capitalize">{getStatusLabel(booking.status)}</span>
          </div>

          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="px-4 py-2">Item</th>
                <th className="px-4 py-2">Qty</th>
                <th className="px-4 py-2">Harga</th>
                <th className="px-4 py-2">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="px-4 py-2">{booking.decoration.title}</td>
                <td className="px-4 py-2">1</td>
                <td className="px-4 py-2">
                  {formatRupiah(booking.decoration.base_price)}
                </td>
                <td className="px-4 py-2">
                  {formatRupiah(booking.decoration.base_price)}
                </td>
              </tr>
              {booking.additional_services.map((item, index) => (
                <tr key={index} className="border-b">
                  <td className="px-4 py-2">{item.name}</td>
                  <td className="px-4 py-2">{item.quantity}</td>
                  <td className="px-4 py-2">{formatRupiah(item.price)}</td>
                  <td className="px-4 py-2">
                    {formatRupiah(item.price * item.quantity)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4 text-right">
            <h3 className="text-xl font-bold">
              Total: {formatRupiah(booking.total_price)}
            </h3>
          </div>

          <div className="mt-6 border-t pt-4 space-y-2">
            <h3 className="font-semibold mb-2">Rincian Pembayaran:</h3>

            {(["dp", "first", "final"] as PaymentType[]).map((type) => {
              const labelMap: Record<PaymentType, string> = {
                dp: "Uang Muka (DP)",
                first: "Pembayaran Tahap 1",
                final: "Pelunasan",
              };

              const amountMap: Record<PaymentType, number> = {
                dp: booking.dp_amount,
                first: booking.first_payment_amount,
                final: booking.final_payment_amount,
              };

              const isAlreadyPaid = booking.paid_payments.includes(type);
              const isNowAvailable = booking.available_payments.includes(type);

              if (!isAlreadyPaid && !isNowAvailable) return null;

              return (
                <div key={type} className="flex justify-between">
                  <span>{labelMap[type]}:</span>
                  <span>
                    {formatRupiah(amountMap[type])}{" "}
                    <span
                      className={`ml-2 text-sm font-medium ${
                        isAlreadyPaid
                          ? "text-green-600"
                          : "text-yellow-600 italic"
                      }`}
                    >
                      {isAlreadyPaid ? "Sudah dibayar" : "Belum dibayar"}
                    </span>
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Terima kasih telah mempercayai layanan kami!</p>
            <p className="mt-1">Simpan invoice ini sebagai bukti pembayaran.</p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto mt-6 flex justify-between">
        <button
          onClick={() => window.print()}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
        >
          Cetak Invoice
        </button>
      </div>
    </div>
  );
}
