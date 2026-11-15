# Seasonally Living CRM: source standard (TOL-2921)

No customer data lives in this repo. This file is the field list and the rules; records live in Twenty.

## Where it lives

Twenty (self-hosted, Railway) runs as **one workspace** with multi-workspace turned off (`GET /client-config` shows `isMultiWorkspaceEnabled: false`), so a separate "Seasonally Living workspace" is not possible without changing the Twenty deployment. The house pattern is venture-prefixed custom objects in the shared workspace (`tolowaCraftLead`, `kodeSuppression`). Seasonally Living follows it. No new service, no new bill. Created 2026-11-15 through the Twenty metadata API; objects are additive and removable in Settings > Data model.

## Objects

| Object (API name) | Purpose | Fields (type) |
| --- | --- | --- |
| `seasonallyLivingLead` | A person who asked for something or was imported | source (select), line (select), stage (select), email, phone, sourceDetail (text), bookedAt (date-time) |
| `seasonallyLivingConsult` | A booked visit or consult, by line | source, line, consultAt (date-time), outcome (select: open/sold/lost), saleNote (text, Lightspeed sale note) |
| `seasonallyLivingBuilderAccount` | A builder or trade account | source, line (main line), contactName, email, phone |
| `seasonallyLivingPoolBuild` | The pool build list | source, builderName, siteAddress, buildStage (planned/under construction/done), expectedFinish (date) |

Each object also has Twenty's standard `name`, created/updated stamps and creator.

**line**: Fireplaces, Hot tubs, Outdoor kitchens, Pools, Other. **stage** (lead): New, Booked visit, Consulted, Sold, Lost.

## The source standard

Every lead and sale carries exactly one `source`:

| Value | Meaning |
| --- | --- |
| `LIST_WAVE` | A named list send (record the wave in `sourceDetail`) |
| `GHOST_SEGMENT` | A Ghost newsletter segment (segment name in `sourceDetail`; leg waits on TOL-2896) |
| `SOCIAL` | Organic social |
| `GOOGLE` | Google organic or map pack |
| `ADS` | Paid ads (campaign in `sourceDetail`) |
| `BUILDER` | Referred by a builder account |
| `WALK_IN` | Showroom walk-in, no earlier digital touch |

Twenty cannot make a select non-null without a default, so "required" is enforced by the flow and the report: the n8n flow always sets it (rules below), Susan tags it in Lightspeed sale notes, and the Monday scoreboard (TOL-2912) lists any lead or consult with an empty `source` as a data-quality line.

## Website bookings: attribution to source

`/api/lead` already receives `attribution.first` / `attribution.last` (`src/lib/attribution.ts`). First match wins, using the **first touch**; the last touch goes in `sourceDetail`:

1. `gclid` present, or `utm_medium` in (`cpc`, `ppc`, `paid`) or `fbclid` present with `utm_medium` paid: `ADS`
2. `utm_source` equals the Ghost segment pattern (`ghost`, `note`) : `GHOST_SEGMENT`
3. `utm_source` or referrer host is `google.*` with no paid medium: `GOOGLE`
4. `utm_source` or referrer host is facebook, instagram, tiktok, pinterest, youtube: `SOCIAL`
5. `utm_campaign` starts with `wave-`: `LIST_WAVE`
6. Landing path starts with `/builders` and `utm_source=builder`: `BUILDER`
7. No attribution at all: leave `source` empty on purpose, so it shows in the data-quality line instead of being guessed.

## n8n flow (not built yet)

1. Webhook (POST, shared secret) receives `{ kind, interest, name, email, phone, when, attribution }`.
2. Code node applies the mapping above and maps `interest` to `line`.
3. HTTP Request to Twenty REST `POST /rest/seasonallyLivingLeads` (and `seasonallyLivingConsults` when `when` is set), token from the existing Twenty credential in n8n.
4. Failure goes to the existing n8n error workflow.

The site side is a small change in `src/app/api/lead/route.ts` to forward the cleaned payload to that webhook after the staff email is sent. It sends visitor contact details to a third system, so it needs the privacy copy checked first. **Not wired in this PR.**

## Monthly Lightspeed import

`docs/crm/lightspeed-monthly-import-template.csv` is the column list for the monthly export. Match key is email, then phone. Imported rows set `stage=SOLD` and copy the sale note's source tag into `source`. Run by n8n or by hand on the first of the month.

## Acceptance (from the ticket) and status

- Twenty objects and the `source` field list exist: **done 2026-11-15** (schema round-trip tested with one record, then deleted).
- A test lead arrives via n8n with its source set: **not done**, needs the flow above and the site webhook.
- Field list recorded in the Notion row: **not done**, link this file from the row.
