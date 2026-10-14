// Fill only the known card syntax, never interpret or translate user input.
export function cardBlanks(text: string): string[] {
  return [...new Set(text.match(/%s|\[[^\]\n]+\]/g) || [])];
}
export function fillCard(text: string, values: Record<string, string>): string {
  return text.replace(
    /%s|\[[^\]\n]+\]/g,
    (blank) => values[blank]?.trim() || blank,
  );
}
