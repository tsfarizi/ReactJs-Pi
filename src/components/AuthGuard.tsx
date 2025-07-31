import type { JSX } from "react";
import { Navigate } from "react-router-dom";

interface Props {
  children: JSX.Element;
  adminOnly?: boolean;
}

export default function AuthGuard({ children, adminOnly = false }: Props) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  if (role === "ADMIN" && !adminOnly) {
    return <Navigate to="/admin" replace />;
  }

  return children;
}
