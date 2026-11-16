# Kimberly's callback script (TOL-2898)

**Status: DRAFT. Not approved. Nothing here has been used on a real call.** Approval order: Jeramey, then Cam.

Two minutes a call, hard stop. About 130 spoken words a minute makes 260 words the most anyone can hear in the call, so the lines Kimberly says on any one path (open, one branch, close) stay under that. `scripts/check-outreach-copy.ts` counts them on every PR.

## Who gets called

Only people who replied to Cam's email asking for a call, and whose reply is on the hot list (`hot-list-format.md`). Nobody is called who did not reply, and nobody on Susan's do-not-contact list or with `dnc = Y`. Their reply is their request for the call, so it is the permission for it.

## Rules

- Calls happen in Kimberly's normal workday, never before 9am or after 5pm.
- Two minutes, then wrap up. If they want more, book a visit with Cam or Susan.
- Never quote a price, a trade-in value or a warranty on the phone. Say Susan or Cam confirms after seeing the tub.
- No review requests and nothing offered in exchange for one.
- Two tries a person: one call, one voicemail, then one more call a few days later. Then mark `no answer` and stop.
- Any mention of a leak, an electrical problem or a safety concern: book service and tell Cam the same day.
- Log it before the next call (about 30 seconds): outcome, next step, minutes. The minutes feed Kimberly's minutes log (TOL-3353).
- December 15 to January 2: callbacks paused (peak mode).

## Open

> Hi, is this {{first_name}}? It's Kimberly at Seasonally Living in Wenatchee.
> Cam emailed you and you wrote back, so I'm calling. Do you have two minutes?

If no: "No problem. When's a better time?" Write the time on the list and end the call.

## Branch: older tub

> Which tub do you have, and about how old is it? Is it running the way you'd like?
> If you ever want to move up, we can give you credit for it toward a new Cal Spa, or show you one of our certified pre-owned tubs. Susan or Cam confirms the number once they've seen yours.
> Would you like to come in and soak in a warm one this month?

## Branch: hearth

> What do you heat with, a stove, a fireplace or an insert? About how old is it?
> We can inspect the venting and look over the unit before the next burn ban. A gas or electric insert keeps heating on ban days, so if yours is a wood stove that's more than ten years old, it's worth a look.
> Would you like me to book an inspection?

## Branch: new tub care

> How's the tub treating you? Anything not working the way it should?
> If nobody walked you through it at delivery, we do a short orientation for every buyer. Would you like me to book one?

## Close

> I'll put you down for that. We're at 1407 Maiden Lane, next to Home Depot. If anything changes, call us at 667-8833. Thanks, {{first_name}}.

If they did not want anything: "Understood. If you ever want a hand, you know where we are. Thanks for your time."

## If they say stop

> Understood. I'll take you off right now. Sorry to have bothered you.

Set `dnc = Y` on the list the same day and tell Susan so her do-not-contact list matches. Never call again, and never email again.

## Voicemail (15 seconds)

> Hi {{first_name}}, it's Kimberly at Seasonally Living, returning your note to Cam. Call me at 667-8833 when it suits you. No hurry. Thanks.

## Outcome codes (for the hot list)

| `outcome` | Meaning |
| --- | --- |
| `visit-booked` | They will come in (winter soak, trade-in look, inspection) |
| `service-booked` | Inspection, orientation or repair booked |
| `trade-in-interest` | Wants a trade-in number but did not book |
| `not-now` | Maybe later; write when in `next_date` |
| `no-answer` | Two tries done |
| `stop` | Asked to stop; also set `dnc = Y` |
