import { useState, useRef, useCallback } from "react";
import { useChat } from "../../chat/useChat";
import { SendIcon } from "../Icons";

const MAX_CHARS      = 2000;
const TYPING_DEBOUNCE = 2500;

function MessageInput({ disabled }) {
  const { sendMessage, sendTypingStart, sendTypingStop, isSending } = useChat();
  const [text, setText]   = useState("");
  const typingTimer        = useRef(null);
  const isTypingRef        = useRef(false);
  const textareaRef        = useRef(null);

  const remaining = MAX_CHARS - text.length;
  const canSend   = text.trim().length > 0 && !isSending && !disabled && text.length <= MAX_CHARS;

  const onType = useCallback(() => {
    if (!isTypingRef.current) {
      isTypingRef.current = true;
      sendTypingStart();
    }
    clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => {
      isTypingRef.current = false;
      sendTypingStop();
    }, TYPING_DEBOUNCE);
  }, [sendTypingStart, sendTypingStop]);

  const stopTyping = useCallback(() => {
    clearTimeout(typingTimer.current);
    if (isTypingRef.current) {
      isTypingRef.current = false;
      sendTypingStop();
    }
  }, [sendTypingStop]);

  const handleSend = useCallback(async () => {
    if (!canSend) return;
    stopTyping();
    const success = await sendMessage(text);
    if (success) {
      setText("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
      textareaRef.current?.focus();
    }
  }, [canSend, text, sendMessage, stopTyping]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (e) => {
    const val = e.target.value;
    if (val.length > MAX_CHARS) return;
    setText(val);
    onType();
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = "auto";
      ta.style.height = `${Math.min(ta.scrollHeight, 110)}px`;
    }
  };

  return (
    <div className="chat-input-bar">
      <div className="chat-input-wrap">
        <textarea
          ref={textareaRef}
          className="chat-textarea"
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onBlur={stopTyping}
          placeholder="Type a message… (Enter to send)"
          rows={1}
          disabled={disabled || isSending}
          aria-label="Message input"
          maxLength={MAX_CHARS}
        />
        {remaining < 200 && (
          <span className={`chat-char-count ${remaining < 50 ? "chat-char-count--warn" : ""}`}>
            {remaining}
          </span>
        )}
      </div>

      <button
        type="button"
        className="chat-send-btn"
        onClick={handleSend}
        disabled={!canSend}
        aria-label="Send message"
      >
        {isSending ? (
          <span className="btn-spinner btn-spinner--sm" aria-hidden="true" />
        ) : (
          <SendIcon />
        )}
      </button>
    </div>
  );
}

export default MessageInput;