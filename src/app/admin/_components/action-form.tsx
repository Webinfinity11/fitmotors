"use client";

import {
  type ComponentProps,
  type ReactNode,
  createContext,
  startTransition,
  use,
  useActionState,
  useEffect,
  useRef,
  useState,
} from "react";
import type { ActionState } from "@/lib/action-state";

const PendingContext = createContext(false);

type ActionFormProps = {
  action: (state: ActionState, form: FormData) => Promise<ActionState>;
  children: ReactNode;
  className?: string;
  resetOnSuccess?: boolean;
};

// onSubmit-ით ვაგზავნით, რადგან React ფორმას action-ის შემდეგ ასუფთავებს
// და შეცდომისას შეყვანილი ტექსტი დაიკარგებოდა.
export function ActionForm({ action, children, className, resetOnSuccess }: ActionFormProps) {
  const [state, dispatch, pending] = useActionState(action, {});
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok && resetOnSuccess) formRef.current?.reset();
  }, [state, resetOnSuccess]);

  return (
    <form
      ref={formRef}
      className={className}
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        startTransition(() => dispatch(data));
      }}
    >
      <PendingContext value={pending}>{children}</PendingContext>
      {state.error && (
        <p className="admin-error" role="alert">
          {state.error}
        </p>
      )}
    </form>
  );
}

export function SubmitButton({ children, className = "admin-btn", disabled }: ComponentProps<"button">) {
  const pending = use(PendingContext);
  return (
    <button type="submit" className={className} disabled={pending || disabled}>
      {pending ? "იგზავნება…" : children}
    </button>
  );
}

// წაშლა ორი დაწკაპებით: პირველი აიარაღებს, მეორე ასრულებს.
export function ConfirmSubmit({ children, confirmLabel = "დადასტურება" }: { children: ReactNode; confirmLabel?: string }) {
  const pending = use(PendingContext);
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    if (!armed) return;
    const timer = setTimeout(() => setArmed(false), 4000);
    return () => clearTimeout(timer);
  }, [armed]);

  if (armed) {
    return (
      <button key="confirm" type="submit" className="admin-btn admin-btn--danger" disabled={pending}>
        {pending ? "იშლება…" : confirmLabel}
      </button>
    );
  }
  return (
    <button key="arm" type="button" className="admin-btn admin-btn--ghost" onClick={() => setArmed(true)}>
      {children}
    </button>
  );
}
