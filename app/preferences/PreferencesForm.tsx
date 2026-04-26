"use client";

import { useActionState } from "react";
import { savePreferences } from "./actions";
import { EVENT_TYPES } from "./constants";

export default function PreferencesForm({ saved }: { saved: string[] }) {
  const [state, action, pending] = useActionState(savePreferences, null);

  return (
    <form action={action} className="flex flex-col gap-3">
      <h2 className="font-semibold">
        What types of events would you like to attend?
      </h2>
      <div className="flex flex-col gap-2">
        {EVENT_TYPES.map((type) => (
          <label key={type} className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              name="eventTypes"
              value={type}
              defaultChecked={saved.includes(type)}
              className="checkbox checkbox-primary"
            />
            <span>{type}</span>
          </label>
        ))}
      </div>

      {state?.success && (
        <div role="alert" className="alert alert-success">
          <span>Preferences saved.</span>
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="btn btn-primary mt-2 self-start"
      >
        {pending ? (
          <span className="loading loading-spinner loading-sm" />
        ) : null}
        {pending ? "Saving…" : "Save preferences"}
      </button>
    </form>
  );
}
