import { useChat }  from "../../chat/useChat";
import { useAuth }  from "../../auth/useAuth";
import { ChatIcon } from "../Icons";

const fmtRelTime = (iso) => {
  if (!iso) return "";
  const diff   = Date.now() - new Date(iso).getTime();
  const mins   = Math.floor(diff / 60_000);
  const hours  = Math.floor(diff / 3_600_000);
  const days   = Math.floor(diff / 86_400_000);
  if (mins  <  1) return "just now";
  if (mins  < 60) return `${mins}m`;
  if (hours < 24) return `${hours}h`;
  return `${days}d`;
};

function PresenceDot({ status }) {
  return (
    <span
      className={`presence-dot ${status === "online" ? "presence-dot--online" : "presence-dot--offline"}`}
      aria-label={status === "online" ? "Online" : "Offline"}
      title={status === "online" ? "Online" : "Offline"}
    />
  );
}

function ConversationItem({ conversation, isActive, onSelect }) {
  const { presenceMap } = useChat();
  const { user }        = useAuth();
  const other           = conversation.otherUser;
  const presence        = presenceMap[other?.id] ?? "offline";
  const lastMsg         = conversation.lastMessage;

  const previewText = lastMsg
    ? lastMsg.senderId === user?.id
      ? `You: ${lastMsg.text}`
      : lastMsg.text
    : "No messages yet";

  return (
    <button
      type="button"
      className={`conv-item${isActive ? " conv-item--active" : ""}`}
      onClick={() => onSelect(conversation.id)}
      aria-current={isActive ? "true" : undefined}
      aria-label={`Chat with ${other?.name ?? "Unknown"}`}
    >
      <div className="conv-avatar-wrap">
        <div className={`conv-avatar${other?.role === "Manager" ? " conv-avatar--mgr" : ""}`}>
          {other?.initials ?? "?"}
        </div>
        <PresenceDot status={presence} />
      </div>

      <div className="conv-body">
        <div className="conv-row-top">
          <span className="conv-name">{other?.name ?? "Unknown"}</span>
          <span className="conv-time">{fmtRelTime(lastMsg?.timestamp)}</span>
        </div>
        <div className="conv-row-bottom">
          <span className="conv-preview">
            {previewText}
          </span>
          {conversation.unreadCount > 0 && (
            <span className="conv-unread-badge" aria-label={`${conversation.unreadCount} unread`}>
              {conversation.unreadCount > 9 ? "9+" : conversation.unreadCount}
            </span>
          )}
        </div>
        <span className="conv-role-tag">{other?.role ?? ""}</span>
      </div>
    </button>
  );
}

function ConversationList({ onSelect }) {
  const {
    conversations,
    activeConversationId,
    isLoadingConversations,
    convError,
    loadConversations,
  } = useChat();

  const sorted = [...conversations].sort((a, b) => {
    if (a.unreadCount && !b.unreadCount) return -1;
    if (!a.unreadCount && b.unreadCount) return 1;
    const ta = a.lastMessage?.timestamp ?? "0";
    const tb = b.lastMessage?.timestamp ?? "0";
    return tb.localeCompare(ta);
  });

  if (isLoadingConversations) {
    return (
      <div className="conv-list-body">
        {[1, 2].map((i) => (
          <div key={i} className="conv-item-skeleton" aria-hidden="true">
            <div className="skeleton-avatar" />
            <div className="skeleton-lines">
              <div className="skeleton-line skeleton-line--wide" />
              <div className="skeleton-line skeleton-line--narrow" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (convError) {
    return (
      <div className="conv-list-error">
        <p>{convError}</p>
        <button type="button" className="btn-secondary btn-sm" onClick={loadConversations}>
          Retry
        </button>
      </div>
    );
  }

  if (sorted.length === 0) {
    return (
      <div className="conv-list-empty">
        <div className="conv-empty-icon"><ChatIcon /></div>
        <p>No conversations yet</p>
      </div>
    );
  }

  return (
    <div className="conv-list-body">
      {sorted.map((conv) => (
        <ConversationItem
          key={conv.id}
          conversation={conv}
          isActive={conv.id === activeConversationId}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}

export default ConversationList;