// Copy for /pre-owned/sell (sell or trade in an old hot tub). Lives in code for now.
// Every line below is checked against what the site already says (trade-ins, "we haul the old one away",
// "straight number", reply within one business day). Anything we have not confirmed is marked TODO-confirm.
export const SELL_FAQ: { q: string; a: string }[] = [
  {
    q: "Will you take my old hot tub if it doesn't work?",
    a: "Send us what you know and a few photos. We look at every tub, and we'll tell you straight whether it's worth bringing back to life or not. Some tubs are worth fixing and some aren't, and we'll tell you which.", // TODO-confirm: what happens with a tub that is not worth fixing (scrap or decline).
  },
  {
    q: "What will you pay for my hot tub?",
    a: "It depends on the make, age and condition, so we don't quote a number sight unseen. After we see your photos we'll give you a straight number. You can sell it to us or put its value toward a new Cal Spas tub or a pre-owned spa.", // TODO-confirm: cash purchase vs trade credit only.
  },
  {
    q: "Do you really haul it away?",
    a: "Yes, hauling the old tub away is part of how we work with trade-ins. Tell us where it is and we'll sort out the pickup with you before anyone shows up.", // TODO-confirm: haul-away fee (if any), distance limits, and who disconnects the power.
  },
  {
    q: "What should I do about the power?",
    a: "Please switch the spa's breaker off before anything else, and leave the wiring as it is. We'll tell you exactly what we need done before pickup day.",
  },
  {
    q: "What do you need from me to get started?",
    a: "The brand and model if you know it, roughly how old it is, how many people it seats, what's wrong with it (if anything), and where it is. Photos help most. You can send them after you submit the form by replying to our email or sending them to the shop.",
  },
  {
    q: "Do you only take Cal Spas?",
    a: "We're a Cal Spas dealer. Tell us what you have, whatever the make, and we'll tell you if it's a fit.", // TODO-confirm: which non-Cal brands the shop will accept.
  },
  {
    q: "How quickly will I hear back?",
    a: "We aim to call or email within one business day. If you'd rather talk, call the shop.",
  },
];

export const SELL_STEPS = [
  { title: "Tell us about it", body: "Brand, age, size and what shape it's in. It takes about two minutes." },
  { title: "Send photos", body: "A few pictures of the tub, the cabinet and the control panel help us give you a real answer." },
  { title: "Get a straight answer", body: "We give you a number and tell you plainly whether we can use the tub." },
  { title: "We pick it up", body: "We set a day with you and haul the old tub away." }, // TODO-confirm fees and range
];
