import { useEffect, useState } from "react";
import { useAuth }             from "../auth/useAuth";
import { useChat }             from "../chat/useChat";
import ConversationList        from "../components/chat/ConversationList";
import ChatWindow              from "../components/chat/ChatWindow";

function ChatPage() {
  const { user }                               = useAuth();
  const { conversations, openConversation, activeConversationId } = useChat();

  const [mobileShowChat, setMobileShowChat] = useState(false);

  useEffect(() => {
    if (
      user?.role === "Employee" &&
      conversations.length === 1 &&
      !activeConversationId
    ) {
      openConversation(conversations[0].id);
    }
  }, [user, conversations, activeConversationId, openConversation]);

  const handleSelectConversation = (convId) => {
    openConversation(convId);
    setMobileShowChat(true);
  };

  const handleBackToList = () => {
    setMobileShowChat(false);
  };

  const activeConversation =
    conversations.find((c) => c.id === activeConversationId) ?? null;

  return (
    <section className="page chat-page">
      <div className="page-header">
        <div className="page-header-left">
          <h1>Messages</h1>
          <p>
            {user?.role === "Manager"
              ? "Chat directly with your team members."
              : `Chat with your manager, ${
                  conversations[0]?.otherUser?.name ?? "—"
                }.`}
          </p>
        </div>
      </div>

      <div className={`chat-layout${mobileShowChat ? " chat-layout--mobile-chat" : ""}`}>
        <div className="chat-panel-left">
          <div className="chat-panel-header">
            <span className="chat-panel-title">Conversations</span>
          </div>
          <ConversationList onSelect={handleSelectConversation} />
        </div>

        <div className="chat-panel-right">
          <ChatWindow
            conversation={activeConversation}
            onBack={handleBackToList}
          />
        </div>
      </div>
    </section>
  );
}

export default ChatPage;