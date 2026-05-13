import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Ionicons } from "@expo/vector-icons";

import InputField from "@/components/ui/InputField";
import Button from "@/components/ui/Button";
import { signInWithEmail } from "@/services/firebase/auth";
import { useAlertStore } from "@/stores/useAlertStore";
import { COLORS } from "@/constants/theme";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "이메일을 입력해주세요.")
    .email("올바른 이메일 형식이 아닙니다."),
  password: z
    .string()
    .min(1, "비밀번호를 입력해주세요.")
    .min(8, "비밀번호는 최소 8자 이상이어야 합니다."),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const router = useRouter();
  const showToast = useAlertStore((s) => s.showToast);
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, touchedFields },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setLoading(true);
      await signInWithEmail(data.email, data.password);
      showToast("로그인 성공!", "success");
      router.replace("/(tabs)/home");
    } catch {
      showToast("이메일 또는 비밀번호가 올바르지 않습니다.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="px-6 py-8">
            {/* Logo */}
            <View className="mb-20 items-center">
              <Text className="text-3xl font-bold text-white">
                For Your Tickets
              </Text>
              <Text className="mt-1 text-base text-text-secondary">
                당신을 위한 영화 티켓
              </Text>
            </View>

            {/* Login Card */}
            <View className="rounded-3xl border border-accent/30 bg-surface p-6">
              <Text className="mb-6 text-center text-lg font-bold text-text-primary">
                로그인
              </Text>

              {/* Email */}
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <InputField
                    label="이메일"
                    placeholder="example@domain.com"
                    keyboardType="email-address"
                    autoComplete="email"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.email?.message}
                    touched={touchedFields.email}
                  />
                )}
              />

              {/* Password */}
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <InputField
                    label="비밀번호"
                    placeholder="비밀번호를 입력하세요"
                    secureTextEntry
                    autoComplete="password"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.password?.message}
                    touched={touchedFields.password}
                  />
                )}
              />

              {/* Login Button */}
              <Button
                title="로그인"
                onPress={handleSubmit(onSubmit)}
                loading={loading}
                className="mt-6 p-4"
              />

              {/* Divider */}
              <View className="my-6 flex-row items-center">
                <View className="flex-1 border-t border-dashed border-gray-600" />
                <Text className="mx-4 text-xs text-text-muted">또는</Text>
                <View className="flex-1 border-t border-dashed border-gray-600" />
              </View>

              {/* Social Login - Google */}
              <Pressable
                className="mb-3 flex-row items-center justify-center rounded-2xl bg-surface-light p-4"
                onPress={() => {
                  showToast(
                    "Google 로그인은 Development Build에서 지원됩니다.",
                    "info",
                  );
                }}
              >
                <Ionicons
                  name="logo-google"
                  size={18}
                  color={COLORS.textPrimary}
                />
                <Text className="ml-3 text-base font-semibold text-text-primary">
                  Google로 로그인
                </Text>
              </Pressable>
            </View>

            {/* Sign Up Link */}
            <Pressable
              className="mt-6 items-center"
              onPress={() => router.push("/(auth)/sign-up")}
            >
              <Text className="text-base text-text-secondary">
                계정이 없으신가요?{" "}
                <Text className="font-bold text-accent">회원가입</Text>
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
