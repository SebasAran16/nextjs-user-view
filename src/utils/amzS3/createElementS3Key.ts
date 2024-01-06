export function createElementS3Key(
  restaurantId: string,
  viewUrl: string,
  objectType: string,
  elementId: string,
  extension: string
) {
  return `${restaurantId}/${viewUrl}/elements/${objectType}-${elementId}_v1${extension}`;
}
