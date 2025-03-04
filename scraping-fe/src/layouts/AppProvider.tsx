import { AuthProvider } from "@/hooks";
import { LoadingProvider } from "@/hooks/useLoading";
import React from "react";

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthProvider>
      <LoadingProvider>{children}</LoadingProvider>
    </AuthProvider>
  );
};

export default AppProvider;
