// controllers/result.controller.js
import { prisma } from "../lib/prisma.js";

export async function getLiveResults(req, res) {
    try {
        const electionId = Number(req.params.id);
        const userId = req.user.id;

        if (!electionId) {
            return res.status(400).json({ message: "invalid election Id" });
        }

        // live result retrieved
        const results = await prisma.election_vote.groupBy({
          by: ["candidateId"],
          where: { electionId },
          _count: { candidateId: true }
        });
      
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
            results: results.map(r => ({
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
