// No backend endpoint exists yet to persist an in-progress grievance
// (oan_grievance_service has no draft API), so "Save Draft" is a
// frontend-only stand-in: it round-trips the wizard's state through
// localStorage, keyed per submitter, so a user who navigates away and comes
// back — or reloads the tab — doesn't lose what they'd already filled in.
// Swap this for a real API call once one exists.

const STORAGE_KEY_PREFIX = 'oan_grievance_draft:';

export interface GrievanceDraft {
  submitterType: string;
  submissionChannel: string;
  identityValues: Record<string, string>;
  serviceCategory: string;
  grievanceType: string;
  region: string;
  zone: string;
  woreda: string;
  kebele: string;
  serviceProviderName: string;
  description: string;
  desiredOutcome: string;
  // The uploaded file itself isn't serializable and isn't saved — a
  // reloaded draft asks the user to re-attach it.
}

function storageKey(email: string): string {
  return `${STORAGE_KEY_PREFIX}${email.trim().toLowerCase()}`;
}

/** Best-effort: a private window or blocked storage just means the draft isn't saved, not a hard failure. */
export function saveGrievanceDraft(email: string, draft: GrievanceDraft): void {
  try {
    localStorage.setItem(storageKey(email), JSON.stringify(draft));
  } catch {
    // ignored — see comment above
  }
}

export function loadGrievanceDraft(email: string): GrievanceDraft | null {
  try {
    const raw = localStorage.getItem(storageKey(email));
    if (!raw) return null;
    return JSON.parse(raw) as GrievanceDraft;
  } catch {
    return null;
  }
}

export function clearGrievanceDraft(email: string): void {
  try {
    localStorage.removeItem(storageKey(email));
  } catch {
    // ignored — see saveGrievanceDraft
  }
}
