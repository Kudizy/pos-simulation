export function formatMoney(n: number): string {
  return n.toLocaleString("fr-FR").replace(/\u202f/g, " ") + " F";
}
