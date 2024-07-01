export function formatDateToCustomFormat(dateString: string): string {
  const invoiceDate = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  return invoiceDate.toLocaleDateString("en-US", options);
}
