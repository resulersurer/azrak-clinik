import { AdminPanel } from "@/components/admin-panel";

export const metadata = {
  title: "Yönetim",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminPage() {
  return <AdminPanel />;
}
