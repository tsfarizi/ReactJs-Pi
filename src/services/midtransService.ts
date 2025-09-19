import api from "./api";
import { info, error } from "../utils/logger";

export const generateMidtransToken = async (params: {
  bookingId: string;
  paymentType: "dp" | "first" | "final";
}): Promise<{ token: string }> => {
  try {
    info("midtrans:token", "Requesting token", params);
    const response = await api.post("/midtrans/token", params);
    info("midtrans:token", "Token received");
    return response.data;
  } catch (e) {
    error("midtrans:token", "Failed to get token", e);
    throw e;
  }
};
