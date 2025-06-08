// src/components/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import React, { ReactElement } from "react";


const ProtectedRoute = ({ role, children }: { role: string; children: ReactElement }) => {
  const { user } = useAuth();
  if (!user || user.role !== role) return <Navigate to="/login" />;
  return children;
};

export default ProtectedRoute;
