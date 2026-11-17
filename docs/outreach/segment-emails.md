# Cam's segment emails (TOL-2898)

**Status: DRAFT. Not approved. Nothing here has been sent or scheduled.** Approval order: Jeramey, then Cam. Sending is TOL-2899 (seed batch) and TOL-2900 (waves), and neither starts until both have said yes in writing.

Plain text, personal, signed by Cam. Not a designed newsletter: no images, no buttons, no HTML. One email per person per wave.

`scripts/check-outreach-copy.ts` enforces the rules below on every PR (CI runs it). Run `node --experimental-strip-types scripts/check-outreach-copy.ts --ready` right before a send: it also fails while any double-square-bracket placeholder is left in the copy.

## Who gets which email

One email per person per wave. Take the first row that fits. Susan's do-not-contact list and anyone who unsubscribed or replied "no thanks" are removed before this step.

| Email | Segment | Rule (first match wins) |
| --- | --- | --- |
| A | Spa owners with an older tub | Bought a hot tub or swim spa 5 or more years ago |
| B | Hearth owners | Bought a stove, fireplace or insert (any year) |
| C | Recent spa owners | Bought a spa in the last [[24]] months |
| D | Everyone | Sent 7 days after the first email to anyone who did not reply, did not unsubscribe and has not already joined the monthly note |

D is the "opt-in second" step: nobody is added to the monthly note by receiving a first email. They join only by clicking and confirming (double opt-in, `/note`).

Segment rules need purchase year and product from the Lightspeed export (TOL-2891). The 2026-11-06 export had no purchase history, so until TOL-2891 delivers it, Susan tags the 50 to 100 seed names by hand. If the export still cannot say what a person bought, they get D only.

**Decided (Jeramey, 2026-11-15 9:21 PM PT, at the desk): the older-tub segment stays at 5+ years.** Plan v5 section 4 says to phone owners at 7+ years; that line does not apply to this set. Email A goes to everyone with a tub 5 or more years old. The callback list still sorts by tub age, oldest first, so the oldest tubs are called first. Cam has not yet approved the copy.

## Merge fields

| Field | Source |
| --- | --- |
| `{{first_name}}` | Lightspeed. If blank, the greeting becomes "Hello," |
| `{{product_year}}` | Lightspeed purchase year (A and C) |
| `{{product}}` | "hot tub", "swim spa", "stove", "fireplace" or "insert" |
| `{{unsubscribe_url}}` | One-click unsubscribe link from the sending tool (TOL-2896). Required in every email |
| `{{note_signup_url}}` | `https://seasonallyliving.com/note?utm_source=cam-email&utm_medium=email&utm_campaign=wave-N-everyone`, with N set per wave |

Attribution: every link to seasonallyliving.com carries `utm_campaign=wave-N-<segment>` so the site tags it `LIST_WAVE` under `docs/crm/source-standard.md`. Do not use `utm_source=ghost` or `note` (that would tag it `GHOST_SEGMENT`).

## Send rules (carried from Plan v4/v5, owned by TOL-2899)

- Seed batch of 50 to 100 first, then judge. Stop and fix if bounce is over 5%, complaints over 0.1% or unsubscribes over 2%.
- No review incentive in any email or call, and no review ask at all in this first set. (The review engine, TOL-2909, owns the unconditional ask.)
- No chemical or water-care discount as a lead, and no percent-off offers.
- December 15 to January 2 is peak mode: no new waves, and callbacks are paused (Plan v5 section 10).

## Email A: spa owners with a 5+ year-old tub

Subject: Your {{product_year}} {{product}}

```text
{{first_name}},

It's Cam at Seasonally Living. You bought a {{product}} from us in {{product_year}}, and I'd rather write to you myself than send a flyer.

A tub that's five or more years old is about where covers, pumps and heaters start to cost real money. If yours is running great, good. If you've wondered what it's worth or what it would take to move up, I can tell you.

Three things I can do:

- Give you credit for your old tub toward a new Cal Spa. [[TRADE-IN TERMS: Susan to confirm how the credit is set before this goes out]]
- Show you one of our certified pre-owned tubs. We inspect each one before it goes on the floor. [[WARRANTY ON CERTIFIED UNITS: Susan to confirm length and wording]]
- Set up a winter soak: come in on a cold day and get into a warm tub. No pressure at all.

If any of that sounds useful, reply with "tub" and a phone number, and Kimberly will call you for about two minutes. If you'd rather not hear from us, reply "no thanks" and I'll take you off.

Cam McNeill

--
Seasonally Living by Chim Chimney
1407 Maiden Ln, Wenatchee, WA 98801 | (509) 667-8833
Stop these emails: {{unsubscribe_url}}
```

