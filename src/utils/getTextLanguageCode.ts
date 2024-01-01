import LanguageDetect from "languagedetect";
const languageDetector = new LanguageDetect();

export function getTextLanguage(text: string) {
  const result = languageDetector.detect(text, 1);

  const language = result[0][0];

  return language;
}
