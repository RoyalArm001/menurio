export function formatPrice(
  amount: number,
  currency = "AMD",
  locale = "en",
): string {
  const numericAmount = Number.isFinite(amount) ? amount : 0;
  const normalizedCurrency = currency.trim().toUpperCase();

  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: normalizedCurrency,
      currencyDisplay: "narrowSymbol",
    }).format(numericAmount);
  } catch {
    return `${numericAmount.toLocaleString("en-US")} ${normalizedCurrency}`;
  }
}

export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
