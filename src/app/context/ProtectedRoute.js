"use client";
import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "./AuthContext";

const withAuth = (WrappedComponent) => {
  return (props) => {
    const { isAuthenticated, loading } = useContext(AuthContext);
    const router = useRouter();

    useEffect(() => {
      if (!loading && !isAuthenticated) {
        router.replace("/");
      }
    }, [isAuthenticated, loading, router]);

    // Show loading state while checking authentication
    if (loading) {
      return (
        <div className="flex items-center justify-center h-screen">
          Loading...
        </div>
      );
    }

    // If not authenticated, return null (will redirect)
    if (!isAuthenticated) {
      return null;
    }

    // If authenticated, render the protected component
    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
