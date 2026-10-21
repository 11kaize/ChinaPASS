import React from "react";
import { View } from "react-native";
import { router } from "expo-router";
import { useApp } from "../state";
import { content } from "../content";
import { transportModes } from "../domain/navigation";
import { Page, Heading, Surface, Row, Section, Txt, Icon } from "../ui";
import { ServiceActions } from "../service-actions";
export default function Transport() {
  const { prefs } = useApp();
  const zh = prefs.language === "zh";
  return (
    <Page back title={zh ? "交通" : "Transport"}>
      <Heading
        title={zh ? "下一站，轻松抵达。" : "Find your way."}
        body={
          zh
            ? "打车、地铁与火车，都在这里。"
            : "Taxis, metros and trains. One place to start."
        }
      />
      {transportModes.map((mode) => (
        <Section key={mode.id} title={zh ? mode.zh : mode.title}>
          <Surface glass>
            <Row
              title={zh ? mode.zh : mode.title}
              subtitle={
                zh
                  ? "步骤、注意事项与备用方案"
                  : "Steps, practical tips and a backup plan"
              }
              icon={mode.icon}
              last
              onPress={() => router.push(`/guide/${mode.id}`)}
            />
          </Surface>
          <ServiceActions
            actions={content.scenes.find((s) => s.id === mode.id)!.actions}
          />
        </Section>
      ))}
      <Surface glass>
        <Row
          title={zh ? "机场与车站" : "Airports & stations"}
          subtitle={
            zh ? "出发前确认中文站名" : "Check the Chinese name before you go"
          }
          icon="address"
          last
          onPress={() => router.push("/city")}
        />
      </Surface>
      <View style={{ flexDirection: "row", gap: 8, marginTop: 16 }}>
        <Icon name="info" size={16} />
        <Txt variant="caption">
          {zh
            ? "跳转到服务商后，由服务商完成预订与支付。"
            : "Bookings and payments happen with the service provider."}
        </Txt>
      </View>
    </Page>
  );
}
