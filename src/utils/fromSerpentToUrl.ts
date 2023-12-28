export function fromSerpentToUrl(input: string) {
  const url = input.split("_").join("-");

  return url;
}
