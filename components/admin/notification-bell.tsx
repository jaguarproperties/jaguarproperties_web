"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, CheckCheck, Megaphone } from "lucide-react";

type NotificationItem = {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  redirectUrl?: string | null;
  createdAt: string;
};

export function NotificationBell({ canSendAnnouncements }: { canSendAnnouncements: boolean }) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    let active = true;

    async function loadNotifications() {
      try {
        const response = await fetch("/api/notifications?limit=8", { cache: "no-store" });
        if (!response.ok) return;

        const payload = await response.json();
        if (!active) return;

        setNotifications(payload.notifications ?? []);
        setUnreadCount(payload.unreadCount ?? 0);
      } catch {
        // Ignore polling failures in the navbar.
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

  useEffect(() => {
    if (!open) return;

    async function loadNotifications() {
      try {
        const response = await fetch("/api/notifications?limit=8", { cache: "no-store" });
        if (!response.ok) return;

        const payload = await response.json();
        setNotifications(payload.notifications ?? []);
        setUnreadCount(payload.unreadCount ?? 0);
      } catch {
        // Ignore refresh failures when opening the menu.
      }
    }

    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    void loadNotifications();
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  async function handleMarkAllRead() {
    startTransition(async () => {
      const response = await fetch("/api/notifications/read-all", { method: "POST" });
      if (!response.ok) return;

      setNotifications((current) => current.map((item) => ({ ...item, isRead: true })));
      setUnreadCount(0);
    });
  }

  async function handleOpenNotification(notification: NotificationItem) {
    if (!notification.isRead) {
      await fetch(`/api/notifications/${notification.id}/read`, { method: "PATCH" });
      setNotifications((current) =>
        current.map((item) => (item.id === notification.id ? { ...item, isRead: true } : item))
      );
      setUnreadCount((current) => Math.max(0, current - 1));
    }

    setOpen(false);
    router.push(notification.redirectUrl || "/admin");
    router.refresh();
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="relative inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:bg-white/10"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 ? (
          <span className="absolute right-1 top-1 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        ) : null}
      </button>

      {open ? (
        <div className="absolute right-0 z-50 mt-3 w-[min(24rem,calc(100vw-2rem))] rounded-[24px] border border-white/10 bg-zinc-950/95 p-4 shadow-[0_25px_80px_-32px_rgba(0,0,0,0.75)] backdrop-blur-xl">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-white">Notifications</p>
              <p className="text-xs text-zinc-500">{unreadCount} unread</p>
            </div>
            <div className="flex items-center gap-2">
              {canSendAnnouncements ? (
                <Link
                  href="/admin/notifications"
                  onClick={() => setOpen(false)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-200 transition hover:bg-white/10"
                >
                  <Megaphone className="h-4 w-4" />
                </Link>
              ) : null}
              <button
                type="button"
                onClick={handleMarkAllRead}
                disabled={pending || unreadCount === 0}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-200 transition hover:bg-white/10 disabled:opacity-50"
              >
                <CheckCheck className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="mt-4 max-h-[24rem] space-y-2 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-zinc-400">
                No notifications yet.
              </div>
            ) : (
              notifications.map((notification) => (
                <button
                  key={notification.id}
                  type="button"
                  onClick={() => void handleOpenNotification(notification)}
                  className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                    notification.isRead
                      ? "border-white/10 bg-white/[0.03] hover:bg-white/5"
                      : "border-primary/30 bg-primary/10 hover:bg-primary/15"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-white">{notification.title}</p>
                      <p className="mt-1 text-xs leading-5 text-zinc-400">{notification.message}</p>
                    </div>
                    {!notification.isRead ? <span className="mt-1 h-2.5 w-2.5 rounded-full bg-primary" /> : null}
                  </div>
                  <p className="mt-2 text-[11px] uppercase tracking-[0.16em] text-zinc-500">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </button>
              ))
            )}
          </div>

          <div className="mt-4 border-t border-white/10 pt-3">
            <Link
              href="/admin/notifications"
              onClick={() => setOpen(false)}
              className="block text-center text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400 transition hover:text-white"
            >
              View all notifications
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
