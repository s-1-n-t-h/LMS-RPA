import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } },
): Promise<NextResponse> {
  const data = await req.json();
  // Array of chapter data object
  const videosData = data.youtubeData;
  const listId = data.values.listId;

  // console.log("data",data)
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
