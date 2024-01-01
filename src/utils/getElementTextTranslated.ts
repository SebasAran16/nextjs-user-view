import Translate from "translate";

export async function getElementTextTranslated(
  text: string,
  textLanguage: string,
  customerLanguage: string
) {
  try {
    if (typeof text === "undefined" || typeof customerLanguage === "undefined")
      return;

    if (textLanguage === customerLanguage) return text;

    const translationResponse = await Translate(text, { to: customerLanguage });

    return translationResponse;
  } catch (err) {
    console.log(err);
  }
}
