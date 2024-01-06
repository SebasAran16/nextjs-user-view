export function getKeyFromCDNUrl(CDNUrl: string) {
  return CDNUrl.split("//")[1].split("/").slice(1).join("/");
}
