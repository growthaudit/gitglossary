"use client";

const PLACEHOLDER = `diff --git a/src/auth/session.ts b/src/auth/session.ts
index 4f2a1c9..8b3e72d 100644
--- a/src/auth/session.ts
+++ b/src/auth/session.ts
@@ -12,8 +12,14 @@ export async function validateSession(token: string) {
-  const user = await db.users.findOne({ token });
-  if (!user) return null;
-  return user;
+  if (!token || token.length < 32) return null;
+  const user = await db.users.findOne({ token });
+  if (!user || user.expiresAt < Date.now()) {
+    await db.sessions.delete({ token });
+    return null;
+  }
+  user.lastSeen = Date.now();
+  await db.users.update(user);
+  return user;
 }`;

interface DiffInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export default function DiffInput({ value, onChange, disabled }: DiffInputProps) {
  const charCount = value.length;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-mono text-text-muted uppercase tracking-widest">
          Git diff
        </label>
        {charCount > 0 && (
          <span className={`text-xs font-mono ${charCount > 8000 ? "text-error" : "text-text-faint"}`}>
            {charCount > 8000 ? `${charCount.toLocaleString()} chars (will be truncated)` : `${charCount.toLocaleString()} chars`}
          </span>
        )}
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder={PLACEHOLDER}
        rows={14}
        className="w-full bg-surface border border-border rounded-lg p-4 font-mono text-sm text-text-primary placeholder:text-text-faint resize-y focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors leading-relaxed"
        spellCheck={false}
        autoCorrect="off"
        autoCapitalize="off"
      />
    </div>
  );
}
