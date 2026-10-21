import test from "node:test";
import assert from "node:assert/strict";
import { backOrReplace } from "../src/navigation-back";

test("return uses real history when the navigator has a previous screen", () => {
  const calls: string[] = [];
  backOrReplace(
    {
      canGoBack: () => true,
      back: () => {
        calls.push("back");
      },
      replace: () => {
        calls.push("replace");
      },
    },
    "/chat",
  );
  assert.deepEqual(calls, ["back"]);
});
test("direct links and refreshes replace with the safe fallback instead of GO_BACK", () => {
  const calls: string[] = [];
  const navigation = {
    canGoBack: () => false,
    back: () => {
      throw new Error("Unhandled GO_BACK");
    },
    replace: (path: unknown) => {
      calls.push(String(path));
    },
  };
  backOrReplace(navigation, "/chat");
  backOrReplace(navigation, "/arrival");
  backOrReplace(navigation);
  assert.deepEqual(calls, ["/chat", "/arrival", "/(tabs)"]);
});
