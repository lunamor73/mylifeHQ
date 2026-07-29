# mylifeHQ / ORACULUM — Full Context Export
**For:** Fable chat / new testing session  
**Date:** Friday 12 June 2026  
**Prepared by:** Claude (Cowork session)

---

## WHO IS PENGUIN

**Name:** Matt Dpenguin  
**Born:** Thursday 12 July 1973, 4:05 PM, Redcliffe QLD Australia  
**Email:** mattdpenguin@gmail.com

### Astrological Profile
- **Sun:** Cancer 19°45' — the nurturer, the memory-keeper, the one who protects what is tender
- **Rising:** Capricorn 6°34' — structured, serious, long-view, institutional
- **Moon:** Sagittarius 14°26' — teaching, movement, philosophical restlessness, needs to roam
- **Mercury:** Leo 2°10' Rx — retrograde expression, finds words on the second pass
- **Mars:** Aries 13°29' — direct action, initiates fast
- **MC:** Virgo 23°52' — public vocation through craft and service

### Human Design
- **Type:** Manifesting Generator 5/2 (Heretic/Hermit)
- **Authority:** Emotional — needs to wait for clarity through the wave
- **Channels:** 53-42 (cyclic beginnings/endings), 32-54 (transformation), 63-4 (doubt/logic)
- **Profile 5/2:** Seen as the practical problem-solver (5); withdrawn inner world (2). Called upon before ready. Often works alone on things that become useful to many.

### Numerology
- **Life Path:** 30/3 — Expression & Sensitivity, creative communicator

### Mayan Tzolkin
- **Kin 6:** White Rhythmic Dog — devotion, love, loyalty, rhythm, heart-based organizing

### Flow Profile (Flow Genome Project)
- **Primary:** Flow Goer — seeks peak states through movement and embodied engagement
- **Secondary:** Deep Thinker — needs periods of solitary focus to integrate

### Chinese Astrology
- **Water Ox (1973)** — Fixed Earth + Water; yin persistence; stagnation risk; activates with Yang/Fire; wu wei

### Ancestry (DNA — relevant to LUNAMOR framing)
- ~47% Celtic (Scottish/Welsh + Irish) — oral tradition, land-connected, embodied mythic
- ~15% Portuguese — historic Pacific presence; possible bridge strand
- ~15.6% Western Polynesian + 7% Māori — real bloodline, not borrowed aesthetics
- Pacific ancestry grounds the LUNAVĀ naming and the *vā* concept in actual inheritance

### Personal Year (Numerology)
- **2026:** Personal Year 1 (New beginnings, seeds, self re-emerges) — shifts on 12 July 2026 (birthday)

---

## LUNAMOR — THE BUSINESS

**LUNAMOR PTY LTD** — Creative arts and technology for the fully embodied human.  
*(Not a music company — a creative arts and technology company. Tagline locked May 2026.)*  
*The unifying thread: the body is the primary medium for meaning-making, transformation, and connection.*

### Products
- **Booty Shaker** (3 versions) — wearable percussion instrument; prototyping
- **MIDI Mat** — floor MIDI controller for movement performance; concept
- **Slapdancesing** — original body music methodology (percussion + movement + voice); core IP
- **Slapdancesing Card Game** — analog card game; design complete, prototype needed
- **Slapdancesing App** — practice app with skill progression; concept
- **Rusty Jangles & the Bootyshaker** — flagship touring show; in development (troupe model — Penguin is not the performer)
- **mylifeHQ / ORACULUM** — personal oracle + check-in app; primary digital product

### The Flywheel
```
Show → Audience → App → Retreat → Community → Show
```
Each stage reinforces the next. The loop is the business, not any single product.

### Roadmap
- **2026 — Plant & Prove:** Validate oracle/mylifeHQ, card game prototype, show/retreat foundations
- **2027-28 — Build the Category:** Launch show, public app, first retreats
- **2028-30 — Community as Moat:** Practitioner/community layer
- **2030+ — Methodology Institution:** School of thought, licensing, certifications

### Internal Domain Names
| Domain | Name | Root Meaning |
|---|---|---|
| Company | **LUNAMOR** | Latin *amor* — love |
| Making / creative practice | **LUNAVĀ** | Samoan/Tongan *vā* — sacred relational space |
| Learning & R&D | **LUNAWĀN** | Māori *wānanga* — deep communal learning |
| Community / field work | **LUNATIR** | Gaelic *tir/tír* — land, territory |
| Admin / operations | **LUNAAMA** | Pacific *ama* — outrigger, stabiliser |
| Comms / voice | **LUNALUME** | Portuguese *lume* — soft amber light |
| Finance | **LUNACÁI** | Mandarin 财 *cái* — wealth |
| People / network | **LUNAFAM** | Living English *fam* — family |
| Vision / strategy | **LUNADÁN** | Irish *dán* — calling, fate, poem |
| Memory / archive / legacy | **LUNACOF** | Welsh *cof* — memory, remembrance |

