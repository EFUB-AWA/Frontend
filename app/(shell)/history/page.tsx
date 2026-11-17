// app/(shell)/history/page.tsx
'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';

interface HistoryItem {
  id: string;
  date: string;
  title: string;
  detail: string;
  tag: string;
  isLiked: boolean;
}

const INITIAL_HISTORY: HistoryItem[] = [
  { id: 'h1', date: '2026.10.10', title: '연남동 1층 상가', detail: '서울 마포구 · 1층 · 18평 · 카페 · 안정', tag: '연남동 후보 1번', isLiked: false },
  { id: 'h2', date: '2026.10.10', title: '연남동 1층 상가', detail: '서울 마포구 · 1층 · 18평 · 카페 · 안정', tag: '연남동 후보 1번', isLiked: true },
  { id: 'h3', date: '2026.10.10', title: '연남동 1층 상가', detail: '서울 마포구 · 1층 · 18평 · 카페 · 안정', tag: '연남동 후보 1번', isLiked: false },
  { id: 'h4', date: '2026.10.10', title: '연남동 1층 상가', detail: '서울 마포구 · 1층 · 18평 · 카페 · 안정', tag: '연남동 후보 1번', isLiked: false },
  { id: 'h5', date: '2026.10.10', title: '연남동 1층 상가', detail: '서울 마포구 · 1층 · 18평 · 카페 · 안정', tag: '연남동 후보 1번', isLiked: false },
  { id: 'h6', date: '2026.10.10', title: '연남동 1층 상가', detail: '서울 마포구 · 1층 · 18평 · 카페 · 안정', tag: '연남동 후보 1번', isLiked: false },
];

