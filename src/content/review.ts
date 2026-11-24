import { IMG } from "./pages";
import type { Seo } from "./types";

// /review landing (post-purchase QR and day-7 email). Code defaults; Sanity doc id "reviewPage" overrides.
export type ReviewPageContent = {
  _type: "reviewPage";
  seo: Seo;
  hero: {
    kicker: string;
    title: string;
    lead: string;
    googlePlaceholderNote: string;
    policyNote: string;
  };
  feedback: {
    kicker: string;
    title: string;
    body: string;
  };
  photo: { image: string; alt: string };
};

export const REVIEW_PAGE: ReviewPageContent = {
  _type: "reviewPage",
  seo: {
    title: "Thank you",
    description:
      "Thank you for choosing Seasonally Living in Wenatchee. Leave a Google review, or tell Cam directly how we did.",
  },
  hero: {
    kicker: "Thank you",
    title: "Thank you for trusting us with your home.",
    lead:
      "Cam, Susan and the crew are grateful you chose a local, family-run shop. If you have a minute, a Google review helps your neighbors find us, and it's the best way to tell us how we did, whatever the answer is.",
    googlePlaceholderNote: "On the Google page that opens, tap Reviews, then Write a review. ",
    policyNote:
      "It takes about a minute. Good, bad or in between, we read every one. We don't offer anything in return for a review, and we never ask anyone to leave only the good ones.",
  },
  feedback: {
    kicker: "Tell Cam directly",
    title: "Want Cam to hear it too?",
    body:
      "If something could have gone better, or you have a question, this note goes straight to Cam, not to a review site. It's in addition to a public review, never instead of one. You're welcome to post either way.",
  },
  photo: {
    image: IMG.mcneillFamily,
    alt: "Cam and Susan McNeill with their family",
  },
};