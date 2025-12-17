-- CreateTable
CREATE TABLE "election" (
    "id" SERIAL NOT NULL,
    "office_title" TEXT,
    "eligible_state" TEXT,
    "startAt" TIMESTAMP(3) NOT NULL,
    "endAt" TIMESTAMP(3) NOT NULL,
    "adminId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "election_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "candidate" (
    "id" SERIAL NOT NULL,
    "electionId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "manifesto" TEXT,
    "party" TEXT,
    "avatar" TEXT,
    "approvedBy" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "candidate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "election_vote" (
    "voteReceipt" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "electionId" INTEGER NOT NULL,
    "candidateId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "election_vote_pkey" PRIMARY KEY ("voteReceipt")
);

-- CreateIndex
CREATE UNIQUE INDEX "election_adminId_key" ON "election"("adminId");

-- CreateIndex
CREATE UNIQUE INDEX "candidate_electionId_key" ON "candidate"("electionId");

-- CreateIndex
CREATE UNIQUE INDEX "candidate_userId_key" ON "candidate"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "candidate_approvedBy_key" ON "candidate"("approvedBy");

-- CreateIndex
CREATE UNIQUE INDEX "election_vote_userId_key" ON "election_vote"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "election_vote_electionId_key" ON "election_vote"("electionId");

-- CreateIndex
CREATE UNIQUE INDEX "election_vote_candidateId_key" ON "election_vote"("candidateId");

-- AddForeignKey
ALTER TABLE "election" ADD CONSTRAINT "election_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "candidate" ADD CONSTRAINT "candidate_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "candidate" ADD CONSTRAINT "candidate_electionId_fkey" FOREIGN KEY ("electionId") REFERENCES "election"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "candidate" ADD CONSTRAINT "candidate_approvedBy_fkey" FOREIGN KEY ("approvedBy") REFERENCES "admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "election_vote" ADD CONSTRAINT "election_vote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "election_vote" ADD CONSTRAINT "election_vote_electionId_fkey" FOREIGN KEY ("electionId") REFERENCES "election"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "election_vote" ADD CONSTRAINT "election_vote_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "candidate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