export default function ComparisonHistoryPage() {
  const router = useRouter();

  const [historyList, setHistoryList] = useState<HistoryItem[]>(INITIAL_HISTORY);
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyLiked, setOnlyLiked] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // 👇 삭제 모달 상태 관리 (null이면 모달 닫힘)
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // 👇 삭제 완료 토스트 알림 상태 관리
  const [showToast, setShowToast] = useState(false);

  // 하트(관심 비교) 토글
  const toggleLike = (id: string) => {
    setHistoryList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isLiked: !item.isLiked } : item))
    );
  };

  // 모달에서 '확인' 클릭 시 실제 삭제 수행 및 토스트 노출
  const handleConfirmDelete = () => {
    if (!deleteId) return;

    setHistoryList((prev) => prev.filter((item) => item.id !== deleteId));
    setDeleteId(null);
    setShowToast(true);

    // 2.5초 후 토스트 자동 숨김
    setTimeout(() => {
      setShowToast(false);
    }, 2500);
  };

  // 검색어 및 관심 필터링 적용
  const filteredHistory = useMemo(() => {
    return historyList.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.detail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tag.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesLike = onlyLiked ? item.isLiked : true;
      return matchesSearch && matchesLike;
    });
  }, [historyList, searchQuery, onlyLiked]);

  return (
    <div className="min-h-screen bg-white pt-12 pb-24 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        
        {/* 1. 상단 타이틀 영역 */}
        <header className="text-center mb-14">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight mb-3">
            이전에 비교한 내용을 다시 확인해보세요.
          </h1>
          <p className="text-sm text-gray-500">
            매물끼리 비교 분석한 내용을 여기서 확인할 수 있어요.
          </p>
        </header>

        {/* 2. 컨트롤 바 (관심 비교 필터 & 검색창) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-base font-bold text-gray-900">내 비교 분석 목록</h2>

          <div className="flex flex-wrap items-center gap-4">
            {/* 관심 비교만 보기 체크박스/토글 */}
            <button
              type="button"
              onClick={() => setOnlyLiked((prev) => !prev)}
              className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-600 hover:text-gray-900 cursor-pointer select-none"
            >
              <span
                className={`w-4 h-4 rounded-full flex items-center justify-center border transition-colors ${
                  onlyLiked
                    ? 'bg-[#1D74F5] border-[#1D74F5] text-white'
                    : 'border-gray-300 text-gray-400 bg-white'
                }`}
              >
                <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </span>
              <span>관심 비교 분석만 보기</span>
            </button>

            {/* 검색 입력창 */}
            <div className="relative w-64 sm:w-72">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="검색어를 입력해주세요"
                className="w-full pl-4 pr-10 py-2.5 bg-[#F4F5F7] text-sm text-gray-900 placeholder-gray-400 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              />
              <svg
                className="w-4 h-4 text-gray-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <circle cx="11" cy="11" r="8" />
                <path strokeLinecap="round" d="M21 21l-4.35-4.35" />
              </svg>
            </div>
          </div>
        </div>

        {/* 3. 비교 이력 리스트 영역 */}
        <section className="space-y-3">
          {filteredHistory.length > 0 ? (
            filteredHistory.map((item, idx) => {
              // 시안처럼 특정 위치에 날짜 표시
              const showDateHeader = idx === 0 || idx === 3;
              return (
                <React.Fragment key={item.id}>
                  {showDateHeader && (
                    <p className="text-xs font-bold text-gray-700 pt-3 pb-1">
                      {item.date}
                    </p>
                  )}
                  <div className="border border-gray-200 rounded-2xl px-6 py-5 flex items-center justify-between hover:border-gray-300 transition-all bg-white">
                    <div>
                      <h3 className="text-base font-bold text-gray-900 mb-1.5">
                        {item.title}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {item.detail}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* 후보 태그 버튼 */}
                      <span className="px-3.5 py-1.5 bg-[#1D74F5] text-white text-xs font-medium rounded-lg">
                        {item.tag}
                      </span>

                      {/* 하트 버튼 */}
                      <button
                        type="button"
                        onClick={() => toggleLike(item.id)}
                        aria-label="관심 비교 등록"
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                      >
                        {item.isLiked ? (
                          <svg className="w-5 h-5 text-red-500 fill-red-500" viewBox="0 0 24 24">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                            />
                          </svg>
                        )}
                      </button>

                      {/* 삭제 버튼 (클릭 시 모달 오픈) */}
                      <button
                        type="button"
                        onClick={() => setDeleteId(item.id)}
                        className="px-3.5 py-2 bg-[#F4F5F7] hover:bg-gray-200 text-xs font-medium text-gray-700 rounded-lg transition-colors cursor-pointer"
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                </React.Fragment>
              );
            })
          ) : (
            <div className="py-16 text-center text-sm text-gray-400 border border-dashed border-gray-200 rounded-2xl">
              비교 이력 내역이 없습니다.
            </div>
          )}
        </section>

        {/* 4. 하단 페이지네이션 */}
        <div className="flex items-center justify-center gap-2 mt-12">
          {[1, 2].map((page) => (
            <button
              key={page}
              type="button"
              onClick={() => setCurrentPage(page)}
              className={`w-7 h-7 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                currentPage === page
                  ? 'bg-[#18181B] text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 👇 5. 비교 분석 삭제 확인 모달 (시안 반영)                 */}
      {/* ======================================================== */}
      {deleteId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          onClick={() => setDeleteId(null)}
        >
          <div
            className="w-full max-w-[360px] bg-white rounded-3xl p-7 text-center shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold text-gray-900 mb-2.5">
              이 비교 분석 결과를 삭제할까요?
            </h2>
            <p className="text-sm text-gray-500 mb-7">
              삭제한 분석 결과는 복구할 수 없어요.
            </p>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setDeleteId(null)}
                className="py-3.5 bg-[#F2F3F5] hover:bg-gray-200 text-gray-700 font-semibold text-sm rounded-xl transition-colors cursor-pointer"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="py-3.5 bg-[#111111] hover:bg-black text-white font-semibold text-sm rounded-xl transition-colors cursor-pointer"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 👇 6. 삭제 완료 토스트 알림 (시안 반영)                    */}
      {/* ======================================================== */}
      {showToast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 bg-[#3B3B3B] text-white px-6 py-3.5 rounded-2xl shadow-lg flex items-center gap-2.5 text-sm font-medium transition-all">
          <svg
            className="w-5 h-5 text-white shrink-0"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="12" r="9" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.5 12.5l2.5 2.5 4.5-5" />
          </svg>
          <span>삭제되었습니다.</span>
        </div>
      )}
    </div>
  );
}