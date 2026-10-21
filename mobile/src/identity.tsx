import React from "react";
import type { Tier } from "./domain/membership";
import { Txt } from "./ui";
import { useApp } from "./state";

/** Membership is expressed only through the display name, without a badge. */
export function Identity({
  name,
  tier,
  compact = false,
}: {
  name: string;
  tier: Tier;
  compact?: boolean;
}) {
  const { colors, isDark } = useApp();
  const rainbow = isDark
    ? ["#96C7FF", "#C4AEFF", "#FFAFE1", "#FFB6A6", "#F8D489"]
    : ["#2461AE", "#7351B1", "#A33F80", "#AD513D", "#856318"];
  return (
    <Txt
      style={{
        fontSize: compact ? 13 : 24,
        fontWeight: "700",
        color: tier === "plus" ? (isDark ? "#CCD5E2" : "#65748A") : colors.ink,
      }}
    >
      {tier === "pro"
        ? Array.from(name).map((char, i) => (
            <Txt
              key={i}
              style={{
                color: rainbow[i % rainbow.length],
                fontSize: compact ? 13 : 24,
                fontWeight: "700",
              }}
            >
              {char}
            </Txt>
          ))
        : name}
    </Txt>
  );
}
