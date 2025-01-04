// layout.js
"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "./context/AuthContext";
import { LoadingProvider } from "./context/LoadingContext";
import { useEffect } from "react";
import { setLoadingController } from "./api";
import { useLoading } from "./context/LoadingContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

function LoadingController() {
  const { setIsLoading } = useLoading();

  useEffect(() => {
    setLoadingController({ setIsLoading });
  }, [setIsLoading]);

  return null;
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <LoadingProvider>
              <LoadingController />
              {children}
            </LoadingProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
