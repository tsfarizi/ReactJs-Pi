type LogLevel = "debug" | "info" | "warn" | "error";

const levelToConsole: Record<LogLevel, (...args: any[]) => void> = {
  debug: console.debug.bind(console),
  info: console.info.bind(console),
  warn: console.warn.bind(console),
  error: console.error.bind(console),
};

const timestamp = (): string => new Date().toISOString();

const isDebugEnabled = (): boolean => {
  try {
    const ls = localStorage.getItem("debug");
    if (ls === "true") return true;
    if (ls === "false") return false;
  } catch {}
  // Enable debug in non-production by default or via VITE_DEBUG
  // @ts-ignore
  const isDev = !!import.meta.env.DEV;
  // @ts-ignore
  const viteDebug = String(import.meta.env.VITE_DEBUG || "").toLowerCase() === "true";
  return isDev || viteDebug;
};

const formatPrefix = (level: LogLevel, tag?: string) =>
  `[${timestamp()}][${level.toUpperCase()}]${tag ? ` [${tag}]` : ""}`;

const baseLog = (level: LogLevel, tag: string | undefined, ...args: any[]) => {
  if (level === "debug" && !isDebugEnabled()) return;
  levelToConsole[level](formatPrefix(level, tag), ...args);
};

export const debug = (tag: string, ...args: any[]) => baseLog("debug", tag, ...args);
export const info = (tag: string, ...args: any[]) => baseLog("info", tag, ...args);
export const warn = (tag: string, ...args: any[]) => baseLog("warn", tag, ...args);
export const error = (tag: string, ...args: any[]) => baseLog("error", tag, ...args);

export const group = (label: string) => {
  if (!isDebugEnabled()) return;
  console.group(label);
};
export const groupCollapsed = (label: string) => {
  if (!isDebugEnabled()) return;
  console.groupCollapsed(label);
};
export const groupEnd = () => {
  if (!isDebugEnabled()) return;
  console.groupEnd();
};

export const mask = (value: string, visible: number = 4) => {
  if (!value) return value;
  if (value.length <= visible * 2) return `${value[0]}***${value[value.length - 1]}`;
  return `${value.slice(0, visible)}...${value.slice(-visible)}`;
};

