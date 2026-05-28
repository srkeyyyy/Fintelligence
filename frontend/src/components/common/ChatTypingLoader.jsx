function ChatTypingLoader() {
  return (
    <div className="inline-flex items-center gap-2 rounded-lg bg-white/[0.06] px-4 py-3" aria-label="MonAI is typing">
      <span className="h-2 w-2 rounded-full bg-teal-300 chat-dot" />
      <span className="h-2 w-2 rounded-full bg-teal-300 chat-dot [animation-delay:140ms]" />
      <span className="h-2 w-2 rounded-full bg-teal-300 chat-dot [animation-delay:280ms]" />
    </div>
  );
}

export default ChatTypingLoader;
