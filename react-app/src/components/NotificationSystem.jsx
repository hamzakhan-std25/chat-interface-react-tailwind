import Notification from "./Notification";

export default function NotificationSystem({notifications , setNotifications}) {
  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div>
      {/* Notifications */}
      {notifications.map((n, i) => (
        <Notification
          key={n.id}
          id={n.id}
          message={n.message}
          index={i}
          remove={removeNotification}
        />
      ))}


    </div>
  );
}
