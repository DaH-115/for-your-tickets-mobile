const DEFAULT_TIMEOUT_MS = 15000;

export class HttpError extends Error {
  status: number;
  statusText: string;
  body: unknown;

  constructor(message: string, response: Response, body?: unknown) {
    super(message);
    this.name = "HttpError";
    this.status = response.status;
    this.statusText = response.statusText;
    this.body = body;
  }
}

function getErrorMessage(body: unknown) {
  if (!body || typeof body !== "object") return null;

  const data = body as Record<string, unknown>;
  const message = data.error ?? data.message;

  return typeof message === "string" ? message : null;
}

export async function readJsonBody<T>(response: Response): Promise<T | null> {
  if (response.status === 204) return null;

  const text = await response.text();
  if (!text) return null;

  return JSON.parse(text) as T;
}

export async function fetchWithTimeout(
  input: RequestInfo | URL,
  init: RequestInit = {},
  timeoutMs = DEFAULT_TIMEOUT_MS
) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(input, {
      ...init,
      signal: init.signal ?? controller.signal,
    });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("요청 시간이 초과되었습니다. 잠시 후 다시 시도해주세요.");
    }

    throw new Error("네트워크 연결을 확인한 뒤 다시 시도해주세요.");
  } finally {
    clearTimeout(timeout);
  }
}

export async function assertOkResponse(response: Response) {
  if (response.ok) return;

  const body = await readJsonBody<unknown>(response).catch(() => null);
  const message =
    getErrorMessage(body) ||
    `API Error: ${response.status} ${response.statusText}`;

  throw new HttpError(message, response, body);
}
