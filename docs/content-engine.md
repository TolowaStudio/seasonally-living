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
| Draft a week of posts (Anthropic API) | `scripts/content/draft-week.ts` |
| Draft a post from a video transcript | `scripts/content/draft-from-transcript.ts` |
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
   # find the key by name only; never print it
   motion-credential-probe anthropic          # -> motion-anthropic-api-key
   gcloud secrets versions access latest --secret=motion-anthropic-api-key --project=tolowa-studio > "$TMPDIR/ak"
   ANTHROPIC_API_KEY_FILE="$TMPDIR/ak" node --experimental-strip-types --no-warnings \
     scripts/content/draft-week.ts --week 2026-11-16 --theme "freeze prep" \
     --arrival "2019 Cal Spas Escape, 5 seats ... what the shop did ..."
   rm "$TMPDIR/ak"
   ```

   Output lands in `out/content-drafts/<week>/` (gitignored): one JSON file per post and a
   `preview.md` that Kimberly can read like a letter. `--dry-run` prints the prompt with no API call.
   `--only Mon,Fri` drafts just those days. Default model is `claude-haiku-5-5` (about 4 cents a week);
   `--model claude-sonnet-5-5` for more polish.

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

## Open items

See the Linear follow-ups under TOL-3345 (newsletter send from the same posts, video upload and
captioning, Facebook/Instagram video, a calendar view for Cam, unattended weekly generation on a Mini).
