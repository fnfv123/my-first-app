"use client";

import { useState } from "react";
import { courses } from "@/data/courses";

interface Course {
  id: number;
  name: string;
  price: number;
  seat: number;
  booked: number;
  date: string;
  tags: string[];
  emoji?: string;
  description?: string;
}

export default function Home() {
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  const displayedCourses = onlyAvailable
    ? (courses as Course[]).filter((course) => course.seat - course.booked > 0)
    : (courses as Course[]);

  return (
    <main className="flex min-h-screen flex-col items-center bg-[#1a2744] px-6 py-14 text-white">
      {/* 헤더 */}
      <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-3xl shadow-lg">
        🎓
      </div>
      <h1 className="mb-2 text-center text-4xl font-bold tracking-tight sm:text-5xl">
        스킬투머니
      </h1>
      <p className="mb-10 text-center text-base font-medium text-blue-200 sm:text-lg">
        배운 기술이 돈이 되는 원데이 클래스
      </p>

      {/* 섹션 타이틀 */}
      <div className="mb-4 flex w-full max-w-6xl items-center gap-3">
        <div className="h-px flex-1 bg-white/20" />
        <span className="text-sm font-semibold tracking-widest text-[#c9a84c]">
          강좌 목록
        </span>
        <div className="h-px flex-1 bg-white/20" />
      </div>

      {/* 필터 및 컨트롤 바 (강좌 목록 위) */}
      <div className="mb-6 flex w-full max-w-6xl items-center justify-between">
        <div className="text-sm text-blue-200">
          총 <span className="font-bold text-[#c9a84c]">{displayedCourses.length}</span>개 강좌
        </div>
        <label className="flex cursor-pointer items-center gap-2 select-none text-sm font-medium text-blue-100 transition hover:text-white">
          <input
            type="checkbox"
            checked={onlyAvailable}
            onChange={(e) => setOnlyAvailable(e.target.checked)}
            className="h-4 w-4 cursor-pointer rounded border-white/30 bg-white/10 accent-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/50"
          />
          <span>예약 가능한 강좌만 보기</span>
        </label>
      </div>

      {/* 강좌 카드 목록 */}
      {displayedCourses.length === 0 ? (
        <div className="flex w-full max-w-6xl flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/5 py-16 text-center">
          <p className="text-lg font-medium text-white/70">
            현재 예약 가능한 강좌가 없습니다.
          </p>
          <button
            onClick={() => setOnlyAvailable(false)}
            className="mt-4 rounded-full border border-[#c9a84c] px-4 py-1.5 text-xs font-semibold text-[#c9a84c] transition hover:bg-[#c9a84c] hover:text-[#1a2744]"
          >
            전체 강좌 보기
          </button>
        </div>
      ) : (
        <div className="grid w-full max-w-6xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {displayedCourses.map((course) => {
            const remaining = course.seat - course.booked;
            const isFull = remaining <= 0;
            const isAlmostFull = remaining > 0 && remaining <= 2;

            return (
              <div
                key={course.id}
                className="flex flex-col rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg backdrop-blur-sm transition hover:-translate-y-1 hover:border-[#c9a84c]/60 hover:shadow-[#c9a84c]/10"
              >
                {/* 상단: 이모지 및 날짜 */}
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#c9a84c]/15 text-2xl">
                    {course.emoji || "📚"}
                  </div>
                  {course.date && (
                    <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-medium text-blue-200">
                      📅 {course.date}
                    </span>
                  )}
                </div>

                {/* 강좌명 */}
                <h2 className="mb-2 text-lg font-bold text-white">
                  {course.name}
                </h2>

                {/* 태그 배지 목록 (강좌 이름 아래) */}
                {course.tags && course.tags.length > 0 && (
                  <div className="mb-3 flex flex-wrap gap-1.5">
                    {course.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center rounded-md border border-[#c9a84c]/30 bg-[#c9a84c]/15 px-2 py-0.5 text-xs font-medium text-[#eedaa2]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* 설명 */}
                {course.description && (
                  <p className="mb-4 text-sm leading-relaxed text-blue-200">
                    {course.description}
                  </p>
                )}

                {/* 좌석 현황 */}
                <div className="mt-auto mb-4 rounded-lg bg-white/5 px-4 py-3">
                  {/* 텍스트 */}
                  <div className="mb-2 flex items-center justify-between text-xs">
                    <span
                      className={
                        isFull
                          ? "font-bold text-red-400"
                          : isAlmostFull
                            ? "font-bold text-red-400"
                            : "font-semibold text-emerald-400"
                      }
                    >
                      {isFull
                        ? "🔴 마감"
                        : isAlmostFull
                          ? `🚨 마감 임박 (${remaining}석 남음)`
                          : `남은 좌석 ${remaining}석`}
                    </span>
                    <span className="text-white/50">
                      정원 {course.seat}명
                    </span>
                  </div>
                  {/* 프로그레스 바 */}
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isFull
                          ? "bg-red-400"
                          : isAlmostFull
                            ? "bg-red-400"
                            : "bg-emerald-400"
                      }`}
                      style={{
                        width: `${Math.min(
                          100,
                          Math.max(0, (course.booked / course.seat) * 100)
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                {/* 수강료 */}
                <p className="mb-4 text-xl font-extrabold text-[#c9a84c]">
                  {course.price.toLocaleString("ko-KR")}
                  <span className="ml-0.5 text-sm font-semibold">원</span>
                </p>

                {/* 예약하기 버튼 */}
                <button
                  disabled={isFull}
                  className={`w-full rounded-full border py-2.5 text-sm font-bold transition active:scale-95 ${
                    isFull
                      ? "cursor-not-allowed border-white/20 bg-white/5 text-white/30"
                      : "border-[#c9a84c] bg-transparent text-[#c9a84c] hover:bg-[#c9a84c] hover:text-[#1a2744]"
                  }`}
                >
                  {isFull ? "예약 마감" : "예약하기"}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* 하단 안내 */}
      <p className="mt-10 text-xs text-white/40">
        * 모든 클래스는 소규모 오프라인 원데이 과정입니다.
      </p>
    </main>
  );
}
