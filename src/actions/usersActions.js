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
      include: { unit: true },
    });
    const units = await prisma.unit.findMany();
    const totalUsers = await prisma.user.count();
    return { users, units, totalUsers, success: true };
  });

export const getUserByIdAction = actionClient
  .schema(z.object({ id: z.string().min(1, "User ID is required") }))
  .action(async ({ parsedInput }) => {
    const user = await prisma.user.findUnique({
      where: { id: parsedInput.id },
      include: { unit: true },
    });

    if (!user) {
      return {
        status: false,
        error: "User not found",
      };
    }
    const units = await prisma.unit.findMany();

    return { user, units, success: true };
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
          ...{
            email: parsedInput.email,
            name: parsedInput.name,
            unitId: parsedInput.unitId,
            role: parsedInput.role,
            designation: parsedInput.designation,
          },
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
          unitId: parsedInput.unitId,
          role: parsedInput.role,
          designation: parsedInput.designation,
        },
      });
      return { user, success: true };
    }
  });

export const updateUserSignatureAction = actionClient
  .schema(
    z.object({
      id: z.string().min(1, "User ID is required"),
      signatureUrl: z.string().min(1, "Signature URL is required"),
    })
  )
  .action(async ({ parsedInput }) => {
    const user = await prisma.user.update({
      where: { id: parsedInput.id },
      data: { signatureUrl: parsedInput.signatureUrl },
    });
    return { user, success: true };
  });
