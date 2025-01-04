"use server";

import { S3, PutObjectCommand } from "@aws-sdk/client-s3";
import { File } from "buffer";
import { NextResponse } from "next/server";

const s3Client = new S3({
  forcePathStyle: false,
  endpoint: process.env.SPACES_ENDPOINT,
  region: "fra1",
  credentials: {
    accessKeyId: process.env.SPACES_KEY,
    secretAccessKey: process.env.SPACES_SECRET,
  },
});

export async function GET() {
  return Response.json({ status: true });
}

export async function POST(req) {
  try {
    const form = await req.formData();
    const file = form.get("file-input");

    if (!file) return NextResponse.json({ message: "failure" });

    const isFile = file instanceof File;

    if (!isFile) return NextResponse.json({ message: "failure" });

    const buffer = await file.arrayBuffer();

    const randomName = `${Math.random()
      .toString(36)
      .substring(2, 15)}${file.name.slice(file.name.lastIndexOf("."))}`;

    await s3Client.send(
      new PutObjectCommand({
        Bucket: process.env.SPACES_NAME,
        Key: `${process.env.SPACES_FOLDER}/${randomName}`,
        Body: Buffer.from(buffer),
        ACL: "public-read",
      })
    );

    return NextResponse.json({
      message: "success",
      fileUrl: `${process.env.SPACES_URL}${process.env.SPACES_FOLDER}/${randomName}`,
    });
  } catch (reason) {
    return NextResponse.json({ message: "failure" });
  }
}
