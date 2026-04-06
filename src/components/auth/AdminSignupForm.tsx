import React, { useState } from "react";
import { Eye, EyeOff, Phone, User, Lock, Landmark } from "lucide-react";
import { toast } from "sonner";

import { Form } from "@/components/shared/Form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { adminSignupSchema, type AdminSignupValues } from "@/lib/validation/auth.schema";

export function AdminSignupForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function onSubmit(data: AdminSignupValues) {
    setIsLoading(true);
    console.log("Preparing payload for POST /api/auth/signup-admin:", data);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      toast.success("Admin account created successfully");
      // Form reset is handled by the Form component's methods if needed, 
      // but the custom Form wrapper doesn't expose it easily unless we use the children function.
    } catch (error) {
      toast.error("Failed to create admin account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md shadow-lg border-t-4 border-t-primary">
      <CardHeader className="space-y-1">
        <div className="flex justify-center mb-4">
          <div className="p-3 rounded-full bg-primary/10">
            <Landmark className="h-8 w-8 text-primary" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold text-center">Admin Registration</CardTitle>
        <CardDescription className="text-center">
          Create a new administrative account for the CitiScope platform
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form<AdminSignupValues>
          schema={adminSignupSchema}
          defaultValues={{
            phone: "+251",
            full_name: "",
            password: "",
            admin_unit_id: "",
          }}
          onSubmit={onSubmit}
          submitLabel="Register Admin"
          isSubmitting={isLoading}
        >
          {(methods) => (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="full_name"
                    placeholder="Enter full name" 
                    className="pl-10" 
                    {...methods.register("full_name")} 
                  />
                </div>
                {methods.formState.errors.full_name && (
                  <p className="text-xs text-destructive">{methods.formState.errors.full_name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="phone"
                    placeholder="+251..." 
                    className="pl-10" 
                    {...methods.register("phone")} 
                  />
                </div>
                {methods.formState.errors.phone && (
                  <p className="text-xs text-destructive">{methods.formState.errors.phone.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin_unit_id">Admin Unit ID</Label>
                <div className="relative">
                  <Landmark className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="admin_unit_id"
                    placeholder="Enter unit identifier" 
                    className="pl-10" 
                    {...methods.register("admin_unit_id")} 
                  />
                </div>
                {methods.formState.errors.admin_unit_id && (
                  <p className="text-xs text-destructive">{methods.formState.errors.admin_unit_id.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-10 pr-10"
                    {...methods.register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {methods.formState.errors.password && (
                  <p className="text-xs text-destructive">{methods.formState.errors.password.message}</p>
                )}
              </div>
            </div>
          )}
        </Form>
      </CardContent>
    </Card>
  );
}
