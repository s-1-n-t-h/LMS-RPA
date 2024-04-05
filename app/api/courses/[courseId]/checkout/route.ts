import Razorpay from "razorpay";
import { currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { razorpay } from "@/lib/razorpay";

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } },
) {
  try {
    const user = await currentUser();

    if (!user || !user.id || !user.emailAddresses?.[0]?.emailAddress) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
        isPublished: true,
      },
    });

    const purchase = await db.purchase.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: params.courseId,
        },
      },
    });

    if (purchase) {
      return new NextResponse("Already purchased", { status: 400 });
    }

    if (!course) {
      return new NextResponse("Not found", { status: 404 });
    }

    const order = razorpay.orders.create({
      amount: course.price!,
      currency: "INR",
      receipt: "receipt#1",
      notes: {
        customerClerkId: user.id,
        courseName: course.title,
        customerEmail: user.emailAddresses[0].emailAddress,
      },
    });

    let stripeCustomer = await db.stripeCustomer.findUnique({
      where: {
        userId: user.id,
      },
      select: {
        stripeCustomerId: true,
      },
    });

    // If customer doesn't exist, create a new one
    // let razorpayCustomer;
    // if (true) {
    //   try {
    //     const customer = await razorpay.customers.create({
    //       email: user.emailAddresses[0].emailAddress,
    //       name: `${user.firstName + " " + user.lastName}`,
    //     });
    //     razorpayCustomer = customer;
    //   } catch (error) {
    //     console.log("Error creating Razorpay customer:", error);
    //     return new NextResponse("Error creating Razorpay customer", {
    //       status: 500,
    //     });
    //   }
    // }
    if (!stripeCustomer) {
      stripeCustomer = await db.stripeCustomer.create({
        data: {
          userId: user.id,
          stripeCustomerId: user.emailAddresses[0].emailAddress,
        },
      });
    }
    await db.purchase.create({
      data: {
        courseId: course.id,
        userId: user.id,
      },
    });

    return NextResponse.json({ url: process.env.PAYMENT_LINK });
  } catch (error) {
    console.log("[COURSE_ID_CHECKOUT]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
