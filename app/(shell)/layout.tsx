import type { ReactNode } from "react";
import { Gnb } from "@/components/gnb/gnb";


export default function ShellLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Gnb />
      <main className="page">{children}</main>
    </>
  );
}
