import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { APP_NAME, APP_ORG } from "@/lib/ledger";
import { isSixDigit } from "@/lib/session";
import { cn } from "@/lib/utils";

export function PinGate({
  onUnlock,
  error,
  busy,
  warping,
}: {
  onUnlock: (pin: string) => void;
  error: string | null;
  busy: boolean;
  warping?: boolean;
}) {
  const [pin, setPin] = useState("");
  const locked = busy || Boolean(warping);

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!isSixDigit(pin) || locked) return;
    onUnlock(pin);
  }

  return (
    <main
      className={cn("relative isolate min-h-dvh overflow-hidden bg-background text-foreground", warping && "landing-warp")}
      aria-busy={locked}
    >
      <div className="landing-veil" aria-hidden />
      <div className="landing-portal" aria-hidden />
      <div className="relative flex min-h-dvh items-center justify-center px-5 py-12">
        <div className="landing-panel w-full max-w-sm rounded-xl border border-border bg-card px-6 py-8 text-foreground shadow-[var(--shadow-border)]">
          <div className="flex flex-col items-center text-center">
            <img
              src="/keizaal-mark.png"
              alt=""
              width={64}
              height={64}
              draggable={false}
              className="size-16 select-none"
            />
            <h1 className="mt-3 font-display text-3xl font-semibold leading-snug tracking-tight text-foreground">
              {APP_NAME}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">{APP_ORG}</p>
          </div>
          <form className="mt-6 space-y-4 border-t border-border pt-6" onSubmit={submit} autoComplete="off">
            <label className="block space-y-2">
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">PIN</span>
              <Input
                name="collegium-access-pin"
                type="password"
                inputMode="numeric"
                autoComplete="new-password"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
                maxLength={6}
                pattern="\d{6}"
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder=""
                aria-label="PIN"
                suppressHydrationWarning
                disabled={locked}
              />
            </label>
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
            <Button type="submit" className="w-full" disabled={!isSixDigit(pin) || locked}>
              {warping ? "Opening" : busy ? "Opening" : "Open"}
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}
