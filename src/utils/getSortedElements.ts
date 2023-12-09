export default function getSortedElements(elements: any) {
  return elements.sort(
    (elementA: any, elementB: any) => elementA.position - elementB.position
  );
}
