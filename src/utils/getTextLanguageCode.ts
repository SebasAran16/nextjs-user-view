import cld from "cld";

export async function returnLanguageCode(text: string) {
  const result = await cld.detect(text);
  return result.languages[0].code;
}
