import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "black" | "gray";
};

export function Button({ variant = "black", type = "button", ...props }: ButtonProps) {
  const color = variant === "black" ? "button-black" : "button-gray";

  return <button type={type} className={`button ${color}`} {...props} />;
}
