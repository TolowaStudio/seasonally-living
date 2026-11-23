# Content engine (TOL-2920, TOL-2912)

Write once, publish four places: the site journal, Facebook, Instagram and Google Business Profile,
with a human approving before anything goes out. The posting side is in `automation/README.md`.

## The pieces

| Piece | Where |
| --- | --- |
| Journal on the site: `/journal`, `/journal/<slug>`, `/journal/rss.xml`, sitemap | `src/app/journal/`, `src/lib/journal.ts` |
| Code-default posts (always render, even if Sanity is down) | `src/content/journal.ts` (`DEFAULT_POSTS`) |
| Sanity `post` type (article, social versions, approval, results) | `studio/post-schema.ts` |
| Weekly rhythm, seasonal lead lines, local hooks, vetted hero photos | `src/content/calendar.ts` |
| Draft a week of posts (subscription writer) | `scripts/content/draft-week.ts` |
| Draft a post from a video transcript (plain text, SRT or WebVTT) | `scripts/content/draft-from-transcript.ts` |
| Clean up a video's captions (SRT/WebVTT in, platform-ready SRT + WebVTT + transcript + report out) | `scripts/content/caption-video.ts`, helpers in `captions.ts` |
| Load reviewed drafts into Sanity (opt-in) | `scripts/content/import-drafts.ts` |
| n8n approval queue and cross-posting | `automation/n8n/social-approval-queue.json` |
| Phone-tap approve route (off unless env is set) | `src/app/api/content/approve/route.ts` |

## Journal rules

- A post is on the site when its status is approved, scheduled or published, its `publishAt` (if any)
  has passed, and it has article text. Drafts and future dates are hidden.
- A Sanity post with the same slug as a code default replaces it. To retire a default, create a post
  with that slug and set it to Draft.
- The seed posts are general and true. The shop-specific claims in them carry `TODO-confirm` comments in
  `src/content/journal.ts` and are listed in the PR.
- Going live is the usual three steps: deploy the Studio schema, (optionally) seed Sanity, deploy Cloud
  Run. Until then the live site is unchanged.

## Weekly cycle (the monthly content cycle, TOL-2912)

1. **Monday, 15 minutes:** run the generator for the coming week.

   ```bash
   node --experimental-strip-types --no-warnings scripts/content/draft-week.ts \
     --week 2026-11-16 --theme "freeze prep" \
     --arrival "2019 Cal Spas Escape, 5 seats ... what the shop did ..."
   ```

   Output lands in `out/content-drafts/<week>/` (gitignored): one JSON file per post and a
   `preview.md` that Kimberly can read like a letter. `--dry-run` prints the prompt with no API call.
   `--only Mon,Fri` drafts just those days. Default model is `claude-haiku-5-5` on the host's Claude Max subscription;
   `--model claude-sonnet-5-5` for more polish. If Claude is rate-limited, the run
   falls through to Gemini Neon, then Composer.

2. **Fill in what only the shop knows.** Wednesday (arrival) and Saturday (video) need real facts:
   pass `--arrival` / `--video`. Without them the draft is a **template** full of `[[ADD: ...]]`
   markers, and the "Check with Cam or Susan first" list says so.
3. **Proof.** Read `preview.md`. Every draft ships with a list of things to check: placeholders, any
   price, sale, warranty or "certified" wording, anything about how the shop works.
4. **Load into Sanity.** `import-drafts.ts <dir>` is a dry run until you add `--write` and
   `SANITY_TOKEN`. It only creates posts as Draft and never overwrites.
5. **Approve in the Studio** (or the phone tap). n8n posts. Results land in the post.

The generator cannot invent a photo (hero images come from the vetted pool in `calendar.ts`), cannot
write to Sanity, and cannot post anywhere.

## Video to content

`scripts/content/draft-from-transcript.ts <transcript.txt> --angle "..." --line pool --article`

- Make the transcript wherever suits (phone voice-memo transcript, Whisper, Descript). Paste it into a
  text file. No video upload is part of this (no Google Drive, YouTube or Facebook upload).
