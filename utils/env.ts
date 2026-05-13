type EnvValue = string | undefined;

function normalizeEnv(value: EnvValue) {
  return value?.trim() || undefined;
}

export function getOptionalEnv(name: string, fallback?: string) {
  return normalizeEnv(process.env[name]) ?? fallback;
}

export function getRequiredEnv(name: string) {
  const value = normalizeEnv(process.env[name]);

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}
