type SavedListItemProps = {
  name: string;
  detail: string;
  favorite: boolean;
  selected: boolean;
  onFavorite: () => void;
  onSelect: () => void;
};

export function SavedListItem({ name, detail, favorite, selected, onFavorite, onSelect }: SavedListItemProps) {
  return (
    <article className="saved-list-item">
      <div className="saved-list-item-text">
        <h3 className="saved-list-item-name">{name}</h3>
        <p className="saved-list-item-detail">{detail}</p>
      </div>
      <div className="saved-list-item-actions">
        <button type="button" className="saved-list-item-icon" aria-pressed={favorite} aria-label={`${name} 관심`} onClick={onFavorite}>
          <img src={favorite ? "/icon.svg/heart.svg" : "/icon.svg/Selected=off.svg"} width={24} height={24} alt="" />
        </button>
        <button type="button" className="saved-list-item-icon" aria-pressed={selected} aria-label={`${name} 선택`} onClick={onSelect}>
          <img
            src={selected ? "/icon.svg/Selected=on,%20Size=24.svg" : "/icon.svg/Selected=off,%20Size=24.svg"}
            width={24}
            height={24}
            alt=""
          />
        </button>
      </div>
    </article>
  );
}