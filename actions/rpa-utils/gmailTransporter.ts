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

    oauth2Client.setCredentials({
      refresh_token: process.env.REFRESH_TOKEN,
    });

    const accessToken = await new Promise<string>((resolve, reject) => {
      oauth2Client.getAccessToken((err, token) => {
        if (err) {
          console.error("*ERR: ", err);
          reject(err);
        }
        resolve(token as string);
      });
    });

    const transporter = nodemailer.createTransport({
      service: "Gmail", // Using 'service' instead of 'host', 'port', 'secure'
      auth: {
        type: "OAuth2",
        user: process.env.USER_EMAIL || "", // Ensure user is not undefined
        accessToken,
        clientId: process.env.CLIENT_ID || "", // Ensure clientId is not undefined
        clientSecret: process.env.CLIENT_SECRET || "", // Ensure clientSecret is not undefined
        refreshToken: process.env.REFRESH_TOKEN || "", // Ensure refreshToken is not undefined
      },
    } as TransportOptions);

    return transporter;
  } catch (err) {
    console.error("Error creating transporter:", err);
    throw err;
  }
};
