export function stripHtmlTags(content: string | undefined | null): string {
  if (!content) {
    return "";
  }

  return content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export function getPreviewFromContent(
  content: string | undefined | null,
  maxLength = 140
): string {
  const plainText = stripHtmlTags(content);
  if (plainText.length <= maxLength) {
    return plainText;
  }

  return `${plainText.slice(0, maxLength).trim()}…`;
}

