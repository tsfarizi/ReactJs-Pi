import type {
  ProjectDecoration,
  ProjectDecorationDetail,
  ProjectImage,
} from "../models/model";
import api from "./api";

/**
 * Mendapatkan semua project decorations (public/user)
 */
export const getAllProjectDecorations = async (): Promise<{
  data: ProjectDecoration[];
}> => {
  const res = await api.get("/project-decorations");
  return res.data;
};

/**
 * Mendapatkan detail satu project decoration
 */
export const getProjectDecorationById = async (
  id: string
): Promise<{ data: ProjectDecorationDetail }> => {
  const res = await api.get(`/project-decorations/${id}`);
  return res.data;
};

/**
 * Membuat project decoration baru (admin only)
 */
export const createProjectDecoration = async (payload: {
  title: string;
  description: string;
  decoration_id: string;
}): Promise<{ data: ProjectDecoration }> => {
  const res = await api.post("/admin/project-decorations", payload);
  return res.data;
};

/**
 * Mengupdate project decoration tertentu (admin only)
 */
export const updateProjectDecoration = async (
  id: string,
  payload: {
    title: string;
    description: string;
  }
): Promise<{ message: string; data: ProjectDecoration }> => {
  const res = await api.put(`/admin/project-decorations/${id}`, payload);
  return res.data;
};

/**
 * Menghapus project decoration tertentu (admin only)
 */
export const deleteProjectDecoration = async (
  id: string
): Promise<{
  message: string;
  data: {
    deletedProject: ProjectDecoration;
    deletedImages: ProjectImage[];
  };
}> => {
  const res = await api.delete(`/admin/project-decorations/${id}`);
  return res.data;
};

/**
 * Upload images ke project decoration tertentu (admin only)
 */
export const uploadProjectImages = async (
  projectId: string,
  formData: FormData
): Promise<{ message: string; data: ProjectImage[] }> => {
  const res = await api.post(
    `/admin/project-decorations/${projectId}/images`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return res.data;
};

/**
 * Menghapus satu image dari project decoration (admin only)
 */
export const deleteProjectImage = async (
  imageId: string
): Promise<{ message: string; data: ProjectImage }> => {
  const res = await api.delete(`/admin/project-images/${imageId}`);
  return res.data;
};