### Strategic Assessment (AI Founder Coach, 28 May 2026)
- mylifeHQ is currently a **concierge MVP** — works for Penguin, not yet validated with independent users
- **The Free LLM Problem:** users can replicate the oracle in Claude/ChatGPT without paying — differentiator must be curation, context, and relationship
- **6 Hypotheses to test before scaling:**
  1. A non-technical user can complete their first oracle reading without help
  2. Users return within 7 days
  3. Users will pay $8-15 AUD/month
  4. Slapdancesing live event creates meaningful app conversion
  5. Retreat model is viable as primary revenue
  6. Bree as co-founder adds enough reach to validate faster
- **Recommended direction:** Retreat as onboarding, app as retention (high-touch first, digital relationship after)
- **Immediate priority:** Get real users through the experience independently

---

## THE APP — mylifeHQoraculum.html

**URL:** `https://lunamor73.github.io/mylifeHQ/mylifeHQoraculum.html`  
**GitHub repo:** `lunamor73/mylifeHQ`  
**File:** `~/mylifeHQ/mylifeHQoraculum.html` (~11MB single-file PWA)

### What the app does
A personal check-in and oracle tool. The user flows through:
1. **Domain selection** — LUNAMOR internal domains (LUNAVĀ, LUNAWĀN, LUNAAMA, etc.)
2. **Sub-domain / focus** — what specifically are you working on
3. **Zone ring** — Cruising / Stretching / In Flow / Overload / Underload
4. **Feeling Tides** — High Tide / Low Tide / Filling Up / Pouring Out / Still Waters / etc.
5. **Exchange** — giving / receiving / balanced / solo / collaborative
6. **Time** — how long spent
7. **Note** — free text
8. **ORACULUM** — generates a structured oracle prompt incorporating all of Penguin's profile data (astrology, HD, Mayan, Flow Genome, wellbeing traditions) + recent check-ins. Copies to clipboard for pasting into Claude.

### Data Storage
| Key | Purpose |
|---|---|
| `phq-history` | Active check-ins (HIST_KEY) |
| `phq-insight-archive` | Permanent archive of deleted entries (ARCH_KEY) |
| `phq-deleted-ts` | Tombstones for sync deduplication |

### Code Architecture (key patches)

**ORACULUM_FIREBASE_V3_3** (setItem wrapper)
- Intercepts all `localStorage.setItem('phq-history', ...)` calls
- Diffs old array vs new array
- Calls `archiveNow(removedEntries)` with any entries that disappeared

**ORACULUM_INSIGHTS_GETITEM_FIX** (getItem intercept)
- Intercepts `localStorage.getItem('phq-history')` on the insights page
- Calls `mergeForDisplay(history, archive)` — merges active + archived entries
- Returns merged, deduped, sorted array to `buildInsights()`

**`buildInsights()`** — calls `e.ts.slice(0, 10)` on all entries — **requires ISO string ts**

---

## VERSION HISTORY

### v3.3 — Firebase setItem wrapper
- Archives entries directly in the setItem intercept
- `archiveNow()` called whenever entries are removed from phq-history

### v3.4 — ts normalization (commit `b3813b3`)
**Problem:** Numeric timestamps (Unix ms integers) and sentinel `9999999999999` in the archive broke `buildInsights()` with `TypeError: e.ts.slice is not a function`.

**Fix:** `normTs()` helper — converts numeric ts → ISO string, filters null/undefined/sentinel. Applied in:
- `mergeForDisplay()` in ORACULUM_INSIGHTS_GETITEM_FIX
- `archiveNow()` in ORACULUM_FIREBASE_V3_3

```javascript
function normTs(e) {
  if (!e || e.ts == null || e.ts === 9999999999999) return null;
  const ts = typeof e.ts === 'number' ? new Date(e.ts).toISOString() : String(e.ts);
  if (!ts || ts === 'undefined' || ts === 'null' || ts === 'NaN') return null;
  return Object.assign({}, e, { ts });
}
```

### v3.5 — Bulk clear-history archive fix (commit `1ae0026`)
**Problem:** "Clear all history" button used `localStorage.removeItem(HIST_KEY)` — bypassed the setItem wrapper entirely. Bulk delete silently lost all entries. One-by-one deletion worked fine.

