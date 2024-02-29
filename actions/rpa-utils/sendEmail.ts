"use server";

import { createTransporter } from "./gmailTransporter";

export const sendMail = async () => {
  try {
    const mailOptions = {
      from: process.env.USER_EMAIL,
      to: "yaswanthownsbussinesses@gmail.com",
      subject: "Test",
      text: "Hi, this is a test email",
    };

    let emailTransporter = await createTransporter();
    await emailTransporter.sendMail(mailOptions);
    console.log("Email Sent!");
  } catch (err) {
    console.log("ERROR: ", err);
  }
};