## Email B: hearth owners

Subject: Before the next burn ban

```text
{{first_name}},

It's Cam at Seasonally Living. You bought a {{product}} from us, and with burn season here I wanted to write to you directly.

Two things worth knowing:

- We inspect venting and look over your stove, fireplace or insert before the cold sets in. It's easier to book now than in the first cold snap. [[INSPECTION PRICE OR "NO CHARGE": Cam to confirm]]
- When the county calls a burn ban, a wood stove that isn't EPA certified can't be lit. A gas or electric insert isn't covered by a burn ban, and it heats the same room. If your stove is more than 10 years old, it's worth a look.

If you'd like an inspection or just want to know your options, reply with "hearth" and a phone number, and Kimberly will call you for about two minutes. If you'd rather not hear from us, reply "no thanks" and I'll take you off.

Cam McNeill

--
Seasonally Living by Chim Chimney
1407 Maiden Ln, Wenatchee, WA 98801 | (509) 667-8833
Stop these emails: {{unsubscribe_url}}
```

## Email C: recent spa owners

Subject: Winter care for your {{product}}

```text
{{first_name}},

It's Cam at Seasonally Living. You got your {{product}} from us not long ago, and this is the first winter you'll have it. A few things I tell everyone:

- Keep the cover on and latched, and brush heavy snow off it. Wet snow is heavy.
- If the water isn't heating or a panel shows an error, call us before you open anything up.
- Your owner's manual has the details for your model. We're happy to go through it with you.

If nobody walked you through your tub when it was delivered, I'd like to. We do a short orientation for every buyer, and it's no charge. [[ORIENTATION: Cam to confirm length and that it is free for every buyer]] Reply with "orientation" and a phone number, and Kimberly will call you for about two minutes to set it up.

That's it. Nothing to buy. If you'd rather not hear from us, reply "no thanks" and I'll take you off.

Cam McNeill

--
Seasonally Living by Chim Chimney
1407 Maiden Ln, Wenatchee, WA 98801 | (509) 667-8833
Stop these emails: {{unsubscribe_url}}
```

## Email D: everyone (opt-in second)

Subject: A short note from us, once a month?

```text
{{first_name}},

It's Cam again. I wrote last week, and I'll leave it there.

If you'd like a short note from us once a month, with what's worth doing that month in your hot tub, stove or yard, you can sign up here:

{{note_signup_url}}

You'll get one email to confirm, and nothing else until you do. We send at most one a month, and we never sell your email. If you don't click, you won't hear from us.

Cam McNeill

--
Seasonally Living by Chim Chimney
1407 Maiden Ln, Wenatchee, WA 98801 | (509) 667-8833
Stop these emails: {{unsubscribe_url}}
```

## Needs a yes (Jeramey, then Cam)

1. **5+ years: decided.** Jeramey kept 5+ for Email A on 2026-11-15, over Plan v5's 7+ for the phone list. Nothing to answer; the checker now fails if the rule drifts.
2. **Trade-in credit, certified warranty, inspection price, orientation length.** All four are placeholders. Nothing in the drafts states a dollar figure or a warranty length, because no source in the repo or the plan does.
3. **"Winter soak".** Read as an invitation to sit in a warm demo tub in the showroom. Cam to confirm there is a filled tub to soak in.
4. **Burn-ban sentence.** Written from the plan's Washington Ecology burn-ban note (Stage 1 bars uncertified stoves; gas and electric aren't wood smoke). Cam to confirm it matches what the county says, and the "more than 10 years old" line.
5. **Scope.** Email B offers venting inspection and a look at the unit only. No chimney sweeps or liners (out of scope, TOL-3325).
6. **Sender and reply address.** Which mailbox Cam sends from, and who watches replies so a "no thanks" is honoured the same day. Needs TOL-2896.
7. **Recent means 24 months.** A guess. Susan to confirm.