**Fix:**
```javascript
clearBtn.onclick = () => {
  if (confirm(`Clear all ${hist.length} check-in${hist.length !== 1 ? 's' : ''}? This cannot be undone.`)) {
    if (typeof archiveNow === 'function') { try { archiveNow(hist); } catch(e) {} }
    localStorage.setItem(HIST_KEY, '[]'); updateHistBtn(); buildHistoryPage();
  }
};
```

### v3.6 — Remove `e.note` filter from `archiveNow()` (current HEAD)
**Problem:** `archiveNow()` filtered `.filter(e => e && e.note)` — entries with empty notes were silently discarded from the archive. `ts + domain` alone is enough to make an entry worth keeping.

**Fix:** Changed to `.filter(Boolean)` — archives every valid entry regardless of note content.

---

## CURRENT STATE (12 June 2026)

- All three patches deployed and live on GitHub Pages
- Git log:
  ```
  1ae0026  Fix: archive entries on bulk clear-history button (v3.5)
  b3813b3  Fix: normalize ts to ISO string in insights merge + archiveNow (v3.4)
  9af7455  firebase sync v3.3: archive directly in setItem
  ```
  *(v3.6 pending push at time of export — run `git add mylifeHQoraculum.html && git commit -m "Fix: archive entries with empty notes in archiveNow (v3.6)" && git push`)*

---

## TESTING CHECKLIST

### Core archive flow
- [ ] Add 3–5 check-ins across different domains
- [ ] Delete one individually → Insights → All → entry appears
- [ ] Delete another → Insights → All → entry appears
- [ ] Use **"Clear all history"** button → Insights → All → ALL entries appear
- [ ] Refresh page → Insights → All → entries persist (not cleared on reload)
- [ ] Add new check-in after clearing → history restarts from 1, archive untouched
- [ ] Check Insights → Patterns → no crash (ts normalization working)

### Edge cases
- [ ] Check-in with **empty note** → delete → appears in archive (v3.6 fix)
- [ ] Check-in from different device → check archive sync behaviour

### ORACULUM flow (first-user test)
- [ ] Can a new user complete a full check-in without explanation?
- [ ] Does the ORACULUM prompt feel relevant and personal?
- [ ] Does the copy-to-clipboard work cleanly?
- [ ] Does pasting into Claude produce a useful oracle reading?

---

## COMPANION APPS (in development)

### MUNDUS
Twin app to ORACULUM. Practical daily layer.
- Monday: pull calendar for the week, flag must-attend events + emails needing response
- Friday: review what happened, flag unresolved threads
- Connects to Gmail + Google Calendar via MCP
- Build: standalone Cowork artifact using `window.cowork.callMcpTool`
- Visual language: same as ORACULUM (grab code from mylifeHQoraculum.html)

---

## ORACLE PROMPT (generated from this session)

The ORACULUM button was pressed during the session with 3 check-ins logged by Claude (acting as Penguin). The prompt reads:

> PENGUIN ORACLE INSIGHT REQUEST  
> Date: Thursday 11 June 2026  
> You are the Penguin Oracle — a synthesised intelligence drawing on: [full profile] + [3 check-ins from this session documenting the debugging work]  
> Based on all oracle data and the check-ins above: how is my life looking right now? Cross-reference all systems. Use dot points with domain headers. Flag what is alive, what needs attention, and any patterns you see across the check-in data.

**Oracle reading summary (Claude's response):**
- Three check-ins, all LUNAMOR domain, all tagged *giving* — a sustained act of service to a future self
- Tides arc: Filling Up → High Tide → Pouring Out — a complete wave in one session
- The archive (`phq-insight-archive`) is the technological expression of Personal Year 1 energy — building the vessel to hold everything being seeded
- 5/2 profile active: working alone on things that become useful to many; sees the systemic fix, not just the local patch
- All zones: stretching or flow — healthy range, no crisis, no coasting
- *The product held its own state during the development of itself.*

---

## NOTES FOR THE TESTING SESSION

This app was built for Penguin first — it is deeply personal, uses his specific profile data (astrology, HD, Mayan, Flow Genome, 18 wellbeing traditions), and the check-in vocabulary maps to LUNAMOR's internal domains. 

For testing with other people, the key questions are:
1. Can someone use it without knowing anything about Penguin's system?
2. Does the ORACULUM output feel meaningful to them, or does it feel like someone else's oracle?
3. What is the minimum context a new user needs to give before the oracle becomes useful?

The strategic hypothesis is that **the retreat is the onboarding** — users come through a high-touch embodied experience first, then the app becomes their between-retreat companion. Testing the app standalone with strangers is a deliberate stress test of hypothesis #1.
