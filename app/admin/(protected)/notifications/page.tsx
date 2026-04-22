import { redirect } from "next/navigation";

import { AnnouncementForm } from "@/components/admin/announcement-form";
import { NotificationCenter } from "@/components/admin/notification-center";
import { Card } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { canSendAnnouncements, getNotificationSummary } from "@/lib/notifications";
import { getNotificationAudienceUsers, getUserDepartments } from "@/lib/data";

export default async function NotificationsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/admin/login");
  }

  const canBroadcast = canSendAnnouncements(session.user.role);
  const [summary, departments, users] = await Promise.all([
    getNotificationSummary(session.user.id, 100),
    canBroadcast ? getUserDepartments() : Promise.resolve([]),
    canBroadcast ? getNotificationAudienceUsers() : Promise.resolve([])
  ]);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.35em] text-primary">Communication</p>
        <h1 className="mt-3 font-display text-5xl text-white">Internal Communications</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-zinc-400">
          Review employee notifications and send targeted internal announcements by audience, department, or user group.
        </p>
      </div>

      <NotificationCenter
        canSendAnnouncements={canBroadcast}
        initialNotifications={summary.notifications}
        initialUnreadCount={summary.unreadCount}
      />

      {canBroadcast ? (
        <Card id="announcement-form" className="p-6">
          <h2 className="font-display text-3xl text-white">Announcement Composer</h2>
          <p className="mt-3 text-sm leading-7 text-zinc-400">
            Send role-based or person-specific notifications from the same database-backed notification system.
          </p>
          <div className="mt-6">
            <AnnouncementForm departments={departments} users={users} />
          </div>
        </Card>
      ) : null}
    </div>
  );
}
