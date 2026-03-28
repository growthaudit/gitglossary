"use client";

import { STANDARDS, StandardId } from "@/lib/standards";

interface StandardSelectorProps {
  value: StandardId;
  onChange: (value: StandardId) => void;
  ticketNumber?: string;
  onTicketChange?: (value: string) => void;
  customRules?: string;
  onCustomRulesChange?: (value: string) => void;
  disabled?: boolean;
}

export default function StandardSelector({
  value,
  onChange,
  ticketNumber,
  onTicketChange,
  customRules,
  onCustomRulesChange,
  disabled,
}: StandardSelectorProps) {
  const selected = STANDARDS[value];

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2">
        <label className="text-xs font-mono text-text-muted uppercase tracking-widest">
          Standard
        </label>
        <div className="relative">
          <select
            value={value}
            onChange={(e) => onChange(e.target.value as StandardId)}
            disabled={disabled}
            className="w-full appearance-none bg-surface border border-border rounded-lg px-4 py-3 font-mono text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            {Object.values(STANDARDS).map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-text-muted">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
        {selected && (
          <p className="text-xs text-text-muted font-mono">{selected.description}</p>
        )}
      </div>

      {value === "jira" && onTicketChange && (
        <div className="flex flex-col gap-2">
          <label className="text-xs font-mono text-text-muted uppercase tracking-widest">
            Ticket number
          </label>
          <input
            type="text"
            value={ticketNumber ?? ""}
            onChange={(e) => onTicketChange(e.target.value)}
            disabled={disabled}
            placeholder="APP-1234"
            className="w-full bg-surface border border-border rounded-lg px-4 py-3 font-mono text-sm text-text-primary placeholder:text-text-faint focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/50 disabled:opacity-50 transition-colors"
          />
        </div>
      )}

      {value === "custom" && onCustomRulesChange && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-mono text-text-muted uppercase tracking-widest">
              Your rules
            </label>
            <span className={`text-xs font-mono ${(customRules?.length ?? 0) > 450 ? "text-accent" : "text-text-faint"}`}>
              {customRules?.length ?? 0}/500
            </span>
          </div>
          <textarea
            value={customRules ?? ""}
            onChange={(e) => onCustomRulesChange(e.target.value.slice(0, 500))}
            disabled={disabled}
            placeholder="e.g. Format: [type] description&#10;Types: feat, fix, chore&#10;Max 80 chars"
            rows={4}
            className="w-full bg-surface border border-border rounded-lg px-4 py-3 font-mono text-sm text-text-primary placeholder:text-text-faint resize-none focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/50 disabled:opacity-50 transition-colors leading-relaxed"
          />
        </div>
      )}
    </div>
  );
}
