export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}.${month}.${day}`;
}

/**
 * 트렌딩 영화 데이터의 마지막 갱신 시점 (한국 시간 기준 자정)
 * TMDB 트렌딩은 주간 갱신이지만 매일 자정에 새로 캐시 한다고 가정
 */
export function getTrendingUpdateTime(): string {
  const now = new Date();
  const korean = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  korean.setUTCHours(0, 0, 0, 0);
  // korean이 KST 자정 (UTC 기준 +9 후 setUTCHours 0)을 표현하지 않으므로 단순 표시용으로 처리
  const year = korean.getUTCFullYear();
  const month = String(korean.getUTCMonth() + 1).padStart(2, "0");
  const day = String(korean.getUTCDate()).padStart(2, "0");
  return `${year}.${month}.${day} 00:00 기준`;
}

export function formatRelativeDate(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes < 1) return "방금 전";
  if (diffMinutes < 60) return `${diffMinutes}분 전`;
  if (diffHours < 24) return `${diffHours}시간 전`;
  if (diffDays < 7) return `${diffDays}일 전`;
  return formatDate(dateString);
}
