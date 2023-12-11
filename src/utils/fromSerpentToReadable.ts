export function fromSerpentToReadable(input: string) {
  const stringWithSpaces = input.split("_").join(" ");

  const serpentString = stringWithSpaces.replace(/\b\w/g, (char) =>
    char.toUpperCase()
  );

  return serpentString;
}
