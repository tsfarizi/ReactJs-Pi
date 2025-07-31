import api from "./api";

export const generateMidtransToken = async (params: {
  bookingId: string;
  paymentType: "dp" | "first" | "final";
}): Promise<{ token: string }> => {
  const response = await api.post("/midtrans/token", params);
  return response.data;
};
