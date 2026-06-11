// Minimal cookie-header parser — we only ever read a single known cookie, so a
// full cookie-parser dependency isn't warranted.
export const read_cookie = (cookie_header: string | undefined, name: string): string | undefined => {
  if (!cookie_header) return undefined;
  for (const part of cookie_header.split(";")) {
    const index = part.indexOf("=");
    if (index === -1) continue;
    const key = part.slice(0, index).trim();
    if (key !== name) continue;
    return decodeURIComponent(part.slice(index + 1).trim());
  }
  return undefined;
};
