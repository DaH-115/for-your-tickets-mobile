import { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";

import Avatar from "@/components/ui/Avatar";
import InputField from "@/components/ui/InputField";
import Button from "@/components/ui/Button";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import { useAuthStore } from "@/stores/useAuthStore";
import { useAlertStore } from "@/stores/useAlertStore";
import { userApi } from "@/services/api/userApi";
import { s3Api } from "@/services/api/s3Api";
import { usePhotoUrl } from "@/hooks/usePhotoUrl";
import { COLORS } from "@/constants/theme";

export default function EditProfileScreen() {
  const router = useRouter();
  const { authLoading } = useProtectedRoute();
  const { user, updateUserProfile } = useAuthStore();
  const showToast = useAlertStore((s) => s.showToast);
  const photoUrl = usePhotoUrl(user?.photoKey, user?.photoUrl);

  const [displayName, setDisplayName] = useState("");
  const [biography, setBiography] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || "");
      setBiography(user.biography || "");
    }
  }, [user]);

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0] && user?.uid) {
      try {
        setLoading(true);
        const asset = result.assets[0];
        const contentType = asset.mimeType || "image/jpeg";
        const ext = contentType.split("/")[1] || "jpg";
        const filename = `${Date.now()}.${ext}`;

        // blob 크기 측정
        const resp = await fetch(asset.uri);
        const blob = await resp.blob();

        const { url, key } = await s3Api.getUploadUrl(
          filename,
          contentType,
          blob.size
        );
        await s3Api.uploadImage(url, asset.uri, contentType);
        await updateUserProfile(user.uid, { photoKey: key });
        showToast("프로필 사진이 변경되었습니다.", "success");
      } catch (err) {
        console.error("[profile-photo] error:", err);
        const msg =
          err instanceof Error ? err.message : "사진 업로드에 실패했습니다.";
        showToast(msg, "error");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSave = async () => {
    if (!user?.uid) return;
    if (!displayName.trim() || displayName.length < 2) {
      showToast("닉네임은 2자 이상이어야 합니다.", "error");
      return;
    }

    try {
      setLoading(true);
      await updateUserProfile(user.uid, {
        displayName: displayName.trim(),
        biography: biography.trim(),
      });
      showToast("프로필이 수정되었습니다.", "success");
      router.back();
    } catch {
      showToast("프로필 수정에 실패했습니다.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert("회원탈퇴", "정말 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.", [
      { text: "취소", style: "cancel" },
      {
        text: "탈퇴",
        style: "destructive",
        onPress: async () => {
          if (!user?.uid) return;
          try {
            await userApi.deleteAccount(user.uid);
            showToast("회원탈퇴가 완료되었습니다.", "success");
          } catch {
            showToast("회원탈퇴에 실패했습니다.", "error");
          }
        },
      },
    ]);
  };

  if (authLoading || !user) return null;

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView className="flex-1" keyboardShouldPersistTaps="handled">
          {/* Header */}
          <View className="flex-row items-center px-4 pt-2 pb-4">
            <Pressable onPress={() => router.back()} hitSlop={12}>
              <Ionicons name="arrow-back" size={22} color={COLORS.textPrimary} />
            </Pressable>
            <Text className="ml-3 text-lg font-bold text-text-primary">
              프로필 편집
            </Text>
          </View>

          <View className="px-4">
            {/* Avatar */}
            <View className="items-center">
              <Pressable onPress={handlePickImage}>
                <Avatar
                  photoUrl={photoUrl}
                  displayName={user.displayName}
                  size={96}
                />
                <View className="absolute bottom-0 right-0 rounded-full bg-accent p-2">
                  <Ionicons name="camera" size={16} color="#fff" />
                </View>
              </Pressable>
              <Text className="mt-2 text-xs text-text-muted">
                사진을 탭하여 변경
              </Text>
            </View>

            {/* Fields */}
            <View className="mt-6">
              <InputField
                label="닉네임"
                placeholder="2~30자 닉네임"
                value={displayName}
                onChangeText={setDisplayName}
                maxLength={30}
              />

              <View className="mb-4">
                <Text className="mb-2 text-base font-medium text-text-secondary">
                  자기소개
                </Text>
                <InputField
                  label=""
                  placeholder="자기소개를 입력하세요"
                  value={biography}
                  onChangeText={setBiography}
                  multiline
                  numberOfLines={4}
                  maxLength={200}
                />
                <Text className="text-right text-xs text-text-muted">
                  {biography.length}/200
                </Text>
              </View>
            </View>

            <Button
              title="저장"
              onPress={handleSave}
              loading={loading}
              className="mt-4"
            />

            {/* Delete Account */}
            <Pressable
              onPress={handleDeleteAccount}
              className="mt-8 items-center justify-center pb-8"
              style={{ minHeight: 44 }}
            >
              <Text className="text-sm text-red-500">회원탈퇴</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
