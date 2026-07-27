import type { Metadata } from "next";
import "./admin.css";
import { AuthProvider } from "./lib/auth-context";

export const metadata: Metadata = {
  title: "Apex Admin",
  robots: { index: false, follow: false },
};

/** Wraps every /admin/* route with the auth context + the dashboard stylesheet. */
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
