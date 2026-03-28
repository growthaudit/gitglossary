import Anthropic from "@anthropic-ai/sdk";
import { getStandardRules, StandardId } from "./standards";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const MAX_DIFF_CHARS = 8000;

interface GenerateOptions {
  diff: string;
  standard: StandardId;
  customRules?: string;
  ticketNumber?: string;
}

export async function generateCommitMessage(options: GenerateOptions): Promise<string> {
  const { diff, standard, customRules, ticketNumber } = options;

  const rules = getStandardRules(standard, customRules, ticketNumber);

  let processedDiff = diff;
  if (diff.length > MAX_DIFF_CHARS) {
    processedDiff = diff.slice(0, MAX_DIFF_CHARS) + "\n\n[diff truncated — too large to display fully]";
  }

  const systemPrompt = `You are an expert at writing git commit messages. You will be given a git diff and a commit message standard. Your job is to write the perfect commit message following that standard exactly.

Rules:
- Return ONLY the commit message. No explanation. No preamble. No markdown formatting.
- Follow the standard's format precisely
- Subject line must be in imperative mood ("Add feature" not "Added feature")
- Never exceed the character limit for the subject line
- If the diff contains multiple logical changes, focus on the primary change
- Be specific, not generic. "Fix null pointer in UserService.authenticate()" not "Fix bug"

Standard: ${rules}`;

  const message = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 512,
    system: systemPrompt,
    messages: [
      {
        role: "user",
        content: `Diff:\n${processedDiff}`,
      },
    ],
  });

  const content = message.content[0];
  if (content.type !== "text") {
    throw new Error("Unexpected response type from Claude");
  }

  return content.text.trim();
}
