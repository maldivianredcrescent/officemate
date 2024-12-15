"use server";

import { prisma } from "@/lib/prisma";
import { actionClient } from "@/lib/safe-action";
import { userSchema } from "@/schemas/userSchemas";
import { hash } from "@node-rs/argon2";
import { z } from "zod";

export const getUsersAction = actionClient
  .schema(
    z.object({ skip: z.number().optional(), limit: z.number().optional() })
  )
  .action(async ({ parsedInput }) => {
    const users = await prisma.user.findMany({
      orderBy: { updated_at: "desc" },
      skip: parsedInput.skip,
      take: parsedInput.limit,
    });
    const totalUsers = await prisma.user.count();
    return { users, totalUsers, success: true };
  });

export const getUserByIdAction = actionClient
  .schema(z.object({ id: z.string().min(1, "User ID is required") }))
  .action(async ({ parsedInput }) => {
    const user = await prisma.user.findUnique({
      where: { id: parsedInput.id },
    });

    if (!user) {
      return {
        status: false,
        error: "User not found",
      };
    }

    return { user, success: true };
  });

export const updateUserAction = actionClient
  .schema(userSchema)
  .action(async ({ parsedInput }) => {
    const passwordHash = await hash(parsedInput.password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });

    if (parsedInput.password) {
      const user = await prisma.user.update({
        where: { id: parsedInput.id },
        data: {
          ...{ email: parsedInput.email, name: parsedInput.name },
          password_hash: passwordHash,
        },
      });
      return { user, success: true };
    } else {
      const user = await prisma.user.update({
        where: { id: parsedInput.id },
        data: {
          email: parsedInput.email,
          name: parsedInput.name,
        },
      });
      return { user, success: true };
    }
  });
