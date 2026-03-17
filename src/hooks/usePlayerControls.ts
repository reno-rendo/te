"use client";

import { useState, useEffect, useCallback } from "react";

export function usePlayerControls(timeout = 3000) {
  const [visible, setVisible] = useState(true);

  const showControls = useCallback(() => {
    setVisible(true);
  }, []);

  const hideControls = useCallback(() => {
    setVisible(false);
  }, []);

  useEffect(() => {
    if (!visible) return;

    const timer = setTimeout(() => {
      setVisible(false);
    }, timeout);

    return () => clearTimeout(timer);
  }, [visible, timeout]);

  const toggleControls = useCallback(() => {
    setVisible((prev) => !prev);
  }, []);

  const handleUserInteraction = useCallback(() => {
    showControls();
  }, [showControls]);

  return {
    visible,
    showControls,
    hideControls,
    toggleControls,
    handleUserInteraction,
  };
}
