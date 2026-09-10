import type { CSSProperties, ReactNode } from "react";

type IconName =
  | "search"
  | "bag"
  | "user"
  | "arrow"
  | "chevron"
  | "close"
  | "menu"
  | "truck"
  | "return"
  | "mountain"
  | "shield"
  | "check"
  | "heart"
  | "pin"
  | "lock";

const paths: Record<IconName, ReactNode> = {
  search: <><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></>,
  bag: <><path d="M5 7h14l1 14H4L5 7Z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></>,
  user: <><circle cx="12" cy="7" r="4" /><path d="M4 21v-2a8 8 0 0 1 16 0v2" /></>,
  arrow: <><path d="M4 12h16" /><path d="m14 6 6 6-6 6" /></>,
  chevron: <path d="m9 5 7 7-7 7" />,
  close: <><path d="m6 6 12 12" /><path d="M6 18 18 6" /></>,
  menu: <><path d="M3 6h18" /><path d="M3 12h18" /><path d="M3 18h18" /></>,
  truck: <><path d="M2 5h12v12H2zM14 9h4l4 4v4h-8" /><circle cx="6" cy="18" r="2" /><circle cx="18" cy="18" r="2" /></>,
  return: <><path d="m7 3-5 5 5 5" /><path d="M2 8h12a7 7 0 1 1 0 14" /></>,
  mountain: <><path d="m2 20 7-14 4 7 3-5 6 12H2Z" /><path d="m6 12 3 2 3-2" /></>,
  shield: <><path d="m12 2 9 4v6c0 5-9 10-9 10S3 17 3 12V6l9-4Z" /><path d="m8 12 3 3 5-6" /></>,
  check: <path d="m5 12 4 4L20 5" />,
  heart: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z" />,
  pin: <><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2" /></>,
  lock: <><rect x="5" y="10" width="14" height="11" rx="1" /><path d="M8 10V6a4 4 0 0 1 8 0v4" /></>,
};

export default function ShopIcon({
  name,
  size = 22,
  style,
}: {
  name: IconName;
  size?: number;
  style?: CSSProperties;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={style}
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}
