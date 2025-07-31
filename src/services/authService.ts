import type { LoginResponse, RegisterResponse } from "../models/model";
import api from "./api";

export const loginUser = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  const response = await api.post("/auth/login", { email, password });
  return response.data;
};

export const registerUser = async (
  name: string,
  email: string,
  phone: string,
  password: string
): Promise<RegisterResponse> => {
  const response = await api.post("/auth/register", {
    name,
    email,
    phoneNumber: phone,
    password,
  });
  return response.data;
};
