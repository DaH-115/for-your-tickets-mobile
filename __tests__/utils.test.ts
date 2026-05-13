describe("image URL helpers", () => {
  beforeEach(() => {
    jest.resetModules();
    process.env.EXPO_PUBLIC_TMDB_API_KEY = "test-tmdb-key";
  });

  it("builds TMDB image URLs with the requested size", () => {
    const { getTmdbImageUrl } = require("../utils/imageUrl");

    expect(getTmdbImageUrl("/poster.jpg", "w342")).toBe(
      "https://image.tmdb.org/t/p/w342/poster.jpg"
    );
  });

  it("returns undefined for missing image paths", () => {
    const {
      getTmdbPosterUrl,
      getTmdbBackdropUrl,
    } = require("../utils/imageUrl");

    expect(getTmdbPosterUrl(null)).toBeUndefined();
    expect(getTmdbBackdropUrl(undefined)).toBeUndefined();
  });
});

describe("date formatting", () => {
  it("formats ISO dates as yyyy.mm.dd", () => {
    const { formatDate } = require("../utils/formatDate");

    expect(formatDate("2026-05-13T12:30:00.000Z")).toBe("2026.05.13");
  });
});

describe("HTTP helpers", () => {
  function createErrorResponse() {
    return new Response(JSON.stringify({ error: "실패했습니다" }), {
      status: 400,
      statusText: "Bad Request",
      headers: { "Content-Type": "application/json" },
    });
  }

  it("returns null for 204 responses", async () => {
    const { readJsonBody } = require("../utils/http");

    await expect(
      readJsonBody(new Response(null, { status: 204 }))
    ).resolves.toBe(null);
  });

  it("throws HttpError with server error message", async () => {
    const { assertOkResponse, HttpError } = require("../utils/http");

    await expect(assertOkResponse(createErrorResponse())).rejects.toMatchObject(
      {
        name: "HttpError",
        message: "실패했습니다",
        status: 400,
      }
    );
    await expect(
      assertOkResponse(createErrorResponse())
    ).rejects.toBeInstanceOf(HttpError);
  });
});
