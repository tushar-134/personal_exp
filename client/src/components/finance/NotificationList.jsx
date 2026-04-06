import EmptyState from "../EmptyState";
import { formatDate } from "../../utils/format";

const NotificationList = ({ notifications, onMarkAsRead, emptyTitle, emptyDescription }) => {
  if (!notifications?.length) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="stack-list">
      {notifications.map((notification) => (
        <article
          key={notification._id}
          className={`notification-card ${notification.isRead ? "read" : ""}`}
        >
          <div className="notification-head">
            <strong>{notification.title}</strong>
            {!notification.isRead ? (
              <button
                type="button"
                className="ghost-button"
                onClick={() => onMarkAsRead(notification._id)}
              >
                Mark read
              </button>
            ) : null}
          </div>
          <p>{notification.message}</p>
          <span className="muted">{formatDate(notification.createdAt)}</span>
        </article>
      ))}
    </div>
  );
};

export default NotificationList;
