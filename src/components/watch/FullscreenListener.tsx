"use client";

import { useEffect } from "react";

export function FullscreenListener() {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      const activeTagName = document.activeElement?.tagName.toLowerCase();
      if (activeTagName === "input" || activeTagName === "textarea") {
        return;
      }

      if (e.key.toLowerCase() === "f") {
        const video = document.querySelector("video");
        if (video) {
          const doc = document as any;
          const isFullscreen =
            doc.fullscreenElement ||
            doc.webkitFullscreenElement ||
            doc.mozFullScreenElement ||
            doc.msFullscreenElement;

          if (!isFullscreen) {
            const elem = document.documentElement as any;
            if (elem.requestFullscreen) {
              elem.requestFullscreen().catch(console.error);
            } else if (elem.webkitRequestFullscreen) { /* Safari */
              elem.webkitRequestFullscreen();
            } else if (elem.msRequestFullscreen) { /* IE11 */
              elem.msRequestFullscreen();
            }
          } else {
            if (doc.exitFullscreen) {
              doc.exitFullscreen().catch(console.error);
            } else if (doc.webkitExitFullscreen) { /* Safari */
              doc.webkitExitFullscreen();
            } else if (doc.msExitFullscreen) { /* IE11 */
              doc.msExitFullscreen();
            }
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return null;
}
