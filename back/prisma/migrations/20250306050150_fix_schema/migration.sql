/*
  Warnings:

  - You are about to drop the column `category` on the `Exercise` table. All the data in the column will be lost.
  - You are about to drop the column `repetitions` on the `Exercise` table. All the data in the column will be lost.
  - You are about to drop the column `series` on the `Exercise` table. All the data in the column will be lost.
  - You are about to drop the column `categories` on the `Routine` table. All the data in the column will be lost.
  - The primary key for the `RoutineExercise` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `musclue` to the `Exercise` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Routine` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `day` on the `Routine` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - The required column `id` was added to the `RoutineExercise` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `repetitions` to the `RoutineExercise` table without a default value. This is not possible if the table is not empty.
  - Added the required column `series` to the `RoutineExercise` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "DayOfWeek" AS ENUM ('LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO');

-- CreateEnum
CREATE TYPE "Musclues" AS ENUM ('PECHO', 'ESPALDA', 'BICEPS', 'TRICEPS', 'HOMBROS', 'PIERNAS', 'CORE');

-- DropForeignKey
ALTER TABLE "RoutineExercise" DROP CONSTRAINT "RoutineExercise_exerciseId_fkey";

-- DropForeignKey
ALTER TABLE "RoutineExercise" DROP CONSTRAINT "RoutineExercise_routineId_fkey";

-- AlterTable
ALTER TABLE "Exercise" DROP COLUMN "category",
DROP COLUMN "repetitions",
DROP COLUMN "series",
ADD COLUMN     "musclue" "Musclues" NOT NULL;

-- AlterTable
ALTER TABLE "Routine" DROP COLUMN "categories",
ADD COLUMN     "userId" TEXT NOT NULL,
DROP COLUMN "day",
ADD COLUMN     "day" "DayOfWeek" NOT NULL;

-- AlterTable
ALTER TABLE "RoutineExercise" DROP CONSTRAINT "RoutineExercise_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "repetitions" INTEGER NOT NULL,
ADD COLUMN     "series" INTEGER NOT NULL,
ADD CONSTRAINT "RoutineExercise_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "Routine" ADD CONSTRAINT "Routine_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoutineExercise" ADD CONSTRAINT "RoutineExercise_routineId_fkey" FOREIGN KEY ("routineId") REFERENCES "Routine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoutineExercise" ADD CONSTRAINT "RoutineExercise_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
