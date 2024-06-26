import dayjs from "./dayjs";

export function formatString4Form(str: string|undefined): string {
  return str ? str : "";
}

export function formatDate4Form(dt: Date|undefined): string {
  return dt ? dayjs(dt).format("YYYY-MM-DD") : "";
}

export function formatDate(date: Date | string | undefined) {
  return date ? dayjs(date).format("ll") : "";
}
