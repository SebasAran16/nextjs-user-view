export function hexToRGBA(hex: string, opacity: string) {
  const values = hex.match(/\w\w/g);

  if (values) {
    const [r, g, b] = values.map((k) => parseInt(k, 16));
    return `rgba( ${r}, ${g}, ${b}, ${opacity})`;
  }
  return hex;
}
