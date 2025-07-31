import { toast } from "react-toastify";
import type { SnapResult } from "../models/model";

export const payWithMidtrans = (snapToken: string) => {
  // @ts-ignore
  if (!window.snap || typeof window.snap.pay !== "function") {
    toast.error("Midtrans tidak tersedia. Silakan refresh halaman.");
    return;
  }

  // @ts-ignore
  window.snap.pay(snapToken, {
    onSuccess: function (result: SnapResult) {
      toast.success("Pembayaran berhasil!");
      console.log("✅ Success:", result);
    },
    onPending: function (result: SnapResult) {
      toast.info("Pembayaran masih dalam proses.");
      console.log("⏳ Pending:", result);
    },
    onError: function (result: SnapResult) {
      toast.error("Pembayaran gagal!");
      console.log("❌ Error:", result);
    },
    onClose: function () {
      console.log("❌ Pembayaran dibatalkan oleh pengguna.");
    },
  });
};
