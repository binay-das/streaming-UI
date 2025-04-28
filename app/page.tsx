'use client';

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { useTheme } from "@/components/theme/ThemeProvider";

export default function Home() {
  const [input, setInput] = useState("");
  const [streamedText, setStreamedText] = useState("");
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
      setTheme(systemTheme); 
    }
  }, [theme, setTheme]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStreamedText("");

    const response = await fetch("/api/gemini", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input }),
    });

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const { value, done: readerDone } = await reader!.read();
      done = readerDone;
      const chunk = decoder.decode(value);
      setStreamedText((prev) => prev + chunk);
    }
  };

  return (
    <div
      className={`flex flex-col h-screen max-w-5xl mx-auto p-4 ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black"
      }`}
    >
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full border rounded p-4">
          <div className="prose">
            <ReactMarkdown>{streamedText}</ReactMarkdown>
          </div>
        </ScrollArea>
      </div>

      <form
        onSubmit={handleSubmit}
        className={`border-t p-4 ${
          theme === "dark" ? "bg-gray-800" : "bg-white"
        }`}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className={`border border-gray-300 p-2 w-full rounded mb-2 ${
            theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"
          }`}
          placeholder="Ask something..."
        />
        <Button type="submit" className="w-full">
          Send
        </Button>
      </form>
    </div>
  );
}
