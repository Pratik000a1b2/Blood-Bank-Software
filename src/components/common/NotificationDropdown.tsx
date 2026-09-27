import React, { useState, useRef, useEffect } from 'react';
import { Bell, Check, CheckCheck, Info, AlertTriangle, AlertCircle, CheckCircle2 } from 'lucide-react';
import { AppNotification } from '../../types';
import { bloodBankService } from '../../services/bloodBankService';

interface NotificationDropdownProps {
  notifications: AppNotification[];
  currentUserId: string;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  notifications,
  currentUserId,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const userNotifications = notifications.filter(
    (n) => n.userId === currentUserId || n.userId === 'all'
  );
  const unreadCount = userNotifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />;
      case 'alert':
        return <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />;
      default:
        return <Info className="w-4 h-4 text-blue-600 shrink-0" />;
    }
  };

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
        aria-label="View notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex items-center justify-center min-w-4 h-4 px-1 text-[10px] font-bold text-white bg-rose-600 rounded-full">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-900">Notifications</span>
              {unreadCount > 0 && (
                <span className="text-xs bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded-sm font-medium">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={() => bloodBankService.markAllNotificationsAsRead(currentUserId)}
                className="text-xs text-rose-600 hover:text-rose-700 font-medium flex items-center gap-1 cursor-pointer"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
            {userNotifications.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                No notifications yet.
              </div>
            ) : (
              userNotifications.map((notif) => (
                <div
                  key={notif.notificationId}
                  className={`p-3 transition-colors ${
                    notif.isRead ? 'bg-white hover:bg-slate-50' : 'bg-rose-50/40 hover:bg-rose-50/70'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <div className="mt-0.5">{getIcon(notif.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <p className={`text-xs font-semibold ${notif.isRead ? 'text-slate-800' : 'text-slate-950'}`}>
                          {notif.title}
                        </p>
                        <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                          {formatTime(notif.createdAt)}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5 line-clamp-2 leading-relaxed">
                        {notif.message}
                      </p>
                      {!notif.isRead && (
                        <button
                          onClick={() => bloodBankService.markNotificationAsRead(notif.notificationId)}
                          className="mt-1.5 text-[11px] text-rose-600 hover:text-rose-800 font-medium inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Check className="w-3 h-3" /> Mark as read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
