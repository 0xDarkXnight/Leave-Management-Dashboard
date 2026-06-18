import { useChat } from "../../chat/useChat";

function ChatHeader({ conversation, onBack }) {
  const { presenceMap, typingMap } = useChat();

  if (!conversation) {
    return (
      <div className="chat-header chat-header--empty">
        <span className="chat-header-placeholder">Select a conversation</span>
      </div>
    );
  }

  const other        = conversation.otherUser;
  const presence     = presenceMap[other?.id] ?? "offline";
  const isOnline     = presence === "online";
  const isTyping     = typingMap[conversation.id] === other?.id;

  return (
    <div className="chat-header">
      <button
        type="button"
        className="chat-back-btn"
        onClick={onBack}
        aria-label="Back to conversations"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
      </button>

      <div className={`chat-header-avatar${other?.role === "Manager" ? " chat-header-avatar--mgr" : ""}`}
        aria-hidden="true">
        {other?.initials ?? "?"}
      </div>

      <div className="chat-header-info">
        <div className="chat-header-name">{other?.name ?? "Unknown"}</div>
        <div className="chat-header-status">
          <span className={`presence-dot-sm ${isOnline ? "presence-dot-sm--online" : "presence-dot-sm--offline"}`} />
          {isTyping ? (
            <span className="chat-typing-text">typing…</span>
          ) : (
            <span className={`chat-status-text ${isOnline ? "chat-status-text--online" : ""}`}>
              {isOnline ? "Online" : "Offline"}
            </span>
          )}
        </div>
      </div>

      <div className="chat-header-role-tag">
        {other?.role ?? ""}
      </div>
    </div>
  );
}

export default ChatHeader;