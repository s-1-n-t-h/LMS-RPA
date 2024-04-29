# Building an LMS Platform: Next.js 13, React, Stripe, Mux, Prisma, Tailwind, MySQL

This is a repository for Build an LMS Platform: Next.js 13, React, Razorpay, YouTube & GMail APIs, Prisma, Tailwind, MySQL

Key Features:

- Browse & Filter Courses
- Purchase Courses using Razorpay
- Mark Chapters as Completed or Uncompleted
- Progress Calculation of each Course
- Student Dashboard 
- Teacher mode
- Create new Courses and Courses using RPA Techniques
- Easily reorder chapter position with drag n’ drop
- Upload thumbnails, attachments and videos using UploadThing
- Video player using YouTube iframes
- Rich text editor for chapter description
- Authentication using Clerk
- ORM using Prisma
- MySQL database using Aiven
- Automation of Email notifications using Node Mailer and Gmail API integrated RPA script.
- Course sales anaytics automation

### Prerequisites

**Node version 18.x.x**

### Cloning the repository

```shell
[git clone https://github.com/s-1-n-t-h/LMS-RPA.git](https://github.com/s-1-n-t-h/LMS-RPA.git)
```

### Install packages

```shell
npm i
```

### Setup .env file

```js
# Created by Vercel CLI
CLERK_SECRET_KEY=
DATABASE_URL= 
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/"
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
NEXT_PUBLIC_TEACHER_ID=
UPLOADTHING_APP_ID=
UPLOADTHING_SECRET=

YOUTUBE_API_KEY=
CLIENT_ID=
CLIENT_SECRET=
REFRESH_TOKEN=
ACCESS_TOKEN=y
USER_EMAIL=
USER_PASS=

RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=

PAYMENT_LINK = 
```

### Setup Prisma

Add MySQL Database (I used PlanetScale)

```shell
npx prisma generate
npx prisma db push

```

### Start the app

```shell
npm run dev
```

## Available commands

Running commands with npm `npm run [command]`

| command | description                              |
| :------ | :--------------------------------------- |
| `dev`   | Starts a development instance of the app |
