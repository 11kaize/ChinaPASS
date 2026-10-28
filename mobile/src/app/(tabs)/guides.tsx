import React, { useState } from "react";
import { router, type Href } from "expo-router";
import { useApp } from "../../state";
import { orderedScenes, content } from "../../content";
import { arrivalGuideTitle, arrivalGuideBody } from "../../arrival-guide";
import {
  Page,
  Button,
  Heading,
  Search,
  Surface,
  Row,
  Empty,
  Section,
} from "../../ui";
export default function Guides() {
  const { t, L } = useApp();
  const [query, setQuery] = useState("");
  const scenes = orderedScenes.filter((s) =>
    `${L(s.title)} ${L(s.subtitle)} ${s.id}`
      .toLowerCase()
      .includes(query.trim().toLowerCase()),
  );
  const groups = [
    {
      title: L({
        en: "Before departure",
        zh: "出发前",
        ja: "出発前",
        ko: "출발 전",
      }),
      rows: [
        { title: t("preparation"), path: "/preparation", icon: "prep" },
        ...content.shortGuides.map((g) => ({
          title: L(g.title),
          path: `/guide/${g.id}`,
          icon: "guides",
        })),
      ],
    },
    {
      title: L({
        en: "Daily essentials",
        zh: "日常事务",
        ja: "毎日の手続き",
        ko: "일상 필수 업무",
      }),
      rows: ["sim", "pay", "hotel", "food"].map((id) => {
        const scene = orderedScenes.find((s) => s.id === id)!;
        return {
          title: L(scene.title),
          subtitle: L(scene.subtitle),
          path: `/guide/${id}`,
          icon: id,
        };
      }),
    },
    {
      title: t("gettingAround"),
      rows: [
        {
          title: L({
            en: "Transport: taxi, metro and trains",
            zh: "交通：打车、地铁与火车",
            ja: "交通：タクシー・地下鉄・鉄道",
            ko: "교통: 택시·지하철·기차",
          }),
          path: "/transport",
          icon: "transport",
        },
      ],
    },
    {
      title: L({
        en: "When you need help",
        zh: "遇到问题时",
        ja: "困ったとき",
        ko: "도움이 필요할 때",
      }),
      rows: [
        { title: t("emergency"), path: "/guide/emergency", icon: "emergency" },
        { title: t("faq"), path: "/faq", icon: "info" },
      ],
    },
  ];
  return (
    <Page>
      <Heading
        title={L({
          en: "Find a task, solve it once.",
          zh: "找到任务，一次解决。",
          ja: "必要な手続きがすぐ見つかる。",
          ko: "필요한 업무를 찾아 해결하세요.",
        })}
        body={L({
          en: "Use the arrival checklist for your first day. Return here for a specific task, without repeating the whole journey.",
          zh: "第一天先看落地清单；之后来这里按任务查找，不必重复整个流程。",
          ja: "初日は到着チェックリストを使い、その後は必要な手続きだけを確認できます。",
          ko: "첫날은 도착 체크리스트를 이용하고 이후에는 필요한 업무만 찾아보세요.",
        })}
      />
      <Surface>
        <Row
          title={L(arrivalGuideTitle)}
          subtitle={L(arrivalGuideBody)}
          icon="customs"
          last
          onPress={() => router.push("/arrival")}
        />
      </Surface>
      <Search value={query} onChange={setQuery} label={t("searchGuides")} />
      {query.trim() ? (
        <>
          <Surface>
            {scenes.map((scene, i) => (
              <Row
                key={scene.id}
                title={L(scene.title)}
                subtitle={L(scene.subtitle)}
                icon={scene.id}
                last={i === scenes.length - 1}
                onPress={() => router.push(`/guide/${scene.id}`)}
              />
            ))}
          </Surface>
          {!scenes.length && (
            <Empty
              title={t("noResults")}
              body={t("noResultsBody")}
              icon="guides"
            />
          )}
          <Button
            secondary
            label={t("clearSearch")}
            onPress={() => setQuery("")}
          />
        </>
      ) : (
        groups.map((group) => (
          <Section key={group.title} title={group.title}>
            <Surface>
              {group.rows.map((row, i) => (
                <Row
                  key={row.path}
                  title={row.title}
                  subtitle={"subtitle" in row ? row.subtitle : undefined}
                  icon={row.icon}
                  last={i === group.rows.length - 1}
                  onPress={() => router.push(row.path as Href)}
                />
              ))}
            </Surface>
          </Section>
        ))
      )}
    </Page>
  );
}
