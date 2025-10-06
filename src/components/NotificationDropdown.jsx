import { useState, useEffect, useRef } from "react";
import { Bell, X, CheckCheck, Trash2 } from "lucide-react";

// STORES
import useNotificationStore from "../utils/store/useNotificationStore";
import usePartnerStore from "../utils/store/usePartnerStore";
import useContainerStore from "../utils/store/useContainerStore";
import useBookingStore from "../utils/store/useBookingStore";
import useShipStore from "../utils/store/useShipStore";
import useTruckStore from "../utils/store/useTruckStore";

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const {
    notifications,
    unreadCount,
    isLoading,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotificationStore();

  const { partners } = usePartnerStore();
  const { containers } = useContainerStore();
  const { bookings } = useBookingStore();
  const { ships } = useShipStore();
  const { trucks } = useTruckStore();

  useEffect(() => {
    fetchUnreadCount();
  }, [fetchUnreadCount]);

  useEffect(() => {
    if (isOpen) fetchNotifications();
  }, [isOpen, fetchNotifications]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [fetchUnreadCount]);

  useEffect(() => {
    fetchUnreadCount();
  }, [partners, containers, bookings, ships, trucks]);

  const handleNotificationClick = (notification) => {
    if (!notification.is_read) markAsRead(notification.id);
    setIsOpen(false);
  };

  // 🕒 Time formatter (blue bottom-right)
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffSec = Math.floor((now - date) / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);

    if (diffSec < 60) return "just now";
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHr < 24) return `${diffHr}h ago`;
    return `${diffDay}d ago`;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* 🔔 Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-white hover:bg-blue-700 rounded-lg transition-colors"
      >
        <Bell className="w-6 h-6 sm:w-7 sm:h-7" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[1.25rem] h-5 flex items-center justify-center px-1">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* 📝 Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-[80vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-3 border-b border-gray-200">
            <h3 className="font-semibold text-gray-800 text-sm sm:text-base">
              Notifications
            </h3>
            <div className="flex gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                  title="Mark all as read"
                >
                  <CheckCheck className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-gray-500 hover:bg-gray-100 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="overflow-y-auto flex-1">
            {isLoading ? (
              <div className="p-4 text-center text-gray-500 text-sm">
                Loading...
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500 text-sm">
                No notifications
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => handleNotificationClick(n)}
                  className={`px-3 py-2 sm:px-4 sm:py-2.5 border-b border-gray-100 cursor-pointer transition-colors ${
                    !n.is_read ? "bg-blue-50" : "hover:bg-gray-50"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1 pr-2">
                      <h4 className="font-semibold text-gray-900 text-sm line-clamp-1">
                        {n.title}
                      </h4>
                      <p
                        className="text-gray-700 text-xs sm:text-sm mt-0.5 line-clamp-2"
                        dangerouslySetInnerHTML={{ __html: n.message }}
                      />
                      <div className="flex justify-end mt-0.5">
                        <span className="text-[11px] sm:text-xs text-blue-500">
                          {formatTime(n.created_at)}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(n.id);
                      }}
                      className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded ml-1"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-2 sm:p-3 border-t border-gray-200 text-center">
              <button
                onClick={() => console.log("TODO: navigate to notifications page")}
                className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                View all notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
