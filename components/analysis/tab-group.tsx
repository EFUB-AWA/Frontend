"use client";

// 피그마 TabGroup, TabItem
export type AnalysisTabItem = {
  id: string;
  label: string;
};

type TabGroupProps = {
  items: AnalysisTabItem[];
  selectedId: string;
  onSelect?: (id: string) => void;
};

export function TabGroup({ items, selectedId, onSelect }: TabGroupProps) {
  return (
    <div className="tab-group">
      {items.map((item) => {
        const selected = item.id === selectedId;

        return (
          <button
            key={item.id}
            type="button"
            className={selected ? "tab-item tab-item-selected" : "tab-item"}
            onClick={() => onSelect?.(item.id)}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
