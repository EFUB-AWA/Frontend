// app/(shell)/home/page.tsx
'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';

interface ConditionItem {
  id: string;
  date: string;
  title: string;
  category: string;
  location: string;
  budget: string;
  isLiked: boolean;
}

interface PropertyItem {
  id: string;
  date: string;
  title: string;
  district: string;
  floor: string;
  area: string;
  category: string;
  status: string;
  isLiked: boolean;
}

const INITIAL_CONDITIONS: ConditionItem[] = [
  { id: 'c1', date: '2026.10.10', title: '조건 제목', category: '카페', location: '서울 성동구', budget: '예산 8,000만원', isLiked: false },
  { id: 'c2', date: '2026.10.10', title: '조건 제목', category: '카페', location: '서울 성동구', budget: '예산 8,000만원', isLiked: false },
  { id: 'c3', date: '2026.10.10', title: '조건 제목', category: '카페', location: '서울 성동구', budget: '예산 8,000만원', isLiked: false },
  { id: 'c4', date: '2026.10.10', title: '조건 제목', category: '카페', location: '서울 성동구', budget: '예산 8,000만원', isLiked: false },
  { id: 'c5', date: '2026.10.10', title: '조건 제목', category: '카페', location: '서울 성동구', budget: '예산 8,000만원', isLiked: false },
];

const INITIAL_PROPERTIES: PropertyItem[] = [
  { id: 'p1', date: '2026.10.10', title: '연남동 1층 상가', district: '서울 마포구', floor: '1층', area: '18평', category: '카페', status: '안정', isLiked: false },
  { id: 'p2', date: '2026.10.10', title: '연남동 1층 상가', district: '서울 마포구', floor: '1층', area: '18평', category: '카페', status: '안정', isLiked: false },
  { id: 'p3', date: '2026.10.10', title: '연남동 1층 상가', district: '서울 마포구', floor: '1층', area: '18평', category: '카페', status: '안정', isLiked: false },
  { id: 'p4', date: '2026.10.10', title: '연남동 1층 상가', district: '서울 마포구', floor: '1층', area: '18평', category: '카페', status: '안정', isLiked: false },
  { id: 'p5', date: '2026.10.10', title: '연남동 1층 상가', district: '서울 마포구', floor: '1층', area: '18평', category: '카페', status: '안정', isLiked: false },
];

