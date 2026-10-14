import React, { useState } from "react";
import { View } from "react-native";
import { useApp } from "../state";
import { content } from "../content";
import {
  Page,
  Heading,
  Surface,
  Tap,
  Icon,
  Txt,
  styles,
  confirmAction,
  Button,
} from "../ui";
export default function Preparation() {
  const { colors, prefs, update, t, L } = useApp();
  const [expanded, setExpanded] = useState<string | null>(null);
  return (
    <Page back title={t("preparation")}>
      <Heading title={t("preparation")} body={t("prepBody")} />
      <Txt variant="caption" color={colors.accent} style={{ marginBottom: 16 }}>
        {prefs.prep.length} / {content.prep.length} {t("completed")}
      </Txt>
      <Surface>
        {content.prep.map((p, i) => {
          const checked = prefs.prep.includes(p.id);
          return (
            <View
              key={p.id}
              style={{
                paddingHorizontal: 18,
                borderBottomWidth: i === content.prep.length - 1 ? 0 : 0.5,
                borderBottomColor: colors.line,
              }}
            >
              <View style={[styles.row, { paddingVertical: 19 }]}>
                <Tap
                  label={`${L(p.title)}: ${checked ? t("completed") : t("ready")}`}
                  selected={checked}
                  onPress={() =>
                    update({
                      prep: checked
                        ? prefs.prep.filter((id) => id !== p.id)
                        : [...prefs.prep, p.id],
                    })
                  }
                  style={{
                    minWidth: 44,
                    minHeight: 44,
                    justifyContent: "center",
                    paddingRight: 7,
                  }}
                >
                  <Icon
                    name={checked ? "checked" : "unchecked"}
                    size={28}
                    color={checked ? colors.accent : colors.secondary}
                  />
                </Tap>
                <Tap
                  label={L(p.title)}
                  onPress={() => setExpanded(expanded === p.id ? null : p.id)}
                  style={{ flex: 1 }}
                >
                  <Txt variant="label" style={{ maxWidth: 260 }}>
                    {L(p.title)}
                  </Txt>
                </Tap>
              </View>
              {expanded === p.id && (
                <Txt color={colors.secondary} style={{ paddingBottom: 19 }}>
                  {L(p.body)}
                </Txt>
              )}
            </View>
          );
        })}
      </Surface>
      <View style={{ marginTop: 24 }}>
        <Button
          label={t("reset")}
          secondary
          icon="close"
          onPress={() =>
            confirmAction(
              t("reset"),
              t("preparation"),
              () => update({ prep: [] }),
              t,
            )
          }
        />
      </View>
    </Page>
  );
}
