import { useState } from "react";

export const useToast = () => {
  const [toast, setToast] = useState<{ title: string; description?: string } | null>(null);

  return {
    toast,
    showToast: (message: { title: string; description?: string }) => setToast(message),
    clearToast: () => setToast(null),
  };
};
