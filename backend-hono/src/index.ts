import { Hono } from "hono";
import { cors } from "hono/cors";

type Bindings = {
  [key in keyof CloudflareBindings]: CloudflareBindings[key];
};

const app = new Hono<{ Bindings: Bindings }>();

const r = cors({
  origin: "*",
  allowMethods: ["GET", "POST"],
});

app.use(r);

app.post("/", async (c) => {
  const form = await c.req.formData();
  const file = form.get("image") as File;

  if (!file) {
    return c.text("No file uploaded", 400);
  }

  const buffer = await file.arrayBuffer();
  const input = {
    image: [...new Uint8Array(buffer)],
    prompt:
      "You are an Instagram Influencer. Send me few captions for a post about the picture I sent you.",
    max_tokens: 512,
  };

  try {
    const response = await c.env.AI.run("@cf/llava-hf/llava-1.5-7b-hf", input);
    return new Response(JSON.stringify(response));
  } catch (error) {
    console.error("Error generating text:", error);
    return c.text("Error generating text", 500);
  }
});

export default app;
