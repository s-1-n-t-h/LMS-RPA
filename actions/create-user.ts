import { db } from "@/lib/db";
import { auth, currentUser } from "@clerk/nextjs";

export const createUser = async (): Promise<string> => {
  try {
    const user = await currentUser();
    const { userId } = auth();
    if (!user) return "User Not Found";

    const userCreated = await db.customer.upsert({
      where: { userID: userId! },
      create: {
        userID: userId!,
        email: user.emailAddresses[0].emailAddress,
      },
      update: {},
    });

     if (!userId) {
      console.error("[CREATE_USER] userId is null, cannot assign courses.");
      return "User ID is null";
    }

    // Grant free access to all courses for the user
    await db.purchase.createMany({
      data: await db.course.findMany().then((courses) =>
        courses.map((course) => ({
          userId,
          courseId: course.id,
        }))
      ),
      skipDuplicates: true, // Prevent duplicate entries
    });

    return userCreated.email;
  } catch (error) {
    console.log("[GET_PROGRESS]", error);
    return "error";
  }
};
