# Diagnose sprint: 10 customer interviews, 5 builder interviews, 2 mystery shops (TOL-2916)

**Status: DRAFT. Not approved. Nobody has been contacted, called or visited.** This folder is the kit the sprint runs from. The interviews and the shops themselves are done by people, with the client's say-so. An agent cannot hold a conversation for the sprint, and nothing here sends, posts or calls anyone.

## What the sprint answers

Why do people in the valley buy fire and water from Seasonally Living, why do some not, and what does a builder need before they send us a second job. The answers feed the GTM plan's 90 day review (TOL-2895). Findings are themes with a count, not a transcript.

## Quotas

| Kind | Quota | Guide | Who runs it |
| --- | --- | --- | --- |
| Customer interview | 10 | `customer-interview-guide.md` | Jeramey, or Kimberly where Susan names her |
| Builder interview | 5 | `builder-interview-guide.md` | Jeramey, with Cam's intro to each builder |
| Mystery shop | 2 (one spa, one hearth) | `mystery-shop-protocol.md` | Jeramey, or a person nobody at the shop knows |

`tracker-template.csv` is the sprint's one sheet: `id` (C01 to C10, B01 to B05, S01, S02), `kind`, `person_ref`, `source_list`, `consent` (Y or N), `scheduled_date` (YYYY-MM-DD), `status` (todo, scheduled, done, no-show, declined), `interviewer`, `minutes`, `notes_location`, and `themes` (short tags separated by semicolons, no commas; for a shop, the score out of 20). A row counts as done only with consent, minutes, notes and themes filled. `node --experimental-strip-types scripts/check-diagnose-sprint.ts --progress <tracker.csv>` prints done against quota and fails on a row that carries a name, phone or email.

## Rules that hold for every conversation

- **Who gets asked.** Only people the client has OK'd by name for this sprint: customers from the 55-name list Susan approves, builders Cam introduces. The list is client data; it lives in the client's OneDrive, never in this repo (business data does not live in a code repo). Nobody is called who is on Susan's do-not-contact list.
- **Say what it is.** Open with who is calling, that it is research, how long it takes, and that they can stop. No selling on the call.
- **Nothing offered in exchange, nothing asked for.** No review, rating, referral or purchase request, and no gift, credit or discount for taking part.
- **No price, trade-in value or warranty quoted.** Susan or Cam confirms those after seeing the item.
- **Safety first.** A leak, an electrical problem or a gas smell mentioned on a call: stop the interview, tell Cam the same day.
- **Calls fall in the normal workday**, 9am to 5pm Pacific, and pause December 15 to January 2 (peak mode).
- **Notes carry a reference, not a person.** The tracker holds `person_ref` (a CRM or OneDrive id such as `CRM-4821`), never a name, phone or email. Full notes live in the client's OneDrive at the path in `notes_location`.

## What an agent did and what is left

Done in this PR: the three guides, the tracker header, the progress and PII check (`scripts/check-diagnose-sprint.ts`, run by CI).

Left, and only people can do it:

1. **Susan** approves the guides and the 55-name list, and names the 10 customers and the do-not-contact people (client approval).
2. **Cam** introduces the 5 builders.
3. **Jeramey** books and holds the 17 conversations and 2 shops, logging each in the tracker the same day.
4. Synthesis: when 17 and 2 are logged, an agent turns the tracker and the OneDrive notes into the findings page; that is a follow-up PR, not part of this one.

Open choice for Jeramey (default in bold): the two shops cover **Seasonally Living only**, or a competitor as well for comparison. The protocol assumes Seasonally Living only.
