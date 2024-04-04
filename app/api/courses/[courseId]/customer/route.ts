import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } },
): Promise<NextResponse> {
  const data = await req.json();
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await db.course.update({
      where: {
        id: params.courseId,
        userId,
      },
      data: {
        listId,
      },
    });

    await db.chapter.deleteMany({
      where: {
        courseId: params.courseId,
      },
    });
    const lastChapter = await db.chapter.findFirst({
      where: {
        courseId: params.courseId,
      },
      orderBy: {
        position: "desc",
      },
    });
    const newPosition = lastChapter ? lastChapter.position + 1 : 1;
    const newPositionsArray = Array.from(
      { length: videosData.length - newPosition + 1 },
      (_, i) => newPosition + i,
    );

    const chapters = await db.chapter.createMany({
      data: videosData.map((chapterData: any) => ({
        title: chapterData.title,
        description: chapterData.description,
        isFree: true,
        isPublished: true,
        position: newPositionsArray.shift(),
        courseId: params.courseId,
        videoUrl: `https://www.youtube.com/embed/${chapterData.videoId}`,
      })),
    });

    const allChaptersSorted = await db.chapter.findMany({
      select: {
        id: true,
        videoUrl: true,
      },
      orderBy: {
        position: "asc",
      },
    });
    await db.muxData.deleteMany({
      where: {
        chapterId: {
          in: allChaptersSorted.map((item: any) => item.id),
        },
      },
    });

    return NextResponse.json(`Customer added successfully!: ${chapters}}`, {
      status: 200,
    });
  } catch (error) {
    console.log("[CUSTOMER_CREATION]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
