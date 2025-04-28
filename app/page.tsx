"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { useTheme } from "@/components/theme/ThemeProvider";
import ThemeToggle from "@/components/theme/ThemeToggle";

export default function Home() {
  const [input, setInput] = useState("");
  const [streamedText, setStreamedText] = useState("");
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false); 

  useEffect(() => {
    setMounted(true); 

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
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
    setInput("");

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

  if (!mounted) return null; 

  return (
    <div
      className={`flex flex-col h-screen w-full grow max-w-5xl mx-auto px-4 ${
        theme === "dark" ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      <header className="flex items-center justify-between my-4 px-4">
        <h1 className="text-3xl font-bold">Streaming UI</h1>
        <ThemeToggle />
      </header>
      <div className="flex-1 overflow-hidden bg-background text-foreground">
        <ScrollArea className="h-full border rounded p-4">
          <div className="prose">
            <ReactMarkdown>{streamedText}</ReactMarkdown>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      <form
        onSubmit={handleSubmit}
        className="p-4 bg-background text-foreground"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="border border-gray-200 p-2 w-full rounded-md mb-2"
          placeholder="Ask something..."
        />
        <Button type="submit" className="w-full">
          Send
        </Button>
      </form>
    </div>
  );
}
