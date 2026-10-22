import React, { useRef, useState } from "react";
import { View } from "react-native";
import * as Crypto from "expo-crypto";
import { useApp } from "../state";
import {
  chinaDate,
  validDate,
  expenseAmount,
  expenseCategories,
  money,
  type Expense,
  type ExpenseCategory,
} from "../budget";
import { cnyCents } from "../talk";
import {
  Page,
  Heading,
  Surface,
  Txt,
  Field,
  Chips,
  Button,
  Row,
  Tap,
  Icon,
  Section,
  Notice,
  Empty,
  confirmAction,
} from "../ui";

export default function Budget() {
  const { prefs, update, colors, t } = useApp();
  const zh = prefs.language === "zh";
  const text = (cn: string, en: string) => (zh ? cn : en);
  const expenses = prefs.expenses || [];
  const budget = prefs.budgetCents ?? null;
  const total = expenses.reduce((sum, item) => sum + item.amountCents, 0);
  const left = budget === null ? null : budget - total;
  const [budgetOpen, setBudgetOpen] = useState(false);
  const [budgetInput, setBudgetInput] = useState(
    budget === null ? "" : (budget / 100).toFixed(2),
  );
  const [editor, setEditor] = useState<"new" | string | null>(null);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<ExpenseCategory>("food");
  const [date, setDate] = useState(chinaDate);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const saving = useRef(false);
  const labels: Record<ExpenseCategory, string> = {
    food: text("餐饮", "Food"),
    transport: text("交通", "Transport"),
    stay: text("住宿", "Stay"),
    shopping: text("购物", "Shopping"),
    other: text("其他", "Other"),
  };
  const icons: Record<ExpenseCategory, string> = {
    food: "food",
    transport: "transport",
    stay: "hotel",
    shopping: "pay",
    other: "prep",
  };
  const open = (item?: Expense) => {
    saving.current = false;
    setEditor(item?.id || "new");
    setAmount(item ? (item.amountCents / 100).toFixed(2) : "");
    setCategory(item?.category || "food");
    setDate(item?.date || chinaDate());
    setNote(item?.note || "");
    setError("");
  };
  const save = () => {
    if (saving.current) return;
    const cents = expenseAmount(amount);
    if (cents === null) {
      setError(
        text(
          "请输入大于 0 的金额，最多 6 位整数、2 位小数。",
          "Enter an amount above zero, up to 6 whole digits and 2 decimals.",
        ),
      );
      return;
    }
    if (!validDate(date)) {
      setError(
        text(
          "请输入真实日期，例如 2026-10-22。",
          "Enter a real date, for example 2026-10-22.",
        ),
      );
      return;
    }
    if (editor === "new" && expenses.length >= 200) {
      setError(
        text(
          "最多保存 200 笔，请先移除不需要的记录。",
          "You can save up to 200 entries. Remove an old entry first.",
        ),
      );
      return;
    }
    saving.current = true;
    const entry: Expense = {
      id: editor === "new" ? Crypto.randomUUID() : editor!,
      amountCents: cents,
      category,
      date,
      note: note.trim(),
    };
    update({
      expenses:
        editor === "new"
          ? [...expenses, entry]
          : expenses.map((item) => (item.id === editor ? entry : item)),
    });
    setEditor(null);
    setError("");
  };
  const filtered = [...expenses]
    .filter((item) => filter === "all" || item.category === filter)
    .sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id));
  return (
    <Page back title={text("人民币账本", "CNY budget")}>
      <Heading
        title={text("花在哪里，心里有数。", "A little clarity on spending.")}
        body={text(
          "记下中国生活中的开销。金额均为人民币。",
          "Keep track of everyday spending in China. All amounts are CNY.",
        )}
      />
      <Surface style={{ padding: 19, gap: 15, marginBottom: 18 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Txt variant="label">{text("本次总预算", "Your trip budget")}</Txt>
          <Tap
            label={text("设置预算", "Set budget")}
            onPress={() => {
              setBudgetInput(budget === null ? "" : (budget / 100).toFixed(2));
              setBudgetOpen(!budgetOpen);
              setError("");
            }}
            style={{ minHeight: 44, justifyContent: "center" }}
          >
            <Txt variant="label" color={colors.accent}>
              {budget === null ? text("设置", "Set") : money(budget)}
            </Txt>
          </Tap>
        </View>
        {budgetOpen && (
          <View style={{ gap: 9 }}>
            <Field
              label={text("预算（CNY）", "Budget (CNY)")}
              value={budgetInput}
              onChangeText={setBudgetInput}
              placeholder="1500.00"
              keyboardType="decimal-pad"
              maxLength={9}
              hint={text(
                "留空可移除预算，不会清除支出。",
                "Leave blank to remove the budget; expenses stay.",
              )}
            />
            <Button
              label={text("保存预算", "Save budget")}
              icon="check"
              onPress={() => {
                const cents = budgetInput.trim() ? cnyCents(budgetInput) : null;
                if (budgetInput.trim() && cents === null) {
                  setError(
                    text("请输入有效人民币金额。", "Enter a valid CNY amount."),
                  );
                  return;
                }
                update({ budgetCents: cents });
                setBudgetOpen(false);
                setError("");
              }}
            />
          </View>
        )}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <Txt color={colors.secondary}>
            {text("已记录支出", "Recorded spending")}
          </Txt>
          <Txt variant="subheading">{money(total)}</Txt>
        </View>
        <View style={{ height: 1, backgroundColor: colors.line }} />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <Txt color={colors.secondary}>
            {left !== null && left < 0
              ? text("超出预算", "Over budget")
              : text("剩余预算", "Budget remaining")}
          </Txt>
          <Txt
            variant="subheading"
            color={left !== null && left < 0 ? colors.danger : colors.accent}
          >
            {left === null ? text("未设置", "Not set") : money(Math.abs(left))}
          </Txt>
        </View>
      </Surface>
      {error && <Notice danger text={error} />}
      {editor !== null ? (
        <Surface style={{ padding: 18, gap: 12, marginBottom: 22 }}>
          <Txt variant="subheading">
            {editor === "new"
              ? text("记一笔", "Add an expense")
              : text("编辑支出", "Edit expense")}
          </Txt>
          <Field
            label={text("金额（CNY）", "Amount (CNY)")}
            value={amount}
            onChangeText={setAmount}
            keyboardType="decimal-pad"
            placeholder="80.00"
            maxLength={9}
          />
          <Chips
            value={category}
            onChange={(value) => setCategory(value as ExpenseCategory)}
            items={expenseCategories.map((id) => ({ id, label: labels[id] }))}
          />
          <Field
            label={text("日期（中国当地日期）", "Date (China local date)")}
            value={date}
            onChangeText={setDate}
            placeholder="YYYY-MM-DD"
            maxLength={10}
            autoCapitalize="none"
          />
          <Field
            label={text("备注（选填）", "Note (optional)")}
            value={note}
            onChangeText={setNote}
            placeholder={text(
              "例如：机场到酒店",
              "For example: airport to hotel",
            )}
            maxLength={200}
          />
          <Button
            label={text("保存支出", "Save expense")}
            icon="check"
            onPress={save}
          />
          <Button
            secondary
            label={text("取消编辑", "Cancel editing")}
            icon="close"
            onPress={() => {
              setEditor(null);
              setError("");
            }}
          />
        </Surface>
      ) : (
        <Button
          label={text("记一笔支出", "Add an expense")}
          icon="plus"
          onPress={() => open()}
        />
      )}
      {!!expenses.length && (
        <Section title={text("钱花在哪里", "Spending by category")}>
          <Surface style={{ paddingHorizontal: 17, paddingVertical: 5 }}>
            {expenseCategories
              .filter((id) => expenses.some((entry) => entry.category === id))
              .map((id) => (
                <View
                  key={id}
                  style={{
                    flexDirection: "row",
                    gap: 9,
                    alignItems: "center",
                    paddingVertical: 12,
                  }}
                >
                  <Icon name={icons[id]} size={17} />
                  <Txt variant="caption" style={{ flex: 1 }}>
                    {labels[id]}
                  </Txt>
                  <Txt variant="label">
                    {money(
                      expenses
                        .filter((entry) => entry.category === id)
                        .reduce((sum, entry) => sum + entry.amountCents, 0),
                    )}
                  </Txt>
                </View>
              ))}
          </Surface>
        </Section>
      )}
      <Section title={text("支出记录", "Your expenses")}>
        {!!expenses.length && (
          <Chips
            value={filter}
            onChange={setFilter}
            items={[
              { id: "all", label: text("全部", "All") },
              ...expenseCategories.map((id) => ({ id, label: labels[id] })),
            ]}
          />
        )}
        {!filtered.length ? (
          <Empty
            icon="pay"
            title={text("这里还没有支出", "No expenses here yet")}
            body={text(
              "记一笔餐饮、交通或住宿开销，就能查看汇总。",
              "Add food, transport or accommodation spending to see your totals.",
            )}
          />
        ) : (
          <Surface>
            {filtered.map((item, i) => (
              <View key={item.id}>
                <Row
                  title={`${money(item.amountCents)} · ${labels[item.category]}`}
                  subtitle={`${item.date}${item.note ? ` · ${item.note}` : ""}`}
                  icon={icons[item.category]}
                  onPress={() => open(item)}
                  last={i === filtered.length - 1}
                />
                <Tap
                  label={`${text("删除支出", "Delete expense")} ${money(item.amountCents)}`}
                  onPress={() =>
                    confirmAction(
                      text("删除这笔支出？", "Delete this expense?"),
                      text(
                        "删除后会重新计算总额，本机记录无法恢复。",
                        "Totals will update. This local entry cannot be restored.",
                      ),
                      () => {
                        update({
                          expenses: expenses.filter(
                            (entry) => entry.id !== item.id,
                          ),
                        });
                        if (editor === item.id) setEditor(null);
                      },
                      t,
                    )
                  }
                  style={{
                    paddingHorizontal: 18,
                    paddingBottom: 13,
                    minHeight: 44,
                    justifyContent: "center",
                  }}
                >
                  <Txt variant="caption" color={colors.danger}>
                    {text("删除", "Delete")}
                  </Txt>
                </Tap>
              </View>
            ))}
          </Surface>
        )}
      </Section>
      <Txt variant="caption" color={colors.secondary}>
        {text(
          "仅本机记录，不同步银行或支付平台，不提供实时汇率。刷新后保留；清除本机数据会一并删除。",
          "On this device only. No bank sync, payments or live exchange rates. Entries survive refresh; clearing local data removes them.",
        )}
      </Txt>
    </Page>
  );
}
