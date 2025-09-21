import api from "./api";
import { info, error } from "../utils/logger";
import type { BookingPayment } from "../models/model";

type ConvertFinalResponse = {
  message: string;
  data?: unknown;
};


type EnsureFinalResponse = {
  message: string;
  data?: {
    bookingId: string;
    paymentId: string;
    created: boolean;
    payment?: BookingPayment | null;
    amount?: number;
  };
};

export const ensureFinalPayment = async (bookingId: string): Promise<EnsureFinalResponse> => {
  try {
    info("payment:ensureFinal", "Ensuring final payment row", { bookingId });
    const response = await api.post(
      `/admin/bookings/${bookingId}/payments/final/ensure`
    );
    info("payment:ensureFinal", "Ensure final payment response", {
      bookingId,
      status: response.status,
    });
    return response.data;
  } catch (err: any) {
    const status = err?.response?.status;
    error("payment:ensureFinal", "Failed to ensure final payment", {
      bookingId,
      status,
      error: err,
    });
    throw err;
  }
};

export const convertPaymentToFinal = async (paymentId: string): Promise<ConvertFinalResponse> => {
  try {
    info("payment:convertFinal", "Converting payment to final", { paymentId });
    const response = await api.patch(`/admin/payments/${paymentId}/convert-final`);
    info("payment:convertFinal", "Conversion response received", {
      paymentId,
      status: response.status,
    });
    return response.data;
  } catch (err: any) {
    const status = err?.response?.status;
    error("payment:convertFinal", "Failed to convert payment to final", {
      paymentId,
      status,
      error: err,
    });
    throw err;
  }
};


