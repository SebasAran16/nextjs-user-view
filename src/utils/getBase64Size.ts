export default function get64BaseSize(imageBase64: string) {
  const stringLength = imageBase64.length - "data:image/png;base64,".length;

  const sizeInBytes = 4 * Math.ceil(stringLength / 3) * 0.5624896334383812;
  const sizeInKb = (sizeInBytes / 1000).toFixed(4);
  return sizeInKb;
}
