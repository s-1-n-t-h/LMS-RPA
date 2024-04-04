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

    return userCreated.email;
  } catch (error) {
    console.log("[GET_PROGRESS]", error);
    return "error";
  }
};
