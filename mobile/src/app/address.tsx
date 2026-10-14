import React, { useState } from "react";
import { View } from "react-native";
import { router } from "expo-router";
import { useApp } from "../state";
import { Page, Heading, Field, Button, confirmAction } from "../ui";
export default function Address() {
  const { t, prefs, update } = useApp();
  const [name, setName] = useState(prefs.address.name),
    [address, setAddress] = useState(prefs.address.address),
    [phone, setPhone] = useState(prefs.address.phone);
  const save = () =>
    update({
      address: {
        name: name.trim(),
        address: address.trim(),
        phone: phone.trim(),
      },
    });
  return (
    <Page back title={t("address")}>
      <Heading title={t("address")} body={t("addressBody")} />
      <Field
        label={t("destination")}
        value={name}
        onChangeText={setName}
        maxLength={150}
      />
      <Field
        label={t("addressLabel")}
        multiline
        textAlignVertical="top"
        value={address}
        onChangeText={setAddress}
        maxLength={500}
        style={{ minHeight: 100 }}
      />
      <Field
        label={t("phone")}
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        maxLength={25}
      />
      <View style={{ gap: 13 }}>
        <Button
          label={t("show")}
          icon="cards"
          disabled={!address.trim()}
          onPress={() => {
            save();
            router.push({ pathname: "/card", params: { kind: "address" } });
          }}
        />
        <Button
          secondary
          label={t("saveAddress")}
          icon="save"
          disabled={!address.trim()}
          onPress={() => {
            save();
            router.back();
          }}
        />
        <Button
          danger
          label={t("clearAddress")}
          icon="close"
          onPress={() =>
            confirmAction(
              t("clearAddress"),
              t("address"),
              () => {
                setName("");
                setAddress("");
                setPhone("");
                update({ address: { name: "", address: "", phone: "" } });
              },
              t,
            )
          }
        />
      </View>
    </Page>
  );
}
