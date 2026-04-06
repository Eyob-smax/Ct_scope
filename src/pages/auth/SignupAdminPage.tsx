import React from "react";
import { AdminSignupForm } from "@/components/auth/AdminSignupForm";

export default function SignupAdminPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-primary">CitiScope</h1>
          <p className="text-muted-foreground">National Infrastructure Management Platform</p>
        </div>
        <AdminSignupForm />
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <a href="/login" className="font-medium text-primary hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
