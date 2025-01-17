import { call, MapRecResult } from "@/modules/agentic";
import { randomUUID } from "crypto";
import type { NextApiRequest, NextApiResponse } from "next";

type SuccessResponse = MapRecResult;

type ErrorResponse = {
  message: string;
}
type ResponseData = SuccessResponse | ErrorResponse;

function getSessionId(req: NextApiRequest, res: NextApiResponse): string {
  let sessionId: string | undefined = req.cookies["session"];

  if (typeof sessionId === "string") {
    return sessionId;
  }

  // Assign a new session
  sessionId = randomUUID();
  res.setHeader("Set-Cookie", `session=${sessionId}`);

  return sessionId;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method === "POST") {
    const body = JSON.parse(req.body);
    const message = body.message;

    // Get or assign the Session ID
    const sessionId = getSessionId(req, res);

    try {
      const result = await call(message, sessionId);
      res.status(201).json(preProcessResult(result));
    } catch (e: any) {
      console.error("having an error at catch 500 chat", e);
      res.status(500).json({
        message: `I'm suffering from brain fog...\n\n${e.message}`,
      });
    }
  } else {
    res.status(404).send({ message: "Route not found" });
  }
}

function preProcessResult(input: MapRecResult): MapRecResult {
  const { content: originalContent } = input; 

  // remove end marker from the content
  const content = originalContent.replace(/FINAL ANSWER/g, '').trim();

  return { ...input, content, mapData: input.mapData };
}