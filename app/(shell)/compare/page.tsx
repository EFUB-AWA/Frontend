"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { SavedListItem } from "@/components/compare/saved-list-item";
import { Button } from "@/components/ui/button";
import { CompareStartModal, type CompareChip } from "@/components/compare/compare-start-modal";

type Listing = {
  id: string;
  name: string;
  detail: string;
  favorite: boolean;
  selected: boolean;
};

type ListingGroup = {
  date: string;
  items: Listing[];
};

const detail = "서울 마포구 · 1층 · 18평 · 카페 · 안정";

const initialGroups: ListingGroup[] = [
  {
    date: "2026.10.10",
    items: [
      { id: "hapjeong", name: "합정동 2층", detail, favorite: false, selected: true },
      { id: "yeonnam-1", name: "연남동 1층 상가", detail, favorite: true, selected: true },
    ],
  },
  {
    date: "2026.10.10-2",
    items: [
      { id: "seongsu-1", name: "성수동 1~2층", detail, favorite: false, selected: false },
      { id: "seongsu-2", name: "성수동 연무장길", detail, favorite: true, selected: false },
      { id: "ttukseom", name: "뚝섬역 5번출구", detail, favorite: true, selected: false },
    ],
  },
  {
    date: "2026.10.10-3",
    items: [{ id: "yeonnam-2", name: "연남동 1층 상가", detail, favorite: false, selected: false }],
  },
];

export default function ComparePage() {
  const router = useRouter();
  const [groups, setGroups] = useState(initialGroups);
  const [favoriteOnly, setFavoriteOnly] = useState(false);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [startOpen, setStartOpen] = useState(false);
  const [analysisName, setAnalysisName] = useState("");
  const [chips, setChips] = useState<CompareChip[]>([]);

  const visibleGroups = useMemo(() => {
    if (page !== 1) return [];

    const keyword = query.trim();

    return groups
      .map((group) => ({
        ...group,
        items: group.items.filter((item) => {
          const matchesFavorite = !favoriteOnly || item.favorite;
          const matchesQuery = keyword.length === 0 || item.name.includes(keyword) || item.detail.includes(keyword);
          return matchesFavorite && matchesQuery;
        }),
      }))
      .filter((group) => group.items.length > 0);
  }, [favoriteOnly, groups, page, query]);

  function updateItem(id: string, patch: Partial<Pick<Listing, "favorite" | "selected">>) {
    setGroups((current) =>
      current.map((group) => ({
        ...group,
        items: group.items.map((item) => (item.id === id ? { ...item, ...patch } : item)),
      })),
    );
  }

  return (
    <section className="compare-picker">
      <header className="compare-picker-head">
        <h1 className="compare-picker-title">비교 분석할 매물을 선택해주세요.</h1>
        <p className="compare-picker-sub">선택된 매물들 간의 조건을 비교하여 가장 좋은 매물을 추천해드려요.</p>
      </header>

      <div className="compare-list-head">
        <h2 className="compare-list-title">내 매물 목록</h2>
        <div className="compare-list-tools">
          <button type="button" className="compare-filter" aria-pressed={favoriteOnly} onClick={() => setFavoriteOnly((current) => !current)}>
            <img
              src={favoriteOnly ? "/icon.svg/Selected=on,%20Size=20.svg" : "/icon.svg/Selected=off,%20Size=20.svg"}
              width={20}
              height={20}
              alt=""
            />
            관심 매물만 보기
          </button>
          <label className="compare-search">
            <input
              type="search"
              placeholder="검색어를 입력해주세요"
              aria-label="내 매물 검색"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(1);
              }}
            />
            <img src="/icon.svg/search-line.svg" alt="" />
          </label>
        </div>
      </div>

      <div className="compare-groups">
        {visibleGroups.map((group) => (
          <section key={group.date} className="compare-group" aria-label={group.date}>
            <h3 className="compare-date">2026.10.10</h3>
            {group.items.map((item) => (
              <SavedListItem
                key={item.id}
                name={item.name}
                detail={item.detail}
                favorite={item.favorite}
                selected={item.selected}
                onFavorite={() => updateItem(item.id, { favorite: !item.favorite })}
                onSelect={() => updateItem(item.id, { selected: !item.selected })}
              />
            ))}
          </section>
        ))}
      </div>

      <div className="compare-pages" aria-label="페이지">
        {[1, 2].map((number) => (
          <button
            key={number}
            type="button"
            className={number === page ? "compare-page compare-page-current" : "compare-page"}
            aria-current={number === page ? "page" : undefined}
            onClick={() => setPage(number)}
          >
            {number}
          </button>
        ))}
      </div>

      <Button
  className="compare-start"
  onClick={() => {
    setChips(
      groups.flatMap((group) =>
        group.items.filter((item) => item.selected).map((item) => ({ id: item.id, name: item.name, included: true })),
      ),
    );
    setStartOpen(true);
  }}
>
  비교 분석 시작하기
</Button>
<CompareStartModal
  open={startOpen}
  chips={chips}
  name={analysisName}
  onNameChange={setAnalysisName}
  onToggleChip={(id) =>
    setChips((current) => current.map((chip) => (chip.id === id ? { ...chip, included: !chip.included } : chip)))
  }
  onCancel={() => setStartOpen(false)}
  onConfirm={() => {
    const params = new URLSearchParams({ flow: "compare" });
    const trimmed = analysisName.trim();
    if (trimmed) params.set("name", trimmed);
    chips.filter((chip) => chip.included).forEach((chip) => params.append("item", chip.name));
    router.push(`/analysis/loading?${params.toString()}`);
  }}
/>

      
    </section>
  );
}