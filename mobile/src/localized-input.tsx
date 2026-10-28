import React, { forwardRef } from "react";
import { TextInput as NativeInput, type TextInputProps } from "react-native";
import { useApp } from "./state";
import { uiText } from "./locale-ui";

// Translate UI labels only. Editable values (including API keys and personal
// text) go straight to the native input without translation or persistence.
export const TextInput = forwardRef<NativeInput, TextInputProps>(
  function LocalizedInput(props, ref) {
    const { prefs } = useApp();
    return (
      <NativeInput
        {...props}
        ref={ref}
        placeholder={
          props.placeholder
            ? uiText(prefs.language, props.placeholder)
            : undefined
        }
        accessibilityLabel={
          props.accessibilityLabel
            ? uiText(prefs.language, props.accessibilityLabel)
            : undefined
        }
        accessibilityHint={
          props.accessibilityHint
            ? uiText(prefs.language, props.accessibilityHint)
            : undefined
        }
      />
    );
  },
);
export type InputRef = NativeInput;
