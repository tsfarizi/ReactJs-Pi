export interface AdditionalService {
  id: string;
  name: string;
  price: number;
  unit: string;
  quantity: number;
}

export interface AdditionalServiceResponse {
  id: string;
  name: string;
  price: number;
  unit: string;
  created_at: string;
  updated_at: string;
}

export interface Decoration {
  id: string;
  title: string;
  description: string;
  base_price: number;
  category: string;
  image: string | null;
  created_at: string;
  updated_at: string;
}

export interface DecorationListResponse {
  data: Decoration[];
}

export interface DecorationDetail extends Omit<Decoration, "description"> {
  description: string;
  related_projects: unknown[];
}

export interface DecorationDetailResponse {
  data: DecorationDetail;
}

export type BookingPayload = {
  decoration_id: string;
  date: string;
  additional_services: {
    service_id: string;
    quantity: number;
  }[];
};

export interface BookingData {
  id: string;
  user_id: string;
  decoration_id: string;
  date: string;
  status: string;
  dp_amount: number | null;
  full_amount: number | null;
  invoice_url: string | null;
  created_at: string;
  updated_at: string;
  whatsapp_link: string | null;
}

export interface BookingCreatedResponse {
  message: string;
  data: BookingData;
}

export interface UserBookingItem {
  id: string;
  date: string;
  status: string;
  created_at: string;
  decoration: {
    title: string;
    base_price: number;
  };
  paid_payments: ("dp" | "first" | "final")[];
  available_payments: ("dp" | "first" | "final")[];
  first_payment_date: string;
  final_payment_date: string;
}

export interface BookingPayment {
  id: string;
  type: PaymentType;
  payment_status: "pending" | "paid" | "failed" | string;
  amount: number;
  order_id?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface BookingDetail {
  id: string;
  date: string;
  status:
    | "down_payment"
    | "down_payment_paid"
    | "final_payment"
    | "final_payment_paid"
    | "cancelled";
  created_at: string;
  user: {
    name: string;
    phone_number: string;
  };
  decoration: {
    title: string;
    base_price: number;
  };
  additional_services: {
    name: string;
    price: number;
    unit: string;
    quantity: number;
  }[];
  total_price: number;
  dp_amount: number;
  first_payment_amount: number;
  final_payment_amount: number;
  paid_payments: Array<"dp" | "first" | "final">;
  available_payments: Array<"dp" | "first" | "final">;
  payments?: BookingPayment[];
}

interface User {
  id: string;
  name: string;
  phone_number: string;
  email: string;
}
export interface BookingDetailAdmin {
  id: string;
  date: string;
  status: string;
  created_at: string;
  user: User;
  decoration: Decoration;
  addons_total: number;
  total_price: number;
  payment_summary: string;
}

export interface BookingDetailAdminResponse {
  id: string;
  user: {
    name: string;
    phone_number: string;
  };
  status: string;
  created_at: string;
  decoration: {
    title: string;
    base_price: number;
  };
  total_price: number;
  additional_services: {
    name: string;
    quantity: number;
    price: number;
  }[];
  dp_amount: number;
  first_payment_amount: number;
  final_payment_amount: number;
  paid_payments: PaymentType[];
  available_payments: PaymentType[];
}

export interface LoginResponse {
  message: string;
  data: {
    name: string;
    role: "USER" | "ADMIN";
    token: string;
  };
}

export interface RegisterResponse {
  message: string;
  data: {
    id: string;
    name: string;
    email: string;
    phone_number: string;
    image: string | null;
    role: "USER" | "ADMIN";
    password: string;
    created_at: string;
  };
}

export interface SnapResult {
  transaction_id: string;
  order_id: string;
  gross_amount: string;
  payment_type: string;
  transaction_status: string;
  fraud_status?: string;
  status_code: string;
}

export type PaymentType = "dp" | "first" | "final";

export interface GalleryItem {
  id: string;
  title: string;
  image: string;
  created_at: string;
}

export interface ProjectDecoration {
  id: string;
  title: string;
  description: string;
  cover_image: string | null;
}

export type ProjectImageUrl = string;

export interface ProjectImage {
  id: string;
  project_id: string;
  image_url: string;
  order_index: number;
  created_at: string;
}

export interface ProjectDecorationDetail {
  id: string;
  title: string;
  description: string;
  decoration_id: string;
  created_at: string;
  images: ProjectImageUrl[];
}
