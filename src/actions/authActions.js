"use server";

import { hash, verify } from "@node-rs/argon2";
import { actionClient } from "@/lib/safe-action";
import { v4 } from "uuid";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export const authenticateUser = async ({ email, password }) => {
  const userDetails = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (!userDetails) {
    return {
      user: null,
      status: false,
      error: "Sorry, we couldn't find your account. Please try again.",
    };
  }

  const validPassword = await verify(userDetails.password_hash, password, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });

  if (!validPassword) {
    return {
      user: null,
      status: false,
      error: "Incorrect username or password",
    };
  }

  return { status: true, user: userDetails };
};

export const createUser = actionClient
  .schema(
    z.object({
      email: z.string().email({
        message: "Invalid email address.",
      }),
      password: z.string().min(8, {
        message: "Password must be at least 8 characters.",
      }),
      name: z.string().min(3, {
        message: "Name must be at least 3 characters.",
      }),
    })
  )
  .action(async ({ parsedInput: { email, password, name } }) => {
    // Validate input
    // Validate input
    if (!email || !password || !name) {
      return {
        status: false,
        error: "Email, password, and name are required",
      };
    }
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (existingUser) {
      return {
        status: false,
        error: "User already exists",
      };
    }

    const passwordHash = await hash(password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });

    const userId = v4();
    const newUser = await prisma.user.create({
      data: {
        id: userId,
        email: email,
        password_hash: passwordHash,
        name: name,
      },
    });
    if (!newUser) {
      return {
        status: false,
        error: "Failed to create user",
      };
    }

    return { user: newUser, success: true };
  });
