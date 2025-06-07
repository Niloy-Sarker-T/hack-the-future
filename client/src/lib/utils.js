import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import animationData from "@/assets/lottie-json"; // Add this import if you use animationDefaultOptions

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

