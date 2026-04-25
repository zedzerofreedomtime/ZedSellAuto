export function formatCurrencyTHB(value: number) {
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    maximumFractionDigits: 0
  }).format(value);
}

export function formatMonthlyPaymentTHB(value: number) {
  return `${formatCurrencyTHB(value)}/เดือน`;
}

export function formatMileageKM(value: number) {
  return `${new Intl.NumberFormat("th-TH").format(value)} กม.`;
}

export function formatIsoDateThai(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("th-TH", {
    dateStyle: "medium"
  }).format(date);
}

export function formatReadTimeMinutes(value: number) {
  return `${value} นาที`;
}
