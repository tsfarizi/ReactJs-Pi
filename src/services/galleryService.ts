import api from "./api";
import type { GalleryItem } from "../models/model";

/**
 * Mendapatkan semua gallery dekorasi (untuk user/public)
 */
export const getAllGalleryDecorations = async (): Promise<{
  data: GalleryItem[];
}> => {
  const res = await api.get("/gallery-decorations");
  return res.data;
};

/**
 * Membuat gallery decoration baru (admin only)
 */
export const createGalleryDecoration = async (payload: {
  title: string;
  image: string; // URL image yang di-upload ke Supabase
}): Promise<{ data: GalleryItem }> => {
  const res = await api.post("/gallery-decorations", payload);
  return res.data;
};

/**
 * Mengupdate gallery decoration tertentu (admin only)
 */
export const updateGalleryDecoration = async (
  id: string,
  payload: {
    title: string;
    image: string;
  }
): Promise<{ message: string; data: GalleryItem }> => {
  const res = await api.put(`/admin/gallery-decorations/${id}`, payload);
  return res.data;
};

/**
 * Menghapus gallery decoration tertentu (admin only)
 */
export const deleteGalleryDecoration = async (
  id: string
): Promise<{ message: string; data: GalleryItem }> => {
  const res = await api.delete(`/admin/gallery-decorations/${id}`);
  return res.data;
};
