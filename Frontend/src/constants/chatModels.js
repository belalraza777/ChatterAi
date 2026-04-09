// Keep frontend defaults here so backend never needs a fallback model.
export const GROQ_MODELS = [
  "llama-3.3-70b-versatile",
  "llama-3.1-8b-instant",
  "qwen/qwen3-32b",
  "openai/gpt-oss-20b",
  "openai/gpt-oss-120b",
  "moonshotai/kimi-k2-instruct",
  "moonshotai/kimi-k2-instruct-0905",
  "meta-llama/llama-4-scout-17b-16e-instruct"
];

export const DEFAULT_TEXT_MODEL = "llama-3.3-70b-versatile";
export const DEFAULT_IMAGE_MODEL = "meta-llama/llama-4-scout-17b-16e-instruct";
export const CHAT_IMAGE_MAX_MB = 10;
export const CHAT_IMAGE_MAX_BYTES = CHAT_IMAGE_MAX_MB * 1024 * 1024;
