import { toast } from "react-toastify";
import type { SnapResult } from "../models/model";
import { info, warn, error, mask } from "./logger";

type MidtransCallbacks = {
  onSuccess?: (result: SnapResult) => void;
  onPending?: (result: SnapResult) => void;
  onError?: (result: SnapResult) => void;
  onClose?: () => void;
};

export const payWithMidtrans = (
  snapToken: string,
  callbacks: MidtransCallbacks = {}
) => {
  const { onSuccess, onPending, onError, onClose } = callbacks;

  // @ts-ignore
  if (!window.snap || typeof window.snap.pay !== "function") {
    error("midtrans:pay", "window.snap.pay not available");
    toast.error("Midtrans tidak tersedia. Silakan refresh halaman.");
    return;
  }

  info("midtrans:pay", "Calling snap.pay", { token: mask(snapToken) });
  // @ts-ignore
  window.snap.pay(snapToken, {
    onSuccess: function (result: SnapResult) {
      info("midtrans:pay", "onSuccess", result);
      toast.success("Pembayaran berhasil!");
      console.log("✅ Success:", result);
      onSuccess?.(result);
    },
    onPending: function (result: SnapResult) {
      info("midtrans:pay", "onPending", result);
      toast.info("Pembayaran masih dalam proses.");
      console.log("⏳ Pending:", result);
      onPending?.(result);
    },
    onError: function (result: SnapResult) {
      error("midtrans:pay", "onError", result);
      toast.error("Pembayaran gagal!");
      console.log("❌ Error:", result);
      onError?.(result);
    },
    onClose: function () {
      warn("midtrans:pay", "onClose (user closed Snap)");
      console.log("❌ Pembayaran dibatalkan oleh pengguna.");
      onClose?.();
    },
  });
};
