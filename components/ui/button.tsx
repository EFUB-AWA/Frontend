import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "black" | "gray" | "brand";
};

const variantClass = {
  black: "button-black",
  gray: "button-gray",
  brand: "button-brand",
} as const;

export function Button({ variant = "black", type = "button", className, ...props }: ButtonProps) {
  const classes = ["button", variantClass[variant], className].filter(Boolean).join(" ");

  return <button type={type} className={classes} {...props} />;
}
