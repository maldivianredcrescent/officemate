import { prisma } from "@/lib/prisma";

export const authUserAction = async (credentials) => {
  // const user = await prisma.user.findUnique({
  //   where: {
  //     email: credentials.email,
  //   },
  // });

  return {
    email: "test@test.com",
    name: "test",
    password: "test",
  };
};
