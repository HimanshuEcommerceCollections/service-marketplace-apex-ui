import type { Metadata } from "next";
import "./admin.css";

export const metadata: Metadata = {
  title: "Apex Admin",
  robots: { index: false, follow: false },
};

/**
 * Wraps every /admin/* route with the dashboard stylesheet. The session comes
 * from the app-wide CustomerAuthProvider in the root layout — the console no
 * longer mounts a provider of its own (see lib/auth-context).
 */
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
