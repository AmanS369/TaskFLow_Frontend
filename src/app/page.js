"use client";

import React, { useContext, useEffect } from "react";
import Link from "next/link";
import { AuthContext } from "./context/AuthContext";
import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle, Clock, Group, Users } from "lucide-react";

const LandingPage = () => {
  const { user } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/home");
    }
  }, [user, router]);

  const features = [
    {
      icon: <CheckCircle className="w-6 h-6 text-blue-500" />,
      title: "Stay Organized",
      description:
        "Keep all your tasks and projects organized in one place with our intuitive interface.",
    },
    {
      icon: <Clock className="w-6 h-6 text-blue-500" />,
      title: "Time Management",
      description:
        "Track time spent on tasks and improve your productivity with detailed insights.",
    },
    {
      icon: <Group className="w-6 h-6 text-blue-500" />,
      title: "Categorized Task",
      description: "Categorize your task for better productivity .",
    },
  ];

  return (
    <main className="min-h-screen bg-white dark:bg-gray-950 selection:bg-blue-500/90 selection:text-white">
      <div className="w-full h-full">
        {/* Header/Nav (keeping your existing header) */}
        <header className="fixed top-0 w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm z-50">
          <nav className="container mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-7 w-7 bg-black dark:bg-white rounded-lg" />
              <span className="font-semibold text-xl text-gray-900 dark:text-white">
                TaskFlow
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="px-4 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="px-4 py-1.5 text-sm font-medium text-white bg-black dark:bg-white dark:text-black rounded-full hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
              >
                Register
              </Link>
            </div>
          </nav>
        </header>

        {/* Hero Section (enhanced version) */}
        <section className="relative pt-32 lg:pt-36">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-5xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">
                Task Management
                <br />
                Reimagined
              </h1>
              <p className="mt-6 text-xl text-gray-600 dark:text-gray-400">
                An intuitive task management platform designed for individuals
                who want to be more productive.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/register"
                  className="px-8 py-3 text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-colors font-medium inline-flex items-center justify-center gap-2"
                >
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/demo"
                  className="px-8 py-3 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-800 rounded-full hover:border-gray-400 dark:hover:border-gray-600 transition-colors font-medium"
                >
                  Live Demo
                </Link>
              </div>
            </div>
          </div>

          {/* Decorative gradient blur */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute -top-40 left-0 right-0 h-96 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/30 dark:via-indigo-950/30 dark:to-purple-950/30 blur-3xl opacity-50" />
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                Everything you need to stay productive
              </h2>
              <p className="mt-4 text-gray-600 dark:text-gray-400">
                Powerful features to help you manage your tasks effectively
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="p-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"
                >
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-blue-600">10k+</div>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  Active Users
                </p>
              </div>
              <div>
                <div className="text-4xl font-bold text-blue-600">1M+</div>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  Tasks Completed
                </p>
              </div>
              <div>
                <div className="text-4xl font-bold text-blue-600">99%</div>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  Customer Satisfaction
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800">
          <div className="container mx-auto px-6 py-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
                  Product
                </h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link
                      href="/features"
                      className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    >
                      Features
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/pricing"
                      className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    >
                      Pricing
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
                  Company
                </h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link
                      href="/about"
                      className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    >
                      About
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/blog"
                      className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    >
                      Blog
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
                  Support
                </h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link
                      href="/help"
                      className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    >
                      Help Center
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/contact"
                      className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    >
                      Contact
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
                  Legal
                </h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link
                      href="/privacy"
                      className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    >
                      Privacy
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/terms"
                      className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    >
                      Terms
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
              <p className="text-center text-gray-600 dark:text-gray-400">
                © {new Date().getFullYear()} TaskFlow. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
};

export default LandingPage;
