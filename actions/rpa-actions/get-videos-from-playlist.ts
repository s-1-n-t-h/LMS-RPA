"use server";

import * as https from "https";

const API_KEY = process.env.YOUTUBE_API_KEY!;
const MAX_RESULTS = 100;

export async function getPlaylistVideos(playlistId: string) {
  const url = new URL("https://www.googleapis.com/youtube/v3/playlistItems");
  url.searchParams.set("part", "snippet");
  url.searchParams.set("maxResults", MAX_RESULTS.toString());
  url.searchParams.set("playlistId", playlistId);
  url.searchParams.set("key", API_KEY);

  return new Promise<VideoInfo[]>((resolve, reject) => {
    https
      .get(url.toString(), (res) => {
        let data = "";

        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          try {
            const response = JSON.parse(data);
            const items = response.items || [];
            const videos: VideoInfo[] = items.map((item: any) => ({
              title: item.snippet?.title || "",
              description: item.snippet?.description || "",
              videoId: item.snippet?.resourceId?.videoId || "",
            }));
            resolve(videos);
          } catch (error) {
            reject(error);
          }
        });
      })
      .on("error", (error) => {
        reject(error);
      });
  });
}

interface VideoInfo {
  title: string;
  description: string;
  videoId: string;
}
