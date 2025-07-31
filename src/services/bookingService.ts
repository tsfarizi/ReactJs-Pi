import type {
  BookingPayload,
  BookingCreatedResponse,
  UserBookingItem,
  BookingDetail,
  BookingDetailAdmin,
} from "../models/model";
import api from "./api";

/**
 * Membuat booking baru (user)
 */
export const createBooking = async (
  payload: BookingPayload
): Promise<BookingCreatedResponse> => {
  try {
    const response = await api.post<BookingCreatedResponse>(
      "/booking",
      payload
    );
    return response.data;
  } catch (error) {
    console.error("❌ Gagal membuat booking:", error);
    throw error;
  }
};
/**
 * Mendapatkan semua booking milik user yang login
 */
export const getMyBookings = async (): Promise<{ data: UserBookingItem[] }> => {
  const response = await api.get("/booking/me");
  return response.data;
};

/**
 * Mendapatkan detail booking milik user
 */
export const getBookingDetail = async (
  id: string
): Promise<{ data: BookingDetail }> => {
  const response = await api.get(`/booking/${id}`);
  return response.data;
};

/**
 * Mendapatkan semua booking (admin only)
 */
export const getAllBookings = async (): Promise<{
  data: BookingDetailAdmin[];
}> => {
  const response = await api.get("/admin/booking");
  return response.data;
};

/**
 * Membatalkan booking tertentu (admin only)
 */
export const cancelBooking = async (
  id: string
): Promise<{
  message: string;
  data: BookingDetailAdmin;
}> => {
  const response = await api.patch(`/admin/booking/${id}/cancel`);
  return response.data;
};

/**
 * Menghapus booking tertentu
 */

export const deleteBooking = async (
  id: string
): Promise<{ message: string; data: BookingDetailAdmin }> => {
  const res = await api.delete(`/admin/booking/${id}`);
  return res.data;
};

/**
 * Membatalkan booking tertentu (user only)
 */
export const cancelUserBooking = async (
  id: string
): Promise<{
  messagee: string;
  data: BookingDetail;
}> => {
  const res = await api.patch(`/booking/${id}/cancel`);
  return res.data;
};

export const getBookingDetailAdmin = async (
  id: string
): Promise<{ data: BookingDetail }> => {
  const response = await api.get(`/admin/booking/${id}`);
  return response.data;
};
