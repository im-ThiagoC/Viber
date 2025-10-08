-- CreateTable
CREATE TABLE "Usage" (
    "key" TEXT NOT NULL,
    "points" INTEGER NOT NULL,
    "expiry" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Usage_pkey" PRIMARY KEY ("key")
);
