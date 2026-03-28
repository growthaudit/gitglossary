export type StandardId = "conventional" | "angular" | "emoji" | "jira" | "simple" | "custom";

export interface Standard {
  id: StandardId;
  name: string;
  description: string;
  rules: string;
  example: string;
  requiresTicket?: boolean;
}

export const STANDARDS: Record<StandardId, Standard> = {
  conventional: {
    id: "conventional",
    name: "Conventional Commits",
    description: "type(scope): description — industry standard",
    rules: `Format: type(scope): description

Types:
- feat: A new feature
- fix: A bug fix
- docs: Documentation changes only
- style: Formatting, missing semicolons, etc — no code change
- refactor: Code change that neither fixes a bug nor adds a feature
- perf: Code change that improves performance
- test: Adding or correcting tests
- chore: Build process, tooling, or dependency updates

Rules:
- Subject line: imperative mood, lowercase after the type, no period at end
- Maximum 72 characters for the subject line
- Scope is optional but should be a noun describing the section of codebase (e.g. auth, api, ui)
- Body is optional — use it to explain WHY, not what. Blank line between subject and body.
- Breaking changes: append "!" after type/scope, and add "BREAKING CHANGE:" footer`,
    example: "feat(auth): add OAuth2 login with Google\n\nAllows users to sign in with their Google account.\nRemoves the need to manage passwords for OAuth users.",
  },
  angular: {
    id: "angular",
    name: "Angular Style",
    description: "Strict Conventional Commits with required scope",
    rules: `Format: type(scope): description

Identical to Conventional Commits but with these stricter rules:
- Scope is REQUIRED (not optional)
- Breaking changes must appear in the footer: "BREAKING CHANGE: <description>"
- Breaking changes also require "!" after type/scope in the header
- Revert commits must start with: "revert: " and the body must contain "This reverts commit <hash>"
- Footer format: "token: value" (e.g. "Fixes #123", "Reviewed-by: Jane")

Types: feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert`,
    example: "feat(user-auth): add two-factor authentication\n\nBREAKING CHANGE: auth flow now requires email verification\nbefore the first login.",
  },
  emoji: {
    id: "emoji",
    name: "Emoji Prefix",
    description: "✨ Visual commit types with emoji prefix",
    rules: `Format: <emoji> <description>

Emoji map:
- ✨ New feature
- 🐛 Bug fix
- 📚 Documentation
- 💄 UI/style changes
- ♻️ Refactoring
- ⚡ Performance improvement
- ✅ Tests
- 🔧 Configuration/tooling
- 🚀 Deployment/release
- 🔒 Security fix
- 🗑️ Remove code or files
- 🔀 Merge branches

Rules:
- Plain English subject line following emoji
- Present tense, imperative mood
- Under 72 characters total (including emoji)
- No type prefix — the emoji IS the type
- Body optional, plain English`,
    example: "✨ Add user profile photo upload",
  },
  jira: {
    id: "jira",
    name: "Jira-Linked",
    description: "[PROJ-123] Ticket-referenced commits",
    rules: `Format: [TICKET-NUMBER] Short description

Rules:
- Ticket number is REQUIRED — it must appear at the start in square brackets
- Ticket format: uppercase project key, hyphen, number (e.g. APP-123, INFRA-456)
- Subject: imperative mood, under 72 characters including the ticket prefix
- Body (optional): should include a link to the Jira ticket and explain why
- If multiple tickets: use primary ticket in header, mention others in body`,
    example: "[APP-1234] Add password reset via email link\n\nImplements the forgot-password flow requested in APP-1234.\nRelated: APP-1189 (email service setup)",
    requiresTicket: true,
  },
  simple: {
    id: "simple",
    name: "Simple",
    description: "Clean, direct imperative sentence — no convention",
    rules: `Rules:
- Single clear sentence in imperative mood ("Add feature" not "Added feature")
- Present tense
- Under 72 characters
- No type prefix, no emoji, no ticket number
- Capitalize first word
- No period at end
- Be specific — name the thing you changed ("Fix null check in UserService" not "Fix bug")
- Body optional — plain prose explaining why if needed`,
    example: "Fix race condition in session token refresh",
  },
  custom: {
    id: "custom",
    name: "Custom",
    description: "Your own rules — define them below",
    rules: `Follow the custom rules provided exactly.
If no custom rules are provided, use sensible defaults:
- Imperative mood
- Under 72 characters
- Be specific and descriptive`,
    example: "Add feature per team standard",
  },
};

export function getStandardRules(
  standardId: StandardId,
  customRules?: string,
  ticketNumber?: string
): string {
  const standard = STANDARDS[standardId];
  if (!standard) return STANDARDS.simple.rules;

  let rules = standard.rules;

  if (standardId === "jira" && ticketNumber) {
    rules = `Ticket number for this commit: ${ticketNumber}\n\n${rules}`;
  }

  if (standardId === "custom" && customRules) {
    rules = `Custom team rules:\n${customRules}`;
  } else if (customRules) {
    rules = `${rules}\n\nAdditional team rules:\n${customRules}`;
  }

  return rules;
}
