/*
  Warnings:

  - Added the required column `day` to the `Room` table without a default value. This is not possible if the table is not empty.
  - Added the required column `time` to the `Room` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Room` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Room` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RoomType" AS ENUM ('MUSCULACION', 'FUNCIONAL');

-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "day" "DayOfWeek" NOT NULL,
ADD COLUMN     "teacherId" TEXT,
ADD COLUMN     "time" TEXT NOT NULL,
ADD COLUMN     "type" "RoomType" NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
