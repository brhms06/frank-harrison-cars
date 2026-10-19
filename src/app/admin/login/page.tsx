import { Suspense } from "react";
import { LoginForm } from "@/components/admin/login-form";

export const metadata = { title: "Admin login" };

export default function AdminLogin() {
  return (
    <div className="grid min-h-screen place-items-center bg-neutral-100 px-4">
      <div className="w-full max-w-sm space-y-6 rounded-2xl bg-white p-8 shadow-sm ring-1 ring-black/5">
        <div className="space-y-1 text-center">
          <p className="font-serif text-3xl font-semibold">AD</p>
          <h1 className="text-lg font-semibold">Admin login</h1>
        </div>
        <Suspense><LoginForm /></Suspense>
      </div>
    </div>
  );
}
