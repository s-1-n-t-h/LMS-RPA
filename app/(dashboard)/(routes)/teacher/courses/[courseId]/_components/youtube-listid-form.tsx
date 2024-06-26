"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Course } from "@prisma/client";
import { getPlaylistVideos } from "@/actions/rpa-actions/get-videos-from-playlist";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";

interface ListIdFormProps {
  initialData: Course;
  courseId: string;
}

const formSchema = z.object({
  listId: z
    .string()
    .url({ message: "Please enter a valid YouTube Playlist URL" }),
});

export const ListIdForm = ({ initialData, courseId }: ListIdFormProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      listId: initialData?.listId || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;
  const extractListIdFromUrl = (url: string) => {
    const urlObject = new URL(url);
    const searchParams = urlObject.searchParams;
    return searchParams.get("list");
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const listId = extractListIdFromUrl(values.listId)!;
      const youtubeData = await getPlaylistVideos(listId);
      const newObject = {
        ...youtubeData.map((obj) => ({ ...obj })),
        ["lsitId"]: values.listId,
      };
      await axios.post(`/api/courses/${courseId}/playlist-update`, {
        youtubeData,
        values,
      });
      //await axios.patch(`api/courses/${courseId}/route`, values);
      toast.success("Course updated");
      toggleEdit();
      console.log("data", youtubeData, values);
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course Playlist URL
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit Playlist URL
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <p
          className={cn(
            "text-sm mt-2",
            !initialData.listId && "text-slate-500 italic",
          )}
        >
          {initialData.listId || "No listId"}
        </p>
      )}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="listId"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      disabled={isSubmitting}
                      placeholder="e.g. 'This course is about...'"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button disabled={!isValid || isSubmitting} type="submit">
                Save
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};
