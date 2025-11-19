/*
  Warnings:

  - The values [ADMIN] on the enum `UserRole` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `communityId` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `communityId` on the `Listing` table. All the data in the column will be lost.
  - You are about to drop the column `defaultCommunityId` on the `UserSettings` table. All the data in the column will be lost.
  - You are about to drop the `Community` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CommunityMember` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "UserRole_new" AS ENUM ('USER', 'SUPERADMIN');
ALTER TABLE "public"."User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "UserRole_new" USING ("role"::text::"UserRole_new");
ALTER TYPE "UserRole" RENAME TO "UserRole_old";
ALTER TYPE "UserRole_new" RENAME TO "UserRole";
DROP TYPE "public"."UserRole_old";
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'USER';
COMMIT;

-- DropForeignKey
ALTER TABLE "public"."Community" DROP CONSTRAINT "Community_adminId_fkey";

-- DropForeignKey
ALTER TABLE "public"."CommunityMember" DROP CONSTRAINT "CommunityMember_communityId_fkey";

-- DropForeignKey
ALTER TABLE "public"."CommunityMember" DROP CONSTRAINT "CommunityMember_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Event" DROP CONSTRAINT "Event_communityId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Listing" DROP CONSTRAINT "Listing_communityId_fkey";

-- DropForeignKey
ALTER TABLE "public"."UserSettings" DROP CONSTRAINT "UserSettings_defaultCommunityId_fkey";

-- DropIndex
DROP INDEX "public"."Event_communityId_idx";

-- DropIndex
DROP INDEX "public"."Listing_communityId_idx";

-- DropIndex
DROP INDEX "public"."UserSettings_defaultCommunityId_idx";

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "communityId",
ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "longitude" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Listing" DROP COLUMN "communityId",
ADD COLUMN     "city" TEXT,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "longitude" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "UserSettings" DROP COLUMN "defaultCommunityId";

-- DropTable
DROP TABLE "public"."Community";

-- DropTable
DROP TABLE "public"."CommunityMember";

-- DropEnum
DROP TYPE "public"."CommunityStatus";

-- DropEnum
DROP TYPE "public"."MemberRole";

-- DropEnum
DROP TYPE "public"."MemberStatus";

-- CreateIndex
CREATE INDEX "Event_latitude_longitude_idx" ON "Event"("latitude", "longitude");

-- CreateIndex
CREATE INDEX "Listing_latitude_longitude_idx" ON "Listing"("latitude", "longitude");
