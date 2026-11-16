# Hot-list format (TOL-2898)

**Status: DRAFT. Not approved.** The hot list is the daily call sheet Kimberly works from (TOL-2900). One row per person who replied to one of Cam's emails.

## Where it lives

A Google Sheet in Seasonally Living's own Google Workspace, with the header from `hot-list-template.csv`. **No customer data is ever committed to this repo**; the template is a header row only, and the check fails if a data row is added.

Each row is also a `seasonallyLivingLead` in Twenty (`docs/crm/source-standard.md`): `source = LIST_WAVE`, `sourceDetail` = the wave id (for example `wave-1-spa-5plus`), `line` = Hot tubs or Fireplaces, `stage` = New, then Booked visit when a visit is booked. The sheet carries the fields Twenty does not (tub age, what they said, call status).

## Columns

The first five are the ones the ticket asked for, in this order.

| Column | What goes in it |
| --- | --- |
| `name` | First and last name |
| `owns` | What they bought and the year, for example `Cal Spa, 2017` or `Napoleon insert, 2019` |
| `tub_age_years` | Years since purchase for a hot tub or swim spa; blank for hearth |
| `phone` | The number they replied with, or the Lightspeed number |
| `replied` | Their reply, word for word, up to 200 characters |
| `reply_code` | One of the codes below |
| `segment` | `A`, `B`, `C` or `D` (see `segment-emails.md`) |
| `wave` | Wave id, for example `wave-1` |
| `email` | Their email, the match key for Twenty and Lightspeed |
| `reply_date` | Date of the reply |
| `call_status` | `todo`, `voicemail-1`, `spoke`, `no-answer` |
| `outcome` | A code from `kimberly-callback-script.md` |
| `next_step` | One line, for example `Susan to look at the tub Saturday` |
| `next_date` | Date for the next step |
| `minutes` | Minutes Kimberly spent on this row, for her minutes log (TOL-3353) |
| `dnc` | `Y` or `N`. `Y` means never call or email again |

## Reply codes

| Code | Meaning | Call order |
| --- | --- | --- |
| `want-call` | Asked for a call or gave a number | 1 |
| `question` | Asked a question | 2 |
| `later` | "Not now", "maybe in spring" | 3 |
| `stop` | "No thanks", "remove me", anything hostile | Do not call; set `dnc = Y` |

## Call order

Sort by `reply_code` rank, then `tub_age_years` oldest first (a 7+ year tub is the trade-in candidate), then `reply_date` oldest first. Skip any row with `dnc = Y`. Kimberly's budget for new work is 30 minutes a day (Plan v5 section 10), so the day's list is however many calls fit, not the whole sheet.

## Daily routine (about 5 minutes of setup, then the calls)

1. Susan's do-not-contact list is checked against the sheet.
2. Replies from the shared inbox are added as rows with `reply_code` and `replied` filled.
3. Kimberly works the top of the sorted list, logging `call_status`, `outcome`, `minutes` after each call.
4. Anything with `outcome = visit-booked` or `service-booked` moves to the Monday scoreboard count (TOL-2912).
