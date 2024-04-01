import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function POST(
    req: Request,
): Promise<NextResponse> {
    const data = await req.json(); // Array of chapter data objects

    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const chapters = await db.chapter.createMany({
            data: data.map(
                (chapterData: any) => ({
                    title: chapterData.title,
                    description: chapterData.description,
                    isFree: chapterData.isFree, // Assuming logic for free videos
                    videoUrl: `https://www.youtube.com/embed/${chapterData.videoId}`,
                    muxData: {
                        playbackId: chapterData.playbackId, // Replace with your playback ID
                    },
                }),
            ),
        },);
        return NextResponse.json(
            `Chapters created successfully!: ${chapters}`,
            { status: 200 },
        );
    } catch (error) {
        console.log("[PLAYLIST_PUBLISH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
