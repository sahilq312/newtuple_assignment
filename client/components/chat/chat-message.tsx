import React from "react";
import Markdown from "react-markdown";
import { User, Bot, Copy, Check } from "lucide-react";

export const ChatMessage = ({
  message,
  sender,
  timestamp,
}: {
  message: string;
  timestamp?: string;
  sender: "user" | "assistant";
}) => {
  const isUser = sender === "user";
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  return (
    <div
      className={`flex gap-4 ${isUser ? "flex-row-reverse" : "flex-row"} group`}
    >
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isUser
          ? "bg-primary text-primary-foreground"
          : "bg-muted text-muted-foreground"
          }`}
      >
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>

      {/* Message Content */}
      <div
        className={`flex-1 flex flex-col gap-1 ${isUser ? "items-end" : "items-start"
          }`}
      >
        <div
          className={`relative rounded-2xl px-4 py-3 max-w-[85%] ${isUser
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-foreground"
            }`}
        >
          {message === "" && !isUser ? (
            <div className="flex gap-1 h-5 items-center">
              <span className="w-1.5 h-1.5 bg-foreground/50 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
              <span className="w-1.5 h-1.5 bg-foreground/50 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
              <span className="w-1.5 h-1.5 bg-foreground/50 rounded-full animate-bounce"></span>
            </div>
          ) : (
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <Markdown
                components={{
                  p: ({ children }) => (
                    <p className="mb-2 last:mb-0">{children}</p>
                  ),
                  ul: ({ children }) => (
                    <ul className="mb-2 last:mb-0 pl-4">{children}</ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="mb-2 last:mb-0 pl-4">{children}</ol>
                  ),
                  code: ({ children }) => (
                    <code className="bg-black/10 dark:bg-white/10 px-1.5 py-0.5 rounded text-sm">
                      {children}
                    </code>
                  ),
                  pre: ({ children }) => (
                    <pre className="bg-black/10 dark:bg-white/10 p-3 rounded-lg overflow-x-auto mb-2 last:mb-0">
                      {children}
                    </pre>
                  ),
                }}
              >
                {message}
              </Markdown>
            </div>
          )}

          {/* Copy Button — Only for Bot Messages */}
          {!isUser && (
            <button
              onClick={handleCopy}
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground"
              aria-label="Copy response"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
            </button>
          )}
        </div>
        {timestamp && (
          <div
            className={`text-xs text-muted-foreground mt-1 ${isUser ? "text-right" : "text-left"
              }`}
          >
            {new Date(timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        )}
      </div>
    </div>
  );
};
