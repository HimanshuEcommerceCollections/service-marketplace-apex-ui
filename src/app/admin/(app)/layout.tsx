import { RequireAuth } from "../components/require-auth";
import { AdminShell } from "../components/admin-shell";

/** Guarded shell for every authenticated console page (login lives outside this). */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth>
      <AdminShell>{children}</AdminShell>
    </RequireAuth>
  );
}
