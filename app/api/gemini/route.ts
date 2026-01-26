
// option 1: (cloud gemini)

import { GoogleGenerativeAI } from "@google/generative-ai";
import { getServerSession } from "@/lib/auth";

const genAI = new GoogleGenerativeAI(process.env.API_KEY!);

export async function POST(req: Request) {
  const session = await getServerSession();

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { message } = await req.json();
  const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });
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


// option 2: (local ollama)
/*
import axios from "axios";
import { getServerSession } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getServerSession();

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { message } = await req.json();

  const LLM_BASE_URL = process.env.LLM_BASE_URL;
  const LLM_MODEL = process.env.LLM_MODEL;

  try {
    const response = await axios.post(
      `${LLM_BASE_URL}/api/chat`,
      {
        model: LLM_MODEL,
        messages: [{ role: "user", content: message }],
        stream: true,
      },
      {
        responseType: "stream",
        headers: { "Content-Type": "application/json" },
      }
    );

    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const stream = new ReadableStream({
      async start(controller) {
        response.data.on("data", (chunk: Buffer) => {
          const chunkStr = decoder.decode(chunk, { stream: true });
          const lines = chunkStr.split("\n").filter((line) => line.trim());

          for (const line of lines) {
            try {
              const json = JSON.parse(line);
              if (json.message?.content) {
                controller.enqueue(encoder.encode(json.message.content));
              }
            } catch (e) {
              console.error("Error parsing LLM chunk:", e);
            }
          }
        });

        response.data.on("end", () => {
          controller.close();
        });

        response.data.on("error", (err: Error) => {
          console.error("Stream error:", err);
          controller.error(err);
        });
      },
    });

    return new Response(stream, {
      headers: { "Content-Type": "text/plain" },
    });
  } catch (error) {
    console.error("LLM API error:", error);
    return new Response("LLM API error", { status: 500 });
  }
}
*/