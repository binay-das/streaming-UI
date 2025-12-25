import { GoogleGenerativeAI } from "@google/generative-ai";

// option 1: (cloud gemini)
/*
const genAI = new GoogleGenerativeAI(process.env.API_KEY!);

export async function POST(req: Request) {
  const { message } = await req.json();
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  const result = await model.generateContentStream(message);

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      for await (const chunk of result.stream) {
        const text = chunk.text();
        controller.enqueue(encoder.encode(text));
      }
      controller.close();
    }
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/plain" },
  });
}
*/

// option 2: (local)

export async function POST(req: Request) {
  const { message } = await req.json();

  const response = await fetch("http://localhost:11434/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "llama3.2",
      messages: [{ role: "user", content: message }],
      stream: true,
    }),
  });

  if (!response.ok) {
    return new Response("Ollama error", { status: 500 });
  }

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  const reader = response.body?.getReader();

  const stream = new ReadableStream({
    async start(controller) {
      if (!reader) {
        controller.close();
        return;
      }

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n").filter((line) => line.trim());

        for (const line of lines) {
          try {
            const json = JSON.parse(line);
            if (json.message?.content) {
              controller.enqueue(encoder.encode(json.message.content));
            }
          } catch (e) {
            console.error("Error parsing Ollama chunk:", e);
          }
        }
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/plain" },
  });
}
