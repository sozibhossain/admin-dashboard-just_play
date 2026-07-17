"use client";

import React from "react"

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { LogIn } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ username: "", password: "" });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        username: formData.username,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error(result.error || "Login failed");
      } else if (result?.ok) {
        toast.success("Login successful");
        router.push("/dashboard");
      }
    } catch (error) {
      toast.error("An error occurred during login");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <Card className="w-full max-w-md border-slate-700 bg-slate-800">
        <div className="p-8">
          <div className="flex items-center justify-center mb-8">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">J</span>
            </div>
            <span className="ml-3 text-2xl font-bold text-white">JustPlay</span>
          </div>

          <h1 className="text-2xl font-bold text-white mb-2 text-center">
            Admin Login
          </h1>
          <p className="text-slate-400 text-center mb-8">
            Sign in to your admin account
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Username
              </label>
              <Input
                type="text"
                placeholder="Enter your username"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                disabled={isLoading}
                className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Password
              </label>
              <Input
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                disabled={isLoading}
                className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
              />
            </div>

            <div className="flex items-center justify-between mb-4">
              <label className="flex items-center text-sm">
                <input type="checkbox" className="mr-2" />
                <span className="text-slate-300">Remember me</span>
              </label>
              <Link
                href="/auth/forgot-password"
                className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
              >
                Forgot Password?
              </Link>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              <LogIn className="w-4 h-4 mr-2" />
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

        </div>
      </Card>
    </div>
  );
}
