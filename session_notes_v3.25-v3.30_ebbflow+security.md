# mylifeHQoraculum — Session Notes (v3.25–v3.30)

**Date:** 11 July 2026
**File:** mylifeHQoraculum.html

---

## Part 1 — Ebb and Flow (feature work)

Reframed the tide-tracking feature from an emotional/feeling model to a positional/ecological one, grounded in tidal mechanics: the current (not the peak) is where life concentrates, and each of the four states describes what's actually happening in the water, not a mood level.

**Section renamed:** "Feeling Tides" → **"Ebb and Flow"**

**State labels and sub-labels (final):**

| State | Label | Sub-label |
|---|---|---|
| high-tide | High | resting in fullness |
| pouring-out | Outgoing | letting it go |
| filling-up | Incoming | letting it come |
| low-tide | Low | revealing deeper layers |

Sub-labels are written in present participle so they read as in-the-moment recognitions ("that's what's happening for me right now"), not instructions.

**Domain-grid layout fixes (CHECK-IN page, `#p2`):**
- v3.25: `align-self: stretch` on `.domain-grid` — first attempt at iPhone right-column overflow fix
- v3.27: `width: min(100%, 460px)` — attempted percentage-based fix, still broke on desktop
- v3.28 (two passes): root cause found — `#p2 { align-items: stretch }` combined with `aspect-ratio: 1` on `.d-tile` was letting stretched grid rows expand tile width past the column boundary. Fixed with `align-items: start` on `.domain-grid`. This was the definitive fix.

**Icon restoration (v3.26):**
- v3.19 had scaled all PNG icons 1.15× with a center-crop, which over-zoomed many icons (especially the hand-placeholder ones)
- Restored all 33 changed PNGs (114 total instances) to their pre-v3.19 originals by diffing against git commit `a3a7637`
- File size dropped back from ~18.2MB to ~13.6MB

---

## Part 2 — Security incident: leaked Firebase API key

**Trigger:** GitHub secret scanning flagged a publicly leaked Google API key (`AIzaSyDiGQ_ncxfIb1NYbkfPPLnqLhotG8enZbQ`) committed in `mylifeHQoraculum.html`, part of the Firebase Web SDK config for project `mylifehq-87330`.

**What we found:** The leaked key itself was low-risk in isolation (Firebase Web keys are meant to be public — they identify a project, not authenticate access). The real exposure was the **Firestore Security Rules**, which were set to:

```
allow read, write: if true;
```

— meaning anyone with any valid key for the project could read, write, or delete the entire database, no login required. Firebase's own console flagged this in red as a public/unprotected database.

**Remediation, in order:**

1. Deleted the leaked key in GCP Console → Credentials
2. Created a new key, restricted to:
   - **API restrictions:** Cloud Firestore API + Identity Toolkit API (the second was missed on the first pass and caused a follow-up sync outage — see below)
   - **Application restrictions:** HTTP referrers limited to `lunamor73.github.io/*`
3. Enabled **Anonymous Authentication** in Firebase Console → Authentication → Sign-in method
4. Changed Firestore rule to `allow read, write: if request.auth != null;` and published
5. Updated app code (`mylifeHQoraculum.html`) to sign in anonymously via `signInAnonymously()` before any Firestore read/write, wrapped in a `waitForAuth()` promise ahead of `main()`
6. Committed and pushed as **v3.30**: "rotate API key, gate Firestore behind anonymous auth, lock down rules"

**Follow-up issue:** After deploying v3.30, sync silently failed on all devices — anonymous sign-in was hitting a 403 because the new key's API restrictions only included Cloud Firestore API, not Identity Toolkit API (which anonymous auth calls under the hood). Devices diverged (phone had 17 check-ins, browser stuck at 16) until Identity Toolkit API was added to the key's restrictions. Confirmed working via console log `[LUNAMOR sync] active — v3.4` and devices reconciling back to 17.

**GitHub token hygiene note:** A GitHub Personal Access Token was generated to push v3.30 (HTTPS password auth is deprecated). It was pasted into this chat to work around Terminal's click-only access tier — flagged as exposed the moment it was typed anywhere outside the actual git password prompt, and revoked immediately after the push succeeded. Lesson: secrets go only into the exact prompt asking for them, never into chat/email/docs, even when there's no way around it in the moment.

**Follow-up alert (expected, not urgent):** A second "Google API Key" secret-scanning alert appeared for the *new* key, since Firebase Web keys are inherently public in client-side code and will always trigger pattern-matching scanners. Closed as "Won't fix" rather than revoked — the key is properly restricted (API scope + HTTP referrer) and the actual data layer (Firestore rules) now requires authentication, so public visibility of the key itself is expected and mitigated, not a fresh leak.

**Current state (as of v3.30, live):**
- Old key deleted and inert
- New key restricted (Firestore + Identity Toolkit APIs, `lunamor73.github.io/*` referrer only)
- Firestore rules require `request.auth != null`
- App signs in anonymously before any cloud sync
- GitHub PAT used for the push has been revoked
- First secret-scanning alert (old key) — to be marked revoked
- Second secret-scanning alert (new key) — to be closed as "Won't fix"
