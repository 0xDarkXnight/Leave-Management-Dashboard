import { useEffect, useRef, useCallback } from "react";
import { useAuth }      from "../../auth/useAuth";
import { useChat }      from "../../chat/useChat";
import ChatHeader       from "./ChatHeader";
import MessageBubble, { DateSeparator } from "./MessageBubble";
import MessageInput     from "./MessageInput";

const isSameDay = (iso1, iso2) =>
  new Date(iso1).toDateString() === new Date(iso2).toDateString();

const TWO_MINUTES = 2 * 60 * 1000;

const isGroupedWith = (msg, prev) => {
  if (!prev) return false;
  if (msg.senderId !== prev.senderId) return false;
  return new Date(msg.timestamp) - new Date(prev.timestamp) < TWO_MINUTES;
};

function TypingIndicator({ senderName }) {
  return (
    <div className="typing-row" aria-live="polite" aria-label={`${senderName} is typing`}>
      <div className="typing-avatar" aria-hidden="true">
        {senderName?.charAt(0)?.toUpperCase() ?? "?"}
      </div>
      <div className="typing-bubble">
        <span className="typing-dot" style={{ animationDelay: "0ms" }} />
        <span className="typing-dot" style={{ animationDelay: "160ms" }} />
        <span className="typing-dot" style={{ animationDelay: "320ms" }} />
      </div>
    </div>
  );
}

function EmptyConversation({ otherName }) {
  return (
    <div className="chat-empty">
      <div className="chat-empty-icon">💬</div>
      <h4>Start the conversation</h4>
      <p>Send a message to {otherName ?? "them"} to get started.</p>
    </div>
  );
}

function LoadingMessages() {
  return (
    <div className="chat-messages-area">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className={`msg-skeleton-row ${i % 3 === 0 ? "msg-skeleton-row--sent" : ""}`}
          aria-hidden="true"
        >
          {i % 3 !== 0 && <div className="skeleton-msg-avatar" />}
          <div className={`skeleton-bubble ${i % 3 === 0 ? "skeleton-bubble--sent" : ""}`}
            style={{ width: `${140 + (i * 23) % 80}px` }} />
        </div>
      ))}
    </div>
  );
}

function ChatWindow({ conversation, onBack }) {
  const { user }                                 = useAuth();
  const { messages, typingMap, isLoadingMessages } = useChat();

  const convId   = conversation?.id;
  const other    = conversation?.otherUser;
  const convMsgs = (convId ? messages[convId] : null) ?? [];

  const isTyping       = typingMap[convId] === other?.id;
  const messagesEndRef = useRef(null);
  const scrollRef      = useRef(null);
  const atBottomRef = useRef(true);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const threshold = 80;
    atBottomRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < threshold;
  }, []);

  useEffect(() => {
    if (atBottomRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [convMsgs.length, isTyping]);

  useEffect(() => {
    atBottomRef.current = true;
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "instant" });
    }, 50);
  }, [convId]);

  if (!conversation) {
    return (
      <div className="chat-window chat-window--placeholder">
        <div className="chat-select-prompt">
          <div className="chat-select-icon">💬</div>
          <h3>Your Messages</h3>
          <p>Select a conversation from the left to get started.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-window">
      <ChatHeader conversation={conversation} onBack={onBack} />

      {isLoadingMessages ? (
        <LoadingMessages />
      ) : (
        <div
          className="chat-messages-area"
          ref={scrollRef}
          onScroll={handleScroll}
          aria-live="polite"
          aria-label="Conversation messages"
        >
          {convMsgs.length === 0 ? (
            <EmptyConversation otherName={other?.name} />
          ) : (
            convMsgs.map((msg, idx) => {
              const prev       = convMsgs[idx - 1];
              const next       = convMsgs[idx + 1];
              const grouped    = isGroupedWith(msg, prev);
              const showDate   = !prev || !isSameDay(msg.timestamp, prev.timestamp);
              const isSent     = msg.senderId === user?.id;
              const isLastSent = isSent && (!next || next.senderId !== user?.id || idx === convMsgs.length - 1);

              return (
                <div key={msg.id}>
                  {showDate && <DateSeparator timestamp={msg.timestamp} />}
                  <MessageBubble
                    message={msg}
                    isSent={isSent}
                    isGrouped={grouped}
                    showReadReceipt={isLastSent}
                    otherUserId={other?.id}
                  />
                </div>
              );
            })
          )}

          {isTyping && other && (
            <TypingIndicator senderName={other.name} />
          )}

          <div ref={messagesEndRef} />
        </div>
      )}

      <MessageInput disabled={!convId} />
    </div>
  );
}

export default ChatWindow;