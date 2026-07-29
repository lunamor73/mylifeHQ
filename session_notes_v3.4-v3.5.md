# mylifeHQ Session Notes — v3.4 + v3.5
**Date:** Thursday 11 June 2026  
**App:** `lunamor73.github.io/mylifeHQ/mylifeHQoraculum.html`

---

## What was built

### v3.4 — ts normalization (commit `b3813b3`)
**Problem:** `buildInsights()` calls `e.ts.slice(0, 10)` expecting an ISO string, but archive entries had numeric timestamps (Unix ms) and a sentinel value `9999999999999`. This crashed insights with `TypeError: e.ts.slice is not a function`.

**Fix:** Added `normTs()` helper that converts numeric ts → ISO string, and filters out null/undefined/sentinel values. Applied in two places:
- `mergeForDisplay()` in `ORACULUM_INSIGHTS_GETITEM_FIX` (the getItem intercept)
- `archiveNow()` in `ORACULUM_FIREBASE_V3_3` (the setItem wrapper)

---

### v3.5 — bulk clear-history archive fix (commit `1ae0026`)
**Problem:** The "Clear all history" button used `localStorage.removeItem(HIST_KEY)` — this bypassed the Firebase V3.3 `setItem` wrapper entirely. Entries were deleted without being archived. One-by-one deletion worked fine; bulk clear silently lost everything.

**Fix:** Changed `clearBtn.onclick` to:
1. Call `archiveNow(hist)` directly with all current entries before clearing
2. Use `localStorage.setItem(HIST_KEY, '[]')` instead of `removeItem`

```javascript
clearBtn.onclick = () => {
  if (confirm(`Clear all ${hist.length} check-in${hist.length !== 1 ? 's' : ''}? This cannot be undone.`)) {
    if (typeof archiveNow === 'function') { try { archiveNow(hist); } catch(e) {} }
    localStorage.setItem(HIST_KEY, '[]'); updateHistBtn(); buildHistoryPage();
  }
};
```

---

## Known issues / future improvements

1. **`archiveNow()` filters on `e.note`** — entries with empty notes are silently discarded. A `ts + domain` alone is enough to make an archive entry meaningful. The filter should be removed or loosened.

2. **Reset button doesn't navigate** — recurring issue. The reset button clears state but doesn't always return to home (`p1`). Fix: add `nav('p1')` call inside the reset handler after state clear.

---

## Architecture reference

| Key | Purpose |
|-----|---------|
| `phq-history` | Active check-ins (HIST_KEY) |
| `phq-insight-archive` | Permanent archive (ARCH_KEY) |
| `phq-deleted-ts` | Tombstones for sync |

**Data flow:**
- `setItem('phq-history', ...)` → Firebase V3.3 wrapper → diffs old vs new → calls `archiveNow(removedEntries)`
- `getItem('phq-history')` on insights page → `ORACULUM_INSIGHTS_GETITEM_FIX` → `mergeForDisplay(history, archive)` → merged + deduped by ts
- `buildInsights()` → calls `e.ts.slice(0, 10)` on all entries → requires ISO string ts

**One-by-one delete path:** setItem wrapper catches removal → archives ✅  
**Bulk clear path (pre-v3.5):** removeItem → bypasses wrapper → no archive ❌  
**Bulk clear path (v3.5+):** archiveNow(hist) called directly → setItem('[]') → archives ✅

---

## Testing checklist (for new testers)

- [ ] Add 3–5 check-ins across different domains
- [ ] Delete one individually → check Insights → All → entry appears
- [ ] Delete another via swipe/button → check Insights → All → entry appears
- [ ] Use "Clear all history" button → check Insights → All → ALL entries appear
- [ ] Refresh page → check Insights → All → entries still there (not lost on reload)
- [ ] Add new check-in after clearing → history restarts from 1, archive untouched
- [ ] Check Insights → Patterns → no crash (ts normalization working)

---

## ORACULUM check-in (meta)
Three check-ins were completed during this session by Claude (not Penguin), documenting the debugging work in real time. The ORACULUM prompt was generated and read — all three check-ins appeared correctly with notes intact. The product held its own state during development of itself.
