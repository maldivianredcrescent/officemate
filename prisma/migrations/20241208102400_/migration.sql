-- CreateTable
CREATE TABLE "WorkplanProject" (
    "id" TEXT NOT NULL,
    "workplanId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "WorkplanProject_pkey" PRIMARY KEY ("id")
);
