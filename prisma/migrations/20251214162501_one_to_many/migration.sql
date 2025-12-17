/*
  Warnings:

  - The primary key for the `election_vote` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[userId,electionId]` on the table `candidate` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[voteReceipt]` on the table `election_vote` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,electionId]` on the table `election_vote` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "candidate_electionId_key";

-- DropIndex
DROP INDEX "election_adminId_key";

-- DropIndex
DROP INDEX "election_vote_candidateId_key";

-- DropIndex
DROP INDEX "election_vote_electionId_key";

-- DropIndex
DROP INDEX "election_vote_userId_key";

-- AlterTable
ALTER TABLE "election_vote" DROP CONSTRAINT "election_vote_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "election_vote_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "candidate_userId_electionId_key" ON "candidate"("userId", "electionId");

-- CreateIndex
CREATE UNIQUE INDEX "election_vote_voteReceipt_key" ON "election_vote"("voteReceipt");

-- CreateIndex
CREATE UNIQUE INDEX "election_vote_userId_electionId_key" ON "election_vote"("userId", "electionId");
