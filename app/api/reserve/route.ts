import { NextResponse } from "next/server";
import { courses } from "@/data/courses";

interface Course {
  id: number;
  name: string;
  price: number;
  seat: number;
  booked: number;
  date: string;
  tags?: string[];
  emoji?: string;
  description?: string;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { courseId, course, name, phone, people, date } = body;

    // 1. 필수 입력값 검증
    if (!name || !phone || !people) {
      return NextResponse.json(
        { success: false, message: "이름, 연락처, 인원을 모두 입력해 주세요." },
        { status: 400 }
      );
    }

    const parsedPeople = Number(people);
    if (isNaN(parsedPeople) || parsedPeople <= 0) {
      return NextResponse.json(
        { success: false, message: "유효한 인원 수를 입력해 주세요." },
        { status: 400 }
      );
    }

    // 2. 서버 측 강좌 데이터 조회 및 결제 금액(total) 계산
    // 결제 금액(total)은 화면이 보낸 값이 아니라 서버가 강좌 데이터의 수강료 × 인원으로 계산
    const courseList = courses as Course[];
    const targetCourse = courseList.find(
      (c) => c.id === Number(courseId) || c.name === course
    );

    if (!targetCourse) {
      return NextResponse.json(
        { success: false, message: "강좌 정보를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    const total = targetCourse.price * parsedPeople;
    const courseDate = date || targetCourse.date;
    const courseName = targetCourse.name;

    // 3. .env 환경 변수에서 SHEET_URL 가져오기 (브라우저에 노출되지 않고 서버에서만 사용)
    const sheetUrl = process.env.SHEET_URL;

    if (!sheetUrl) {
      console.error("SHEET_URL 환경 변수가 설정되지 않았습니다.");
      return NextResponse.json(
        { success: false, message: "서버 설정 오류: SHEET_URL이 없습니다." },
        { status: 500 }
      );
    }

    // 4. 구글 시트로 {date, course, name, phone, people, total} JSON 전송
    const payload = {
      date: courseDate,
      course: courseName,
      name: String(name).trim(),
      phone: String(phone).trim(),
      people: parsedPeople,
      total,
    };

    const sheetResponse = await fetch(sheetUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!sheetResponse.ok) {
      const errText = await sheetResponse.text().catch(() => "");
      console.error("Google Sheet 전송 실패:", sheetResponse.status, errText);
      return NextResponse.json(
        {
          success: false,
          message: "구글 시트 저장 중 오류가 발생했습니다.",
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "예약 신청이 완료되었습니다.",
      data: payload,
    });
  } catch (error) {
    console.error("예약 처리 중 서버 오류:", error);
    return NextResponse.json(
      {
        success: false,
        message: "예약 처리 중 서버 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}
