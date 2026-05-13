import { View, Text, TextInput, TextInputProps } from "react-native";
import { COLORS } from "@/constants/theme";

interface InputFieldProps extends TextInputProps {
  label: string;
  error?: string;
  touched?: boolean;
}

export default function InputField({
  label,
  error,
  touched,
  ...props
}: InputFieldProps) {
  const hasError = touched && error;

  return (
    <View className="mb-4">
      <Text className="mb-2 text-base font-medium text-text-secondary">
        {label}
      </Text>
      <TextInput
        className={`w-full rounded-xl border px-4 py-3 text-base text-white ${
          hasError
            ? "border-red-500 bg-red-500/10"
            : "border-gray-600 bg-surface-light"
        }`}
        placeholderTextColor={COLORS.textMuted}
        autoCapitalize="none"
        {...props}
      />
      {hasError && (
        <Text className="mt-1 text-xs text-red-500">{error}</Text>
      )}
    </View>
  );
}
