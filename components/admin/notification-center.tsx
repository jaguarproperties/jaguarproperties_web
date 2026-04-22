"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCheck, ExternalLink, Megaphone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type NotificationItem = {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  redirectUrl?: string | null;
  createdAt: string | Date;
};

function formatNotificationTimestamp(value: string | Date) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata"
  }).format(new Date(value));
}

async function readJson(response: Response) {
  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload.error || "Request failed.");
  }
  return payload;
}

export function NotificationCenter({
  canSendAnnouncements,
  initialNotifications,
  initialUnreadCount
}: {
  canSendAnnouncements: boolean;
  initialNotifications: NotificationItem[];
  initialUnreadCount: number;
}) {
  const router = useRouter();
  const [notifications, setNotifications] = useState(initialNotifications);
  const [unreadCount, setUnreadCount] = useState(initialUnreadCount);
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    let active = true;

    async function loadNotifications() {
      try {
        const response = await fetch("/api/notifications?limit=100", { cache: "no-store" });
        const payload = await readJson(response);

        if (!active) return;

        setNotifications(payload.notifications ?? []);
        setUnreadCount(payload.unreadCount ?? 0);
      } catch {
        if (!active) return;
        setMessage((current) => current || "Live notification refresh is temporarily unavailable.");
      }
    }

    void loadNotifications();
    const intervalId = window.setInterval(() => {
      void loadNotifications();
    }, 15000);

    function handleFocus() {
      void loadNotifications();
    }

    window.addEventListener("focus", handleFocus);

    return () => {
      active = false;
      window.clearInterval(intervalId);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  function updateNotificationReadState(notificationId: string) {
    setNotifications((current) =>
      current.map((item) => (item.id === notificationId ? { ...item, isRead: true } : item))
    );
    setUnreadCount((current) => Math.max(0, current - 1));
  }

  async function handleMarkAllRead() {
    startTransition(async () => {
      try {
        const response = await fetch("/api/notifications/read-all", { method: "POST" });
        await readJson(response);

        setNotifications((current) => current.map((item) => ({ ...item, isRead: true })));
        setUnreadCount(0);
        setMessage("All notifications marked as read.");
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Unable to mark notifications as read.");
      }
    });
  }

  async function handleMarkRead(notificationId: string) {
    try {
      const response = await fetch(`/api/notifications/${notificationId}/read`, { method: "PATCH" });
      await readJson(response);
      updateNotificationReadState(notificationId);
      setMessage("Notification marked as read.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to mark notification as read.");
    }
  }

  async function handleOpenNotification(notification: NotificationItem) {
    try {
      if (!notification.isRead) {
        const response = await fetch(`/api/notifications/${notification.id}/read`, { method: "PATCH" });
        await readJson(response);
        updateNotificationReadState(notification.id);
      }

      router.push(notification.redirectUrl || "/admin");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to open notification.");
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
      <Card className="p-6">
        <div className="flex flex-col gap-4 border-b border-white/10 pb-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-display text-3xl text-white">Recent Notifications</h2>
            <p className="mt-2 text-sm text-zinc-400">
              {unreadCount} unread in your queue. The panel shows 4 at a time, with scroll for older items.
            </p>
          </div>
          <Button variant="secondary" onClick={handleMarkAllRead} disabled={pending || unreadCount === 0}>
            <CheckCheck className="h-4 w-4" />
            Mark all as read
          </Button>
        </div>

        <div className="scrollbar-thin mt-6 max-h-[32rem] space-y-3 overflow-y-auto pr-2">
          {notifications.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-zinc-400">
              No notifications yet.
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`rounded-2xl border p-4 ${
                  notification.isRead ? "border-white/10 bg-white/[0.03]" : "border-primary/30 bg-primary/10"
                }`}
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="min-w-0">
                    <div className="flex items-start gap-3">
                      {!notification.isRead ? <span className="mt-1.5 h-2.5 w-2.5 rounded-full bg-primary" /> : null}
                      <div>
                        <p className="text-sm font-semibold text-white">{notification.title}</p>
                        <p className="mt-1 text-sm leading-6 text-zinc-400">{notification.message}</p>
                      </div>
                    </div>
                    <p className="mt-3 text-[11px] uppercase tracking-[0.16em] text-zinc-500">
                      {formatNotificationTimestamp(notification.createdAt)}
                    </p>
                  </div>

                  <div className="flex shrink-0 gap-2">
                    {!notification.isRead ? (
                      <Button variant="ghost" size="sm" onClick={() => void handleMarkRead(notification.id)}>
                        Mark read
                      </Button>
                    ) : null}
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => void handleOpenNotification(notification)}
                    >
                      <ExternalLink className="h-4 w-4" />
                      Open
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {message ? <p className="mt-4 text-sm text-zinc-400">{message}</p> : null}
      </Card>

      {canSendAnnouncements ? (
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white">
              <Megaphone className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-display text-3xl text-white">Send Announcement</h2>
              <p className="mt-1 text-sm leading-7 text-zinc-400">
                Broadcast updates to all employees, a department, a role, or one specific user.
              </p>
            </div>
          </div>
          <div className="mt-6">
            <Link
              href="/admin/notifications#announcement-form"
              className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Use the announcement form below
            </Link>
          </div>
        </Card>
      ) : null}
    </div>
  );
}