export default function HomeDashboardPage() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'conditions' | 'properties'>('conditions');
  const [conditions, setConditions] = useState<ConditionItem[]>(INITIAL_CONDITIONS);
  const [properties, setProperties] = useState<PropertyItem[]>(INITIAL_PROPERTIES);

  const [searchQuery, setSearchQuery] = useState('');
  const [onlyLiked, setOnlyLiked] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // 👇 1. 삭제 모달 대상 상태 (null이면 모달 닫힘)
  const [deleteTarget, setDeleteTarget] = useState<{
    type: 'condition' | 'property';
    id: string;
  } | null>(null);

  // 👇 2. 토스트 알림 표시 상태
  const [showToast, setShowToast] = useState(false);

  const handleTabChange = (tab: 'conditions' | 'properties') => {
    setActiveTab(tab);
    setSearchQuery('');
    setOnlyLiked(false);
    setCurrentPage(1);
  };

  const toggleConditionLike = (id: string) => {
    setConditions((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isLiked: !item.isLiked } : item))
    );
  };

  const togglePropertyLike = (id: string) => {
    setProperties((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isLiked: !item.isLiked } : item))
    );
  };

  // 👇 3. 모달에서 '확인' 클릭 시 실제 삭제 실행 및 토스트 노출
  const handleConfirmDelete = () => {
    if (!deleteTarget) return;

    if (deleteTarget.type === 'condition') {
      setConditions((prev) => prev.filter((item) => item.id !== deleteTarget.id));
    } else {
      setProperties((prev) => prev.filter((item) => item.id !== deleteTarget.id));
    }

    setDeleteTarget(null);
    setShowToast(true);

    // 2.5초 후 토스트 자동 숨김
    setTimeout(() => {
      setShowToast(false);
    }, 2500);
  };

  const filteredConditions = useMemo(() => {
    return conditions.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesLike = onlyLiked ? item.isLiked : true;
      return matchesSearch && matchesLike;
    });
  }, [conditions, searchQuery, onlyLiked]);

  const filteredProperties = useMemo(() => {
    return properties.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesLike = onlyLiked ? item.isLiked : true;
      return matchesSearch && matchesLike;
    });
  }, [properties, searchQuery, onlyLiked]);

  return (
    <div className="min-h-screen bg-white pt-12 pb-24 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* 1. 상단 타이틀 영역 */}
        <header className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight mb-2">
            내 창업 한 눈에 보기
          </h1>
          <p className="text-sm text-gray-500">
            저장한 창업 조건과 관심 매물을 한 곳에서 관리할 수 있어요.
          </p>
        </header>

        {/* 2. 요약 통계 카드 2개 */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          <div
            onClick={() => handleTabChange('conditions')}
            className="bg-[#F0F6FF] rounded-2xl p-6 cursor-pointer transition-all hover:bg-[#E6F0FF]"
          >
            <p className="text-xs font-medium text-gray-600 mb-2">등록된 조건</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-[#1D74F5]">
              {conditions.length}건
            </p>
          </div>

          <div
            onClick={() => handleTabChange('properties')}
            className="bg-[#F0F6FF] rounded-2xl p-6 cursor-pointer transition-all hover:bg-[#E6F0FF]"
          >
            <p className="text-xs font-medium text-gray-600 mb-2">저장한 매물</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-[#1D74F5]">
              {properties.length}건
            </p>
          </div>
        </section>

        {/* 3. 탭 네비게이션 */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            type="button"
            onClick={() => handleTabChange('conditions')}
            className={`px-6 py-3 text-sm font-semibold transition-all relative cursor-pointer ${
              activeTab === 'conditions'
                ? 'text-[#1D74F5]'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            내 조건 목록
            {activeTab === 'conditions' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#1D74F5]" />
            )}
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('properties')}
            className={`px-6 py-3 text-sm font-semibold transition-all relative cursor-pointer ${
              activeTab === 'properties'
                ? 'text-[#1D74F5]'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            내 매물 목록
            {activeTab === 'properties' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#1D74F5]" />
            )}
          </button>
        </div>

        {/* 4. 검색 & 필터 & 추가 버튼 컨트롤 바 */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap items-center gap-4">
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
              <span>{activeTab === 'conditions' ? '관심 조건만 보기' : '관심 매물만 보기'}</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() =>
              router.push(activeTab === 'conditions' ? '/onboarding' : '/properties/new')
            }
            className="self-start sm:self-auto px-4 py-2.5 bg-[#18181B] hover:bg-black text-white text-xs sm:text-sm font-medium rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span className="text-base leading-none">+</span>
            <span>{activeTab === 'conditions' ? '분석 정보 추가하기' : '매물 정보 추가하기'}</span>
          </button>
        </div>

        {/* 5. 카드 리스트 영역 */}
        <section className="space-y-3">
          {activeTab === 'conditions' ? (
            filteredConditions.length > 0 ? (
              filteredConditions.map((item, idx) => {
                const showDateHeader = idx === 0 || idx === 1 || idx === 4;
                return (
                  <React.Fragment key={item.id}>
                    {showDateHeader && (
                      <p className="text-xs font-bold text-gray-700 pt-2 pb-1">
                        {item.date}
                      </p>
                    )}
                    <div className="border border-gray-200 rounded-2xl px-6 py-5 flex items-center justify-between hover:border-gray-300 transition-all bg-white">
                      <div>
                        <h3 className="text-base font-bold text-gray-900 mb-1.5">
                          {item.title}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {item.category} · {item.location} · {item.budget}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => toggleConditionLike(item.id)}
                          aria-label="관심 조건 등록"
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

                        <button
                          type="button"
                          onClick={() => router.push(`/onboarding?edit=${item.id}`)}
                          className="px-3.5 py-2 bg-[#F4F5F7] hover:bg-gray-200 text-xs font-medium text-gray-700 rounded-lg transition-colors cursor-pointer"
                        >
                          수정
                        </button>

                        {/* 삭제 버튼 클릭 시 모달 오픈 */}
                        <button
                          type="button"
                          onClick={() => setDeleteTarget({ type: 'condition', id: item.id })}
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
                조건 내역이 없습니다.
              </div>
            )
          ) : filteredProperties.length > 0 ? (
            filteredProperties.map((item, idx) => {
              const showDateHeader = idx === 0 || idx === 2;
              return (
                <React.Fragment key={item.id}>
                  {showDateHeader && (
                    <p className="text-xs font-bold text-gray-700 pt-2 pb-1">
                      {item.date}
                    </p>
                  )}
                  <div className="border border-gray-200 rounded-2xl px-6 py-5 flex items-center justify-between hover:border-gray-300 transition-all bg-white">
                    <div>
                      <h3 className="text-base font-bold text-gray-900 mb-1.5">
                        {item.title}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {item.district} · {item.floor} · {item.area} · {item.category} · {item.status}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => togglePropertyLike(item.id)}
                        aria-label="관심 매물 등록"
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

                      <button
                        type="button"
                        onClick={() => router.push(`/properties/edit/${item.id}`)}
                        className="px-3.5 py-2 bg-[#F4F5F7] hover:bg-gray-200 text-xs font-medium text-gray-700 rounded-lg transition-colors cursor-pointer"
                      >
                        수정
                      </button>

                      {/* 삭제 버튼 클릭 시 모달 오픈 */}
                      <button
                        type="button"
                        onClick={() => setDeleteTarget({ type: 'property', id: item.id })}
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
              저장된 매물이 없습니다.
            </div>
          )}
        </section>

        {/* 6. 하단 페이지네이션 */}
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
      {/* 👇 4. 삭제 확인 모달 UI (피그마 시안 반영)                  */}
      {/* ======================================================== */}
      {deleteTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          onClick={() => setDeleteTarget(null)} // 배경 클릭 시 닫기
        >
          <div
            className="w-full max-w-[360px] bg-white rounded-3xl p-7 text-center shadow-xl"
            onClick={(e) => e.stopPropagation()} // 모달 내부 클릭 시 닫힘 방지
          >
            <h2 className="text-lg font-bold text-gray-900 mb-2.5">
              {deleteTarget.type === 'property'
                ? '이 매물을 삭제할까요?'
                : '이 조건을 삭제할까요?'}
            </h2>
            <p className="text-sm text-gray-500 mb-7">
              {deleteTarget.type === 'property'
                ? '삭제한 매물 정보는 복구할 수 없어요.'
                : '삭제한 조건 정보는 복구할 수 없어요.'}
            </p>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
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
      {/* 👇 5. 삭제 완료 토스트 알림 UI (피그마 시안 반영)           */}
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