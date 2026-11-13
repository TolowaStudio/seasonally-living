"use client";

import { useEffect } from "react";
import { captureAttribution } from "@/lib/attribution";

/** Records first/last-touch attribution in a first-party cookie on every page load. Renders nothing. */
export default function AttributionCapture() {
  useEffect(() => {
    captureAttribution();
  }, []);
  return null;
}
