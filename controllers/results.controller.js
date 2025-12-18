// controllers/result.controller.js
import { prisma } from "../lib/prisma.js";

export async function getLiveResults(req, res) {
    try {
        const electionId = Number(req.params.id);
        const userId = req.user.id;

        if (!electionId) {
            return res.status(400).json({ message: "invalid election Id" });
        }

        // ALL users are eligible
        const totalEligibleVoters = await prisma.user.count();
        // console.log(`totalEligibleVoters: ${totalEligibleVoters}`);

        // vote grouped by candidate
        const groupedVotes = await prisma.election_vote.groupBy({
          by: ["candidateId"],
          where: { electionId },
          _count: { candidateId: true }
        });

        const totalVotes = groupedVotes.reduce(
            (sum, r) => sum + r._count.candidateId,
            0
        );
        // console.log(`totalVotes: ${totalVotes}`);

        const turnoutPercentage =
         totalEligibleVoters > 0
            ? ((totalVotes / totalEligibleVoters) * 100).toFixed(1)
            : "0.0";
        // console.log(`turnoutPercentage: ${turnoutPercentage}`);

        // leading candidate
        const leading = groupedVotes.sort(
            (a, b) => b._count.candidateId - a._count.candidateId
        )[0];

        let leadingCandidate = null;

        if (leading) {
            const candidate = await prisma.candidate.findUnique({
                where: { id: leading.candidateId },
                include: {
                user: { select: { f_name: true, l_name: true } },
                },
            });

            leadingCandidate = {
                id: candidate.id,
                name: `${candidate.user.f_name} ${candidate.user.l_name}`,
                party: candidate.party,
                votes: leading._count.candidateId,
            };
        }
        // console.log(`leadingCandidate: ${leadingCandidate}`);

        // Fetch user's vote (if any)
        const userVote = await prisma.election_vote.findFirst({
            where: { electionId, userId },
            include: {
                candidate: {
                select: {
                    party: true,
                    user: {
                    select: {
                        f_name: true,
                        l_name: true,
                    },
                    },
                },
                },
            },
        });
        // console.log(JSON.stringify(userVote, null, 2));
    
        res.json({
            success: true,
            electionId,
            totalVotes,
            totalEligibleVoters,
            turnoutPercentage,
            leadingCandidate,
            results: groupedVotes.map(r => ({
                candidateId: r.candidateId,
                votes: r._count.candidateId,
            })),
            userVote: userVote
                ? {
                    hasVoted: true,
                    voteReceipt: userVote.voteReceipt,
                    candidateId: userVote.candidateId,
                    votedAt: userVote.createdAt,
                    candidateName: `${userVote.candidate.user.f_name} ${userVote.candidate.user.l_name}`,
                    party: userVote.candidate.party,
                }
                : {
                    hasVoted: false,
                },
        });

    } catch (err) {
        res.status(500).json({ message: "Failed to fetch live results" });

    }
}
