import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

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
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
