import type { AdditionalService } from "../models/model";
import api from "./api";

export const getAllAdditionalServices = async (): Promise<{
  data: AdditionalService[];
}> => {
  const res = await api.get("/additional-service");
  return res.data;
};
