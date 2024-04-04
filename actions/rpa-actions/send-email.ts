"use server";
import { db } from "@/lib/db";
import { createTransporter } from "./gmailTransporter";

export const sendMail = async () => {
  try {
    const userEmails = await db.customer.findMany({
      select: {
        email: true,
      },
    });

    const mailOptions = {
      from: process.env.USER_EMAIL,
      to: userEmails.map((item: any) => item.email).join(","),
      text: "Hi, this is a test email",
    };

    let emailTransporter = await createTransporter();
    await emailTransporter.sendMail(mailOptions);
    console.log("Email Sent!");
  } catch (err) {
    console.log("ERROR: ", err);
  }
};
