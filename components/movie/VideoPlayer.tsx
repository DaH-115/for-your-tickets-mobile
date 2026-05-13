import { View, Text } from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";

interface VideoPlayerProps {
  videoKey: string;
  title?: string;
}

// 네이티브 전용 YouTube 플레이어.
export default function VideoPlayer({ videoKey, title }: VideoPlayerProps) {
  return (
    <View className="mb-4">
      <YoutubePlayer
        height={200}
        videoId={videoKey}
        webViewProps={{
          injectedJavaScript: `
            var element = document.getElementsByClassName('container')[0];
            element.style.position = 'unset';
            true;
          `,
        }}
      />
      {title && (
        <Text className="mt-2 text-base font-semibold text-text-secondary" numberOfLines={1}>
          {title}
        </Text>
      )}
    </View>
  );
}
