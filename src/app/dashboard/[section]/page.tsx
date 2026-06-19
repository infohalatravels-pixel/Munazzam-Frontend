import { notFound } from "next/navigation";
import { ComingSoon } from "@/components/dashboard/ComingSoon";

const SECTIONS: Record<string, { title: string; icon: string }> = {
  tasks: { title: "Tasks", icon: "assignment" },
  assets: { title: "Assets", icon: "inventory_2" },
  reports: { title: "Reports", icon: "assessment" },
  notifications: { title: "Notifications", icon: "notifications" },
  settings: { title: "Settings", icon: "settings" },
};

export default async function DashboardSectionPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  const config = SECTIONS[section];

  if (!config) {
    notFound();
  }

  return <ComingSoon title={config.title} icon={config.icon} />;
}
