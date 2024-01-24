import { OpenAIClient, AzureKeyCredential } from "@azure/openai";

import { API_KEY, LABS_ENDPOINT } from "./constants";

const openai = new OpenAIClient(
    LABS_ENDPOINT,
    new AzureKeyCredential(API_KEY)
);

export const runtime = "edge";

export async function POST(req: Request): Promise<Response> {
  try {
    const forwardedProps = await req.json();
    // @TODO this is from the copilotkit example but we're gonna probably need to redo this streamer.
    const stream = openai.beta.chat.completions
      .stream({
        model: "gpt-4-1106-preview",
        ...forwardedProps,
        stream: true,
      })
      .toReadableStream();

    return new Response(stream);
  } catch (error) {
    return new Response("", { status: 500, statusText: error.error.message });
  }
}
