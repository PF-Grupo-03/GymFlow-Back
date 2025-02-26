/*
  Warnings:

  - You are about to drop the column `desciption` on the `Exercise` table. All the data in the column will be lost.
  - You are about to drop the column `muscleGroup` on the `Routine` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Routine` table. All the data in the column will be lost.
  - You are about to drop the column `repetitions` on the `Routine` table. All the data in the column will be lost.
  - Added the required column `repetitions` to the `Exercise` table without a default value. This is not possible if the table is not empty.
  - Added the required column `series` to the `Exercise` table without a default value. This is not possible if the table is not empty.
  - Added the required column `day` to the `Routine` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Exercise" DROP COLUMN "desciption",
ADD COLUMN     "repetitions" INTEGER NOT NULL,
ADD COLUMN     "series" INTEGER NOT NULL,
ALTER COLUMN "gifUrl" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Routine" DROP COLUMN "muscleGroup",
DROP COLUMN "name",
DROP COLUMN "repetitions",
ADD COLUMN     "day" TEXT NOT NULL;
