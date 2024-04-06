"use server";
import { db } from "@/lib/db";
import { createTransporter } from "./gmailTransporter";

export const sendMail = async (courseId: string, type = "published") => {
  try {
    const userEmails = await db.customer.findMany({
      select: {
        email: true,
      },
    });
    console.log("courseid", courseId);
    const courseName = (await db.course.findUnique({
      where: {
        id: courseId,
      },
      select: {
        title: true,
      },
    })) || { title: "title" };

    const messageTemplate =
      type === "published"
        ? `Greeting Learner, This is to notify that the course: ${courseName.title} is Published.`
        : `Greeting Learner, This is to notify that the course: ${courseName.title} is Un-published for maintenance purposes.`;

    const mailOptions = {
      from: process.env.USER_EMAIL,
      to: userEmails.map((item: any) => item.email).join(","),
      subject: "Update from LMS 📖 JNTU-GV 🎓 ",
      text: messageTemplate,
    };

    let emailTransporter = await createTransporter();
    await emailTransporter.sendMail(mailOptions);

    console.log("Emails Sent!");
  } catch (err) {
    console.log("ERROR: ", err);
  }
};
