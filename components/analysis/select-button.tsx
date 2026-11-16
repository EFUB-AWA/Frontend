"use client";

import type { ButtonHTMLAttributes } from "react";

// 피그마 SelectButton. 선택 테두리 #186ded, 기본 테두리 #d5d9e4
// 매물별 분석 결과 인스턴스는 className="select-button-compact" (가로 110)
type SelectButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  selected?: boolean;
};

export function SelectButton({ selected = false, className = "", type = "button", ...props }: SelectButtonProps) {
  const state = selected ? "select-button-selected" : "";

  return <button type={type} className={`select-button ${state} ${className}`} {...props} />;
}
