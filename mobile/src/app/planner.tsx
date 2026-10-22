import React, { useRef, useState } from "react";
import { View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import * as Crypto from "expo-crypto";
import { useApp } from "../state";
import { savedPlaces } from "../places";
import { backOrReplace } from "../navigation-back";
import {
  chinaToday,
  itineraryLimit,
  sortItinerary,
  validateItinerary,
  type ItineraryItem,
  type ItineraryDraft,
} from "../itinerary";
import {
  Page,
  Heading,
  Surface,
  Section,
  Txt,
  Icon,
  Tap,
  Button,
  Chips,
  Field,
  Notice,
  Empty,
  confirmAction,
} from "../ui";

function PlannerEditor({
  item,
  onSave,
  onCancel,
}: {
  item?: ItineraryItem;
  onSave: (draft: ItineraryDraft) => string | null;
  onCancel: () => void;
}) {
  const { prefs, colors } = useApp();
  const zh = prefs.language === "zh";
  const places = savedPlaces(prefs);
  const [title, setTitle] = useState(item?.title || "");
  const [date, setDate] = useState(item?.date || chinaToday());
  const [time, setTime] = useState(item?.time || "09:00");
  const [placeId, setPlaceId] = useState<string | null>(item?.placeId || null);
  const [note, setNote] = useState(item?.note || "");
  const [error, setError] = useState("");
  const saving = useRef(false);
  const missingPlace = Boolean(
    placeId && !places.some((place) => place.id === placeId),
  );
  const submit = () => {
    if (saving.current) return;
    const draft = {
      title: title.trim(),
      date: date.trim(),
      time: time.trim(),
      placeId,
      note: note.trim(),
    };
    const issue = validateItinerary(draft);
    if (issue) {
      const messages = {
        title: zh
          ? "请填写 1–100 个字符的事项名称。"
          : "Use an event title of 1–100 characters.",
        date: zh
          ? "请填写真实日期，例如 2026-10-25。"
          : "Enter a real date, for example 2026-10-25.",
        time: zh
          ? "请使用 24 小时制，例如 14:30。"
          : "Use 24-hour time, for example 14:30.",
        note: zh
          ? "备注不能超过 500 个字符。"
          : "Keep your note within 500 characters.",
      };
      setError(messages[issue]);
      return;
    }
    saving.current = true;
    const failure = onSave(draft);
    if (failure) {
      setError(failure);
      saving.current = false;
    }
  };
  return (
    <Page back title={zh ? "行程本" : "My planner"}>
      <Heading
        title={
          item
            ? zh
              ? "编辑行程事项"
              : "Edit an event"
            : zh
              ? "为下一站留个位置。"
              : "Make room for your next stop."
        }
        body={
          zh
            ? "所有日期与时间均为中国当地时间（UTC+8）。"
            : "All dates and times use China local time (UTC+8)."
        }
      />
      <Field
        label={zh ? "事项名称" : "Event title"}
        value={title}
        onChangeText={setTitle}
        maxLength={100}
        placeholder={zh ? "例如：酒店入住" : "For example: hotel check-in"}
      />
      <View style={{ flexDirection: "row", gap: 12 }}>
        <View style={{ flex: 1 }}>
          <Field
            label={zh ? "日期" : "Date"}
            value={date}
            onChangeText={setDate}
            maxLength={10}
            placeholder="YYYY-MM-DD"
            autoCorrect={false}
            autoCapitalize="none"
            hint="YYYY-MM-DD"
          />
        </View>
        <View style={{ flex: 1 }}>
          <Field
            label={zh ? "时间" : "Time"}
            value={time}
            onChangeText={setTime}
            maxLength={5}
            placeholder="HH:mm"
            autoCorrect={false}
            autoCapitalize="none"
            hint="00:00–23:59"
          />
        </View>
      </View>
      <Section title={zh ? "关联地点（可选）" : "Link a place (optional)"}>
        <Chips
          value={placeId || "none"}
          onChange={(id) => setPlaceId(id === "none" ? null : id)}
          items={[
            { id: "none", label: zh ? "不关联地点" : "No place" },
            ...places.map((place) => ({
              id: place.id,
              label: place.name || place.address,
            })),
            ...(missingPlace && placeId
              ? [
                  {
                    id: placeId,
                    label: zh ? "原地点已删除" : "Original place removed",
                  },
                ]
              : []),
          ]}
        />
        {missingPlace && (
          <Notice
            text={
              zh
                ? "原地址已删除。请选择其他地点，或改为不关联；事项仍会保留。"
                : "The original place was removed. Choose another place or No place. The event remains saved."
            }
          />
        )}
        <Button
          secondary
          icon="address"
          label={zh ? "管理地址钱包" : "Manage address wallet"}
          onPress={() => router.push("/address")}
        />
      </Section>
      <Field
        label={zh ? "备注（可选）" : "Note (optional)"}
        value={note}
        onChangeText={setNote}
        maxLength={500}
        multiline
        style={{ minHeight: 90, textAlignVertical: "top" }}
        placeholder={
          zh
            ? "到达方式、集合点或需要记住的小事"
            : "Meeting point, arrival notes or something to remember"
        }
      />
      {Boolean(error) && <Notice danger text={error} />}
      <Button
        icon="save"
        label={zh ? "保存事项" : "Save event"}
        onPress={submit}
      />
      <View style={{ height: 12 }} />
      <Button
        secondary
        label={zh ? "取消编辑" : "Cancel editing"}
        onPress={onCancel}
      />
      <Txt variant="caption" color={colors.secondary} style={{ marginTop: 18 }}>
        {zh
          ? "仅保存在本机，不会生成预订、闹钟或系统日历提醒。"
          : "Saved on this device only. This does not create a booking, alarm or system calendar reminder."}
      </Txt>
    </Page>
  );
}

export default function Planner() {
  const { prefs, update, colors, t } = useApp();
  const zh = prefs.language === "zh";
  const items: ItineraryItem[] = prefs.itinerary || [];
  const places = savedPlaces(prefs);
  const { edit } = useLocalSearchParams<{ edit?: string }>();
  const editing = typeof edit === "string" ? edit : null;
  const setEditing = (id: string | null) => {
    if (id) router.push({ pathname: "/planner", params: { edit: id } });
    else backOrReplace(router, "/planner");
  };
  const [filter, setFilter] = useState("all");
  const today = chinaToday();
  const selected = items.find((item) => item.id === editing);
  if (editing && (editing === "new" || selected))
    return (
      <PlannerEditor
        key={editing}
        item={selected}
        onCancel={() => setEditing(null)}
        onSave={(draft) => {
          if (editing === "new" && items.length >= itineraryLimit)
            return zh
              ? "最多保存 100 个事项，请先删除不需要的内容。"
              : "You can save up to 100 events. Remove an event before adding another.";
          const item: ItineraryItem = {
            ...draft,
            id: selected?.id || Crypto.randomUUID(),
            done: selected?.done || false,
          };
          update({
            itinerary: selected
              ? items.map((old) => (old.id === item.id ? item : old))
              : [...items, item],
          });
          setEditing(null);
          return null;
        }}
      />
    );
  const visible = sortItinerary(
    items.filter((item) =>
      filter === "done" ? item.done : filter === "todo" ? !item.done : true,
    ),
  );
  const dates = [...new Set(visible.map((item) => item.date))];
  return (
    <Page back title={zh ? "行程本" : "My planner"}>
      <Heading
        title={zh ? "把每一站安排明白。" : "Your next stops, in order."}
        body={
          zh
            ? "日期与时间均为中国当地时间（UTC+8），离线可用。"
            : "Dates and times use China local time (UTC+8). Available offline."
        }
      />
      <Surface style={{ padding: 18, gap: 10, marginBottom: 18 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Txt variant="subheading">
            {zh ? "今天" : "Today"} · {today}
          </Txt>
          <Icon name="prep" size={20} />
        </View>
        <Txt variant="caption" color={colors.secondary}>
          {items.filter((item) => !item.done && item.date === today).length}{" "}
          {zh
            ? "项今日待办"
            : items.filter((item) => !item.done && item.date === today)
                  .length === 1
              ? "event left today"
              : "events left today"}{" "}
          · {items.length}/{itineraryLimit} {zh ? "事项" : "events"}
        </Txt>
        <Button
          icon="plus"
          label={zh ? "添加行程事项" : "Add an event"}
          disabled={items.length >= itineraryLimit}
          onPress={() => setEditing("new")}
        />
      </Surface>
      <Chips
        value={filter}
        onChange={setFilter}
        items={[
          { id: "all", label: zh ? "全部" : "All" },
          { id: "todo", label: zh ? "未完成" : "To do" },
          { id: "done", label: zh ? "已完成" : "Done" },
        ]}
      />
      {items.length >= itineraryLimit && (
        <Notice
          text={
            zh
              ? "已达到 100 个事项的本机上限，可编辑或删除已有事项。"
              : "You have reached the 100-event limit. Edit or remove existing events."
          }
        />
      )}
      {dates.map((date) => (
        <Section
          key={date}
          title={`${date}${date === today ? (zh ? " · 今天" : " · Today") : date < today ? (zh ? " · 过去的日期" : " · Past date") : ""}`}
        >
          {visible
            .filter((item) => item.date === date)
            .map((item) => {
              const place = places.find((saved) => saved.id === item.placeId);
              return (
                <Surface
                  key={item.id}
                  style={{ padding: 17, gap: 11, marginBottom: 12 }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 11,
                    }}
                  >
                    <Tap
                      label={`${item.done ? (zh ? "改为未完成" : "Mark incomplete") : zh ? "标记完成" : "Mark done"}: ${item.title}`}
                      selected={item.done}
                      onPress={() =>
                        update({
                          itinerary: items.map((old) =>
                            old.id === item.id
                              ? { ...old, done: !old.done }
                              : old,
                          ),
                        })
                      }
                      style={{
                        minWidth: 44,
                        minHeight: 44,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Icon
                        name={item.done ? "checked" : "unchecked"}
                        size={23}
                      />
                    </Tap>
                    <View style={{ flex: 1, gap: 4 }}>
                      <Txt variant="caption" color={colors.accent}>
                        {item.time} · UTC+8
                        {item.done ? (zh ? " · 已完成" : " · Done") : ""}
                      </Txt>
                      <Txt
                        variant="subheading"
                        style={{
                          textDecorationLine: item.done
                            ? "line-through"
                            : "none",
                        }}
                      >
                        {item.title}
                      </Txt>
                    </View>
                  </View>
                  {place ? (
                    <>
                      <Txt variant="caption" color={colors.secondary}>
                        {place.name || place.address}
                      </Txt>
                      <Button
                        secondary
                        icon="cards"
                        label={
                          zh ? "出示中文地点卡" : "Show Chinese place card"
                        }
                        onPress={() =>
                          router.push({
                            pathname: "/card",
                            params: { kind: "place", id: place.id },
                          })
                        }
                      />
                    </>
                  ) : item.placeId ? (
                    <Notice
                      text={
                        zh
                          ? "关联地点已从地址钱包删除。事项仍保留，可编辑并重新选择地点。"
                          : "The linked place was removed from your wallet. Your event is still here; edit it to choose another place."
                      }
                    />
                  ) : null}
                  {Boolean(item.note) && (
                    <Txt selectable color={colors.secondary}>
                      {item.note}
                    </Txt>
                  )}
                  <View style={{ flexDirection: "row", gap: 10 }}>
                    <View style={{ flex: 1 }}>
                      <Button
                        secondary
                        label={zh ? "编辑" : "Edit"}
                        onPress={() => setEditing(item.id)}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Button
                        secondary
                        danger
                        label={zh ? "删除" : "Delete"}
                        onPress={() =>
                          confirmAction(
                            zh ? "删除此事项？" : "Delete this event?",
                            zh
                              ? "只删除这一条行程，地址钱包中的地点会保留。"
                              : "Only this event will be deleted. Your saved place stays in the address wallet.",
                            () =>
                              update({
                                itinerary: items.filter(
                                  (old) => old.id !== item.id,
                                ),
                              }),
                            t,
                          )
                        }
                      />
                    </View>
                  </View>
                </Surface>
              );
            })}
        </Section>
      ))}
      {!visible.length && (
        <Empty
          icon="prep"
          title={
            items.length
              ? zh
                ? "这里暂时没有事项"
                : "No events in this view"
              : zh
                ? "从下一次出发开始"
                : "Start with your next stop"
          }
          body={
            items.length
              ? zh
                ? "切换筛选，或添加一条新事项。"
                : "Change the filter or add another event."
              : zh
                ? "记下入住、集合或出发时间，也可以关联地址钱包中的地点。"
                : "Add check-in, meeting or departure times, and link a place from your address wallet."
          }
        />
      )}
      <Txt variant="caption" color={colors.secondary} style={{ marginTop: 14 }}>
        {zh
          ? "本机手动行程，不提供预订、通知或实时交通。城市和旅程阶段仍可在“我的行程”中设置。"
          : "A manual on-device planner, without booking, notifications or live traffic. Your city and arrival stage remain in My trip."}
      </Txt>
    </Page>
  );
}
