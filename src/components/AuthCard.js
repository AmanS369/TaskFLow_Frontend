import React from "react";
import { Card } from "@/components/ui/card";

export const AuthCard = ({ children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
        {children}
      </Card>
    </div>
  );
};
