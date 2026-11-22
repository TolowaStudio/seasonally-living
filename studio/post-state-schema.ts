import { defineField, defineType } from "sanity";

// Automation-owned posting record for one journal post. Editors never open or edit this type in the
// Studio; n8n and the approve route read and write it. Keeps channel links and errors off the post
// document so an unpublished Studio edit cannot wipe them on publish.

const resultUrl = (name: string, title: string) =>
  defineField({ name, title, type: "url", readOnly: true, validation: (r) => r.uri({ scheme: ["https"] }) });

export const postStateType = defineType({
  name: "postState",
  title: "Post state (automation)",
  type: "document",
  readOnly: true,
  fields: [
    defineField({
      name: "postId",
      title: "Post document id",
      type: "string",
      readOnly: true,
      validation: (r) => r.required(),
    }),
    resultUrl("facebookUrl", "Facebook post"),
    resultUrl("instagramUrl", "Instagram post"),
    resultUrl("gbpUrl", "Google post"),
    defineField({ name: "postedAt", type: "datetime", readOnly: true }),
    defineField({ name: "lastError", title: "Last problem", type: "text", rows: 3, readOnly: true }),
    defineField({
      name: "claimedAt",
      title: "Claimed by automation",
      type: "datetime",
      readOnly: true,
      description: "Set while an n8n run is posting; cleared when the run finishes.",
    }),
  ],
  preview: {
    select: { postId: "postId", postedAt: "postedAt" },
    prepare: ({ postId, postedAt }: { postId?: string; postedAt?: string }) => ({
      title: postId ? `State for ${postId}` : "Post state",
      subtitle: postedAt ? postedAt.slice(0, 10) : "Not posted yet",
    }),
  },
});

/** Sanity document id for the postState row tied to a post document id. */
export function postStateDocumentId(postId: string): string {
  return `postState.${postId}`;
}