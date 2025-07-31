import type { Decoration, DecorationDetail } from "../models/model";
import api from "./api";

/**
 * Mendapatkan semua dekorasi (untuk user umum)
 */
export const getAllDecorations = async (): Promise<{ data: Decoration[] }> => {
  const res = await api.get("/decoration");
  return res.data;
};

/**
 * Mendapatkan detail dekorasi berdasarkan ID (untuk user umum)
 */
export const getDecorationById = async (
  id: string
): Promise<{ data: DecorationDetail }> => {
  const res = await api.get(`/decoration/${id}`);
  return res.data;
};

/**
 * Mendapatkan semua dekorasi (admin only)
 */
export const getAllAdminDecorations = async (): Promise<{
  data: Decoration[];
}> => {
  const res = await api.get("/admin/decoration");
  return res.data;
};

/**
 * Membuat dekorasi baru (admin only)
 */
export const createDecoration = async (payload: {
  title: string;
  description: string;
  base_price: number;
  category: string;
}): Promise<{ message: string; data: Decoration }> => {
  const res = await api.post("/admin/decoration", payload);
  return res.data;
};

/**
 * Mengupdate dekorasi tertentu (admin only)
 */
export const updateDecoration = async (
  id: string,
  payload: {
    title: string;
    description: string;
    base_price: number;
    category: string;
  }
): Promise<{ message: string; data: Decoration }> => {
  const res = await api.put(`/admin/decoration/${id}`, payload);
  return res.data;
};

/**
 * Menghapus dekorasi tertentu (admin only)
 */
export const deleteDecoration = async (
  id: string
): Promise<{ message: string; data: Decoration }> => {
  const res = await api.delete(`/admin/decoration/${id}`);
  return res.data;
};
