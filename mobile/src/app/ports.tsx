import { locationLabel } from "../geography";
import { backOrReplace } from "../navigation-back";
import React, { useState } from "react";
import { router } from "expo-router";
import { content } from "../content";
import { useApp } from "../state";
import {
  arrivalText,
  portCityLabel,
  portKindLabel,
  portSelection,
} from "../arrival";
import {
  Page,
  Heading,
  Search,
  Chips,
  Surface,
  Row,
  Icon,
  Notice,
} from "../ui";
export default function Ports() {
  const { prefs, update, t } = useApp();
  const [query, setQuery] = useState(""),
    [kind, setKind] = useState("all");
  const q = query.trim().toLowerCase();
  const ports = content.ports.filter(
    (p) =>
      (kind === "all" || kind === p.kind) &&
      `${p.zh} ${p.iata || ""} ${p.city || ""} ${p.cityZh || ""} ${(["en", "zh", "ja", "ko"] as const).map((lang) => portCityLabel(p, lang)).join(" ")}`
        .toLowerCase()
        .includes(q),
  );
  return (
    <Page back title={arrivalText("whereLanded", prefs.language)}>
      <Heading
        title={arrivalText("whereLanded", prefs.language)}
        body={arrivalText("whereLandedHint", prefs.language)}
      />
      <Search
        label={
          prefs.language === "zh"
            ? "搜索口岸、城市或机场代码"
            : "Search port, city or airport code"
        }
        value={query}
        onChange={setQuery}
      />
      <Chips
        value={kind}
        onChange={setKind}
        items={[
          { id: "all", label: t("all") },
          ...(["air", "rail", "sea"] as const).map((id) => ({
            id,
            label: arrivalText(
              { air: "portAir", rail: "portRail", sea: "portSea" }[id],
              prefs.language,
            ),
          })),
        ]}
      />
      <Surface>
        {ports.map((p, i) => (
          <Row
            key={p.id}
            title={`${portCityLabel(p, prefs.language)}${p.iata ? ` · ${p.iata}` : ""}`}
            subtitle={`${locationLabel(p.zh, prefs.language)}\n${portKindLabel(p, prefs.language)}`}
            icon={
              p.kind === "rail"
                ? "train"
                : p.kind === "sea"
                  ? "address"
                  : "customs"
            }
            trailing={
              prefs.arrivalPort === p.id ? <Icon name="checked" /> : undefined
            }
            last={i === ports.length - 1}
            onPress={() => {
              update(portSelection(p));
              backOrReplace(router, "/arrival");
            }}
          />
        ))}
      </Surface>
      {!ports.length && <Notice text={t("noResults")} />}
      <Notice
        text={
          prefs.language === "zh"
            ? "这里列出常用口岸，不是完整名单，也不代表签证或免签资格。"
            : "Common arrival ports, not a complete list or confirmation of visa eligibility."
        }
      />
    </Page>
  );
}
