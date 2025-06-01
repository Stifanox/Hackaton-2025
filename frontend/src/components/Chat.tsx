import React, { useEffect, useRef, useState } from "react";
import { IoChatboxEllipses } from "react-icons/io5";
import type { ChatMessage } from "../common/types/Chat";
import axios from "axios";
import type { ApiResponse } from "../common/requester/ApiResponse";

const Chat: React.FC = () => {
  const [isActive, setIsActive] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "system", content: "Jesteś pomocnym asystentem." },
  ]);

  const [inputValue, setInputValue] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    const newUserMsg: ChatMessage = { role: "user", content: trimmed };
    setMessages((prev) => [...prev, newUserMsg]);
    setInputValue("");
    setIsLoading(true);

    try {
      const payload = { message: trimmed };

      const response = await axios.post<ApiResponse<string>>(
        "http://localhost:9001/api/openai/get-response",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data && response.data.data) {
        const aiText = response.data.data;
        const aiMsg: ChatMessage = {
          role: "assistant",
          content: aiText,
        };
        setMessages((prev) => [...prev, aiMsg]);
      } else {
        const errorMsg: ChatMessage = {
          role: "assistant",
          content: "Przepraszam, nie uzyskałem odpowiedzi od serwera.",
        };
        setMessages((prev) => [...prev, errorMsg]);
      }
    } catch (err) {
      console.error("Błąd podczas wysyłania do backendu:", err);
      const errorMsg: ChatMessage = {
        role: "assistant",
        content: "Przepraszam, wystąpił błąd serwera.",
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        className="fixed right-6 bottom-6 w-14 h-14 bg-lime-400 rounded-full flex items-center justify-center shadow-lg z-50"
        onClick={() => setIsActive((prev) => !prev)}
      >
        <IoChatboxEllipses size={24} className="text-white" />
      </button>
      {isActive && (
        <div className="fixed right-6 bottom-24 w-80 max-h-[70vh] bg-white border border-gray-300 rounded-lg shadow-xl flex flex-col z-50">
          <div className="px-4 py-2 bg-lime-400 rounded-t-lg">
            <h3 className="text-white font-semibold">Chat AI</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {messages
              .filter((m) => m.role !== "system")
              .map((m, idx) => (
                <div
                  key={idx}
                  className={`px-3 py-2 rounded-xl max-w-[80%] ${
                    m.role === "user"
                      ? "bg-lime-100 self-end text-right"
                      : "bg-gray-100 self-start text-left"
                  }`}
                >
                  {m.content}
                </div>
              ))}
            <div ref={messagesEndRef} />
          </div>
          <form
            onSubmit={handleSubmit}
            className="px-3 py-2 border-t border-gray-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400"
              placeholder="Napisz wiadomość..."
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || inputValue.trim() === ""}
              className={`px-4 py-2 rounded-lg text-white font-medium ${
                isLoading || inputValue.trim() === ""
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-lime-400 hover:bg-lime-500"
              }`}
            >
              {isLoading ? "..." : "Wyślij"}
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default Chat;