- The model only sees the text. It is told to use only what the speakers say, put unclear names or
  numbers in the check list, and never present anything as a customer quote.
- **Slicing one shoot into months of content:** run it again with a different `--angle` each time
  ("how the crew sets the wall", "what the pad needs", "the first fill and startup", "what the owner
  said at the end"). One pool-install shoot, a dozen angles, each its own post with all three social
  versions.
- Output goes to `out/content-drafts/transcripts/` with a `.preview.md` beside it.
- A caption file (`.srt` or `.vtt`) can be passed instead of plain text; the timing is stripped and only
  the speech reaches the model.

### Captions (TOL-3371)

`scripts/content/caption-video.ts <captions.srt|.vtt> [--video clip.mp4] [--name slug] [--out dir]`

1. Get timed captions from any tool (Descript, phone transcript export, YouTube auto-captions, Whisper).
   The script makes no speech-to-text call and sends nothing anywhere.
2. It re-cuts them to at most 2 lines of 42 characters and 7 seconds per cue (words and total time are
   preserved), strips markup, and writes `<name>.srt`, `<name>.vtt`, `<name>.transcript.txt` and
   `<name>.captions-report.md` to `out/content-drafts/captions/`. It refuses to overwrite its input.
3. With `--video` it checks the captions against the clip length (catches captions from a different cut).
4. Feed `<name>.transcript.txt` (or the `.srt`) to `draft-from-transcript.ts` for the post copy.
5. A person watches the video once with the captions on and reads the report. Speech-to-text mishears
   names, model numbers and numbers.

Where the captions go once approved (not built, see below): Facebook takes the `.srt` as a caption file at
upload. Instagram has no caption-file upload, so Reels and feed video need captions burned in by an editor
(Descript, CapCut) or by an `ffmpeg` that has `libass`; the Homebrew `ffmpeg` on the dev laptop does not,
so burn-in was not built or verified here.

## Weekly schedule (TOL-3371)

`scripts/content/run-weekly-draft.sh` drafts the coming week (Sunday run, Monday-start week) into
`out/content-drafts/weekly/<monday>/` (`DRAFT_OUT_ROOT` overrides), with a `preview.md` for proofing.
`--dry-run` prints the first prompt with no model call. It uses subscription tiers (Claude Max → Neon →
Composer), Haiku by default, refuses Opus/Fable, and is capped at 60 minutes. Draft only: no Sanity,
Facebook, Instagram or Google.

`automation/launchd/com.tolowa.seasonally-living.draft-week.plist` is a TEMPLATE (Sunday 18:00), **not
installed**. launchd starts jobs with a bare `PATH`; the template and the wrapper both add Homebrew's
directories, and the wrapper exits 3 naming `node`, `perl` or `gcloud` if one is missing (it also needs
Node 22+). Do not edit the template by hand. To enable, **on the Mini that should draft (not a laptop)**,
from a checkout of this repo on `main`:

```
scripts/content/run-weekly-draft.sh --dry-run             # no model call: proves node and paths
scripts/content/install-weekly-schedule.sh                # prints the filled-in plist, changes nothing
scripts/content/install-weekly-schedule.sh --install      # writes ~/Library/LaunchAgents/... and loads it
launchctl kickstart gui/$(id -u)/com.tolowa.seasonally-living.draft-week   # optional: one real run now (pennies, Haiku)
```

Undo: `scripts/content/install-weekly-schedule.sh --uninstall`. Log: `~/Library/Logs/seasonally-living-draft-week.log`.
The Mini needs `claude`, and optionally `neon` (Antigravity) and `agent` (Cursor), signed in for the
subscription tiers.

Still open: where Kimberly proofs `preview.md` (a shared folder is not chosen: confirm the storage
choice, then point `DRAFT_OUT_ROOT` at it), and video upload and posting to Facebook/Instagram
(posting is a public send and needs a go-ahead; the caption half is built, see "Captions" above).

## Open items

See the Linear follow-ups under TOL-3345 (newsletter send from the same posts, video upload and
captioning, Facebook/Instagram video, a calendar view for Cam, unattended weekly generation on a Mini).
