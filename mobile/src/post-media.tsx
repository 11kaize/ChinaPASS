import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, Platform, View } from "react-native";
import { useVideoPlayer, VideoView } from "expo-video";
import type { Media } from "./domain/community";
import { resolveMedia } from "./local-media";
import { Txt } from "./ui";
function Video({ uri }: { uri: string }) {
  const player = useVideoPlayer(uri);
  return (
    <VideoView
      player={player}
      nativeControls
      style={{ width: "100%", height: 230, borderRadius: 16 }}
      contentFit="contain"
    />
  );
}
export function PostMedia({
  media,
  compact = false,
}: {
  media: Media;
  compact?: boolean;
}) {
  const [uri, setUri] = useState<string | null>(null),
    [error, setError] = useState("");
  useEffect(() => {
    let live = true,
      resolved = "";
    resolveMedia(media.uri)
      .then((url) => {
        resolved = url;
        if (live) setUri(url);
        else if (Platform.OS === "web" && url.startsWith("blob:"))
          URL.revokeObjectURL(url);
      })
      .catch((e) => {
        if (live) setError(e.message);
      });
    return () => {
      live = false;
      if (Platform.OS === "web" && resolved.startsWith("blob:"))
        URL.revokeObjectURL(resolved);
    };
  }, [media.uri]);
  if (error)
    return (
      <View style={{ padding: 14 }}>
        <Txt variant="caption">{error}</Txt>
      </View>
    );
  if (!uri)
    return (
      <View style={{ height: compact ? 140 : 230, justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  if (media.type === "video")
    return compact ? (
      <View
        style={{
          height: 140,
          backgroundColor: "#152440",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 16,
        }}
      >
        <Txt color="#E9F2FF">Video · {media.name}</Txt>
      </View>
    ) : (
      <Video uri={uri} />
    );
  return (
    <Image
      accessibilityLabel={media.name}
      source={{ uri }}
      style={{ width: "100%", height: compact ? 148 : 250, borderRadius: 16 }}
      resizeMode="cover"
    />
  );
}
