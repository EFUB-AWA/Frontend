import Link from "next/link";

const menus = [
  { href: "/home", label: "홈", current: false },
  { href: "/compare", label: "매물 비교", current: true },
  { href: "/history", label: "비교 이력", current: false },
] as const;

export function Gnb() {
  return (
    <header className="gnb">
      <div className="gnb-inner">
        <img className="gnb-logo" src="/logo.svg/Group 2.svg" alt="이리ON" />
        <nav className="gnb-menu">
          {menus.map((menu) => (
            <Link
              key={menu.href}
              href={menu.href}
              className={menu.current ? "gnb-link gnb-link-current" : "gnb-link"}
            >
              {menu.label}
            </Link>
          ))}
        </nav>
        <label className="gnb-search">
          <input type="search" placeholder="검색어를 입력해주세요" aria-label="검색" />
          <img src="/icon.svg/search-line.svg" alt="" />
        </label>
        <img className="gnb-user" src="/icon.svg/user-square.svg" alt="" />
      </div>
    </header>
  );
}