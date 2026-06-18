const fmtTime = (iso) => {
  if (!iso) return "";
  return new Date(iso).toLocaleTimeString("en-US", {
    hour:   "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const fmtDate = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  if (d.toDateString() === today.toDateString()) return "Today";
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
};

export function DateSeparator({ timestamp }) {
  return (
    <div className="date-separator" role="separator" aria-label={fmtDate(timestamp)}>
      <span>{fmtDate(timestamp)}</span>
    </div>
  );
}

function MessageBubble({ message, isSent, isGrouped, showReadReceipt, otherUserId }) {
  const isRead      = message.readBy?.includes(otherUserId);
  const isOptimistic = message.isOptimistic;

  return (
    <div
      className={`message-row ${isSent ? "message-row--sent" : "message-row--received"}${isGrouped ? " message-row--grouped" : ""}`}
    >
      {!isSent && (
        <div className="msg-avatar-slot">
          {!isGrouped && (
            <div className="msg-avatar" aria-hidden="true">
              {message.senderInitials ?? "?"}
            </div>
          )}
        </div>
      )}

      <div className="msg-content-col">
        {!isSent && !isGrouped && (
          <span className="msg-sender-name">{message.senderName}</span>
        )}

        <div
          className={`message-bubble ${isSent ? "message-bubble--sent" : "message-bubble--received"}${isOptimistic ? " message-bubble--sending" : ""}`}
        >
          <span className="msg-text">{message.text}</span>
        </div>

        <div className="msg-meta">
          <span className="msg-time">{fmtTime(message.timestamp)}</span>
          {isSent && showReadReceipt && (
            <span className={`msg-receipt ${isRead ? "msg-receipt--seen" : ""}`}>
              {isOptimistic ? "Sending…" : isRead ? "Seen" : "Sent"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default MessageBubble;