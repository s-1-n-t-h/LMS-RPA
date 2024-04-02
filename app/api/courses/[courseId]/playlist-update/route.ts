import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } },
): Promise<NextResponse> {
  const data = await req.json(); // Array of chapter data objects

  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const deletedChapters = await db.chapter.deleteMany({
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
      { length: data.length - newPosition + 1 },
      (_, i) => newPosition + i,
    );

    const chapters = await db.chapter.createMany({
      data: data.map((chapterData: any) => ({
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

    const playbacks = await db.muxData.createMany({
      data: allChaptersSorted.map((chapterData: any) => ({
        chapterId: chapterData.id,
        playbackId: chapterData.videoUrl.split("/").pop(),
      })),
    });
    return NextResponse.json(
      `Chapters created successfully!: ${chapters}, Inserted Playbalcks: ${playbacks}}`,
      { status: 200 },
    );
  } catch (error) {
    console.log("[PLAYLIST_PUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
