"use client";
import { useEffect, useCallback, useMemo } from "react";
import { useLoading } from "./LoadingContext";
import { setLoadingController } from "./api";

export default function LoadingController() {
  const { setIsLoading } = useLoading();

  const controller = useMemo(
    () => ({
      setIsLoading: setIsLoading,
    }),
    [setIsLoading],
  );

  useEffect(() => {
    setLoadingController(controller);
  }, [controller]);

  return null;
}
