import "../auth.css";
import { CustomerAuthProvider } from "./customer-auth";

/** Wraps the customer session pages (/login, /signup, /account) with auth + styles. */
export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return <CustomerAuthProvider>{children}</CustomerAuthProvider>;
}
