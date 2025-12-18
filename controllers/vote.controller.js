// controllers/vote.controller.js
import { prisma } from "../lib/prisma.js";
import crypto from 'crypto';

export const vote = async (req, res) => {
    try {
        const electionId = Number(req.params.id);
        const userId = req.user.id;
        const { candidateId } = req.body;


        // Check if user already voted in this election
        const alreadyVoted = await prisma.election_vote.findFirst({
            where: {
                userId,
                electionId
            }
        });

        if (alreadyVoted) {
            return res.status(409).json({
                message: "You have already voted in this election."
            });
        }

        // generate receipt
        const ids = `${userId} + ${electionId}`;
        const salt = crypto.randomBytes(16).toString('hex');
        const voteReceipt = crypto.scryptSync(ids.toString(), salt, 16).toString('hex');
        // const receipt = `EVT-${electionId}-${userId}-${crypto.randomUUID().slice(0,6)}`;

        // create new vote
        const vote = await prisma.election_vote.create({
          data: { 
            voteReceipt,
            userId, 
            candidateId, 
            electionId,
        },
        include: {
            candidate: {
            select: {
                id: true,
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

        // notify in real-time
        // req.io.on("connection", (socket) => {
        //     console.log("🟢 Socket connected:", socket.id);

        //     socket.on("join_election", (room) => {
        //         console.log("📥 Joined room:", room);
        //         socket.join(room);
        //     });
            

        //     socket.on("disconnect", () => {
        //         console.log("🔴 Socket disconnected:", socket.id);
        //     });
        // });
        req.io.to(`election_${electionId}`).emit("vote_update", {
            electionId,
        });
        // console.log(JSON.stringify(vote, null, 2));

        res.json({ 
            success: true,
            vote: {
                voteReceipt: vote.voteReceipt,
                votedAt: vote.createdAt,
                candidateId: vote.candidateId,
                candidateName: `${vote.candidate.user.f_name} ${vote.candidate.user.l_name}`,
                party: vote.candidate.party,
                avatar: vote.candidate.avatar,
            },
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    } 

}