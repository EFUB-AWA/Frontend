export const compareFallbackNames = ["합정동 2층", "뚝섬역 5번 출구", "연남동 후보 1번"];

export function readCompareNames(params: { getAll: (name: string) => string[] }) {
  const items = params.getAll("item").filter((item) => item.length > 0);
  return items.length > 0 ? items : compareFallbackNames;
}

export function recommendedName(names: string[]) {
  return names.find((name) => name.includes("연남")) ?? names[names.length - 1] ?? compareFallbackNames[2];
}