import React from "react";
import { router } from "expo-router";
import { useApp } from "../state";
import { content, orderedScenes } from "../content";
import { arrivalText } from "../arrival";
import { Page, Heading, Section, Surface, Row, Txt, Notice } from "../ui";
export default function Arrival() {
  const { prefs, L, colors } = useApp();
  const port = content.ports.find((p) => p.id === prefs.arrivalPort);
  return <Page back title={arrivalText("yourRoute",prefs.language)}>
    <Heading title={arrivalText("yourRoute",prefs.language)} />
    {port && <Notice text={port.zh} icon="customs" />}
    {port && port.kind !== "air" && <Notice text={prefs.language === "zh" ? "铁路、海港的流程与机场可能不同。机场行李步骤未必适用，请遵循现场指引。" : "Rail and ferry arrivals can differ from airports. Airport baggage steps may not apply; follow staff instructions."} />}
    {[["routeArrivalDay",orderedScenes.slice(0,5)],["routeLater",orderedScenes.slice(5,8)]] .map(([label,scenes]) => <Section key={label as string} title={arrivalText(label as string,prefs.language)}>
      <Surface>{(scenes as typeof orderedScenes).map((scene,i,all) => <Row key={scene.id} title={L(scene.title)} subtitle={L(scene.subtitle)} icon={scene.id} last={i===all.length-1} trailing={prefs.arrivalTask === scene.id ? <Txt variant="caption" color={colors.accent}>{arrivalText("youAreHere",prefs.language)}</Txt> : undefined} onPress={() => router.push(`/guide/${scene.id}`)} />)}</Surface>
    </Section>)}
  </Page>;
}
