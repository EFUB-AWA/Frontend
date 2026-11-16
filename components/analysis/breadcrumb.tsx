"use client";

import type { ButtonHTMLAttributes } from "react";

// 피그마 BreadCrumb. 매물별 분석 결과의 문구는 "뒤로 가기"
type BreadcrumbProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
};

export function Breadcrumb({ label, type = "button", ...props }: BreadcrumbProps) {
  return (
    <button type={type} className="breadcrumb" {...props}>
      <img src="/icon.svg/arrow-left-2.svg" width={18} height={18} alt="" />
      {label}
    </button>
  );
}
