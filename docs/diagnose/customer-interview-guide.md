# Customer interview guide (TOL-2916)

**Status: DRAFT. Not approved. Not used on a real call.** Approval order: Susan (client), then Jeramey.

Twenty minutes, hard stop. Ten of these. Listen, do not sell. The answers are the product; a sale is not.

## Rules

- Open with who you are, that this is research, that it takes about twenty minutes, and that they can stop at any point.
- Ask permission to take notes. If they say no, write nothing about them but the date and "declined".
- Never quote a price, a trade-in value or a warranty. Say Susan or Cam confirms those after seeing the item.
- Never ask for a review, rating or referral, and never offer anything for the time.
- Read the questions as written the first time; follow up with "tell me more about that" rather than a new pitch.
- A leak, an electrical problem or a gas smell: stop, tell Cam the same day.
- Log the row in the tracker before the next call: kind `customer`, status, minutes, `notes_location`, `themes`.

## Open

> Hi, is this {{first_name}}? It's {{interviewer}}, calling for Seasonally Living in Wenatchee. We're asking a few customers how things went and what we could do better. It takes about twenty minutes and you can stop any time. Is now OK, and is it fine if I take notes?

If no: "No problem. When's a better time?" Write the time down and end the call. If they decline outright, mark `declined` and stop.

## Questions

- C1. What did you buy from us, and roughly when?
- C2. What was happening that made you decide to buy then?
- C3. Before you came to us, where else did you look, and what did you look at first?
- C4. What nearly stopped you from buying?
- C5. How did the buying go: the first visit or call, the quote, the delivery or install?
- C6. Which part would you change?
- C7. Since then, how has it worked out, and who did you turn to when you had a question?
- C8. What would you tell a neighbour who was thinking about the same thing?
- C9. What do you wish we sold or did that we do not?
- C10. Is there anything I should have asked and did not?

## Close

> That's everything. Thank you for your time; it helps us. If you have a question about your tub or stove, Kimberly is at the showroom. Take care.

## If they say stop

> Understood, thank you. We won't call again about this.

Set `status` to `declined` in the tracker and add the person to Susan's do-not-contact list.
