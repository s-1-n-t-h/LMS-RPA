"use server";

import nodemailer, { TransportOptions } from "nodemailer";
import { google } from "googleapis";

const OAuth2 = google.auth.OAuth2;

export const createTransporter = async () => {
  try {
    const oauth2Client = new OAuth2(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      "https://developers.google.com/oauthplayground",
    );

    // Ensure environment variables are defined
    if (
      !process.env.CLIENT_ID ||
      !process.env.CLIENT_SECRET ||
      !process.env.REFRESH_TOKEN
    ) {
      throw new Error(
        "Missing required environment variables for Google OAuth!",
      );
    }

    oauth2Client.setCredentials({
      refresh_token: process.env.REFRESH_TOKEN,
    });

    const accessToken = oauth2Client.getAccessToken();

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        type: "OAuth2",
        user: process.env.USER_EMAIL || "", // Optional user email
        accessToken,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
      },
    } as TransportOptions);

    return transporter;
  } catch (err) {
    console.error("Error creating transporter:", err);
    throw err; // Re-throw for further handling
  }
};
