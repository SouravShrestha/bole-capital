import { describe, expect, it } from "vitest";
import { OG_IMAGE, SITE_NAME, pageMetadata } from "./seo";

describe("pageMetadata", () => {
  const meta = pageMetadata({ title: "About", description: "d", path: "/about" });

  it("sets a self-referencing canonical", () => {
    expect(meta.alternates?.canonical).toBe("/about");
  });

  it("includes the shared OG image and a large Twitter card", () => {
    expect(meta.openGraph?.images).toEqual([OG_IMAGE]);
    expect(meta.twitter).toMatchObject({ card: "summary_large_image", images: [OG_IMAGE.url] });
  });

  it("suffixes social titles with the site name", () => {
    expect(meta.openGraph?.title).toBe(`About - ${SITE_NAME}`);
  });
});
