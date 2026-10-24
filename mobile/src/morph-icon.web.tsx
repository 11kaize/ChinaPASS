import React, { useEffect, useRef } from "react";
import { useIsFocused } from "expo-router";
import { MorphIcon, type MorphHandle } from "morphicons/react";
import type { IconNode } from "morphicons";
import { useMotionActive, useReducedMotion } from "./motion";
import { iconSpring } from "./icon-morph-runtime";

export const MorphGlyph = React.memo(function MorphGlyph({
  shape,
  size,
  color,
}: {
  shape: IconNode;
  size: number;
  color: string;
}) {
  const reduced = useReducedMotion();
  const focused = useIsFocused();
  const active = useMotionActive();
  const quiet = reduced || !focused || !active;
  const ref = useRef<MorphHandle>(null);
  useEffect(() => {
    if (quiet) ref.current?.set(shape);
  }, [quiet, shape]);
  return (
    <MorphIcon
      ref={ref}
      icon={shape}
      size={size}
      color={color}
      spring={iconSpring}
      reducedMotion={quiet ? "always" : "never"}
      aria-hidden="true"
      focusable="false"
      style={{ display: "block", flexShrink: 0, pointerEvents: "none" }}
    />
  );
});
