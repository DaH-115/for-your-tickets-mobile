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
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Ionicons } from "@expo/vector-icons";

import InputField from "@/components/ui/InputField";
import Button from "@/components/ui/Button";
import { useAlertStore } from "@/stores/useAlertStore";
import { API_BASE_URL } from "@/utils/constants";
import { COLORS } from "@/constants/theme";

const signUpSchema = z
  .object({
    displayName: z
      .string()
      .min(2, "닉네임은 최소 2자 이상이어야 합니다.")
      .max(30, "닉네임은 최대 30자까지 가능합니다."),
    email: z
      .string()
      .min(1, "이메일을 입력해주세요.")
      .email("올바른 이메일 형식이 아닙니다."),
    password: z
      .string()
      .min(8, "비밀번호는 최소 8자 이상이어야 합니다.")
      .regex(/[0-9]/, "숫자를 포함해야 합니다.")
      .regex(/[!@#$%^&*(),.?":{}|<>]/, "특수문자를 포함해야 합니다."),
    confirmPassword: z.string().min(1, "비밀번호 확인을 입력해주세요."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["confirmPassword"],
  });

type SignUpFormValues = z.infer<typeof signUpSchema>;

export default function SignUpScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const showToast = useAlertStore((s) => s.showToast);
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, touchedFields },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    mode: "onTouched",
    defaultValues: {
      displayName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: SignUpFormValues) => {
    try {
      setLoading(true);

      const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayName: data.displayName,
          email: data.email,
          password: data.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "회원가입에 실패했습니다.");
      }

      showToast("회원가입이 완료되었습니다!", "success");
      router.replace("/(auth)/login");
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "회원가입에 실패했습니다.",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Back Button */}
      <Pressable
        onPress={() => router.back()}
        className="absolute left-6 z-10 flex-row items-center"
        style={{ top: insets.top + 12 }}
        hitSlop={12}
      >
        <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
        <Text className="ml-2 text-base text-text-primary">뒤로</Text>
      </Pressable>

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
            {/* Header */}
            <View className="mb-12 items-center">
              <Text className="text-2xl font-bold text-white">회원가입</Text>
              <Text className="mt-1 text-base text-text-secondary">
                For Your Tickets에 오신 것을 환영합니다
              </Text>
            </View>

            {/* Sign Up Card */}
            <View className="rounded-3xl border border-accent/30 bg-surface p-6">
              {/* Display Name */}
              <Controller
                control={control}
                name="displayName"
                render={({ field: { onChange, onBlur, value } }) => (
                  <InputField
                    label="닉네임"
                    placeholder="2~30자 닉네임"
                    autoComplete="name"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.displayName?.message}
                    touched={touchedFields.displayName}
                  />
                )}
              />

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
                    placeholder="8자 이상, 숫자+특수문자 포함"
                    secureTextEntry
                    autoComplete="new-password"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.password?.message}
                    touched={touchedFields.password}
                  />
                )}
              />

              {/* Confirm Password */}
              <Controller
                control={control}
                name="confirmPassword"
                render={({ field: { onChange, onBlur, value } }) => (
                  <InputField
                    label="비밀번호 확인"
                    placeholder="비밀번호를 다시 입력하세요"
                    secureTextEntry
                    autoComplete="new-password"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.confirmPassword?.message}
                    touched={touchedFields.confirmPassword}
                  />
                )}
              />

              {/* Sign Up Button */}
              <Button
                title="회원가입"
                onPress={handleSubmit(onSubmit)}
                loading={loading}
                className="mt-6 p-4"
              />
            </View>

            {/* Login Link */}
            <Pressable
              className="mt-6 items-center"
              onPress={() => router.replace("/(auth)/login")}
            >
              <Text className="text-base text-text-secondary">
                이미 계정이 있으신가요?{" "}
                <Text className="font-bold text-accent">로그인</Text>
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
