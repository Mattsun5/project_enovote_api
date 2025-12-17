import { prisma } from "../lib/prisma.js";
import bcrypt from "bcrypt";
import crypto from "crypto";

export const seedDatabase = async (req, res) => {
  try {
    // 🔴 OPTIONAL: clear existing data (DEV ONLY)
    await prisma.election_vote.deleteMany();
    await prisma.candidate.deleteMany();
    await prisma.election.deleteMany();
    await prisma.refresh_token.deleteMany();
    await prisma.admin.deleteMany();
    await prisma.user.deleteMany();

    const password = await bcrypt.hash("password123", 10);

    /* ======================
       USERS (10)
    ====================== */
    const users = await Promise.all(
      Array.from({ length: 10 }).map((_, i) =>
        prisma.user.create({
          data: {
            email: `user${i + 1}@test.com`,
            f_name: `User${i + 1}`,
            l_name: "Tester",
            password,
            role: i < 3 ? "admin" : "user",
            status: "active",
          },
        })
      )
    );

    /* ======================
       ADMINS (3)
    ====================== */
    const admins = await Promise.all(
      users
        .filter((u) => u.role === "admin")
        .map((adminUser) =>
          prisma.admin.create({
            data: {
              userId: adminUser.id,
            },
          })
        )
    );

    /* ======================
       ELECTIONS (3)
    ====================== */
    const elections = await Promise.all(
      admins.map((admin, i) =>
        prisma.election.create({
          data: {
            office_title: `Office ${i + 1}`,
            eligible_state: "Lagos",
            startAt: new Date(Date.now() - 60 * 60 * 1000),
            endAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
            adminId: admin.id,
          },
        })
      )
    );

    /* ======================
       CANDIDATES (one per election)
    ====================== */
    const candidates = await Promise.all(
      elections.map((election, i) =>
        prisma.candidate.create({
          data: {
            electionId: election.id,
            userId: users[i + 3].id, // normal users
            approvedBy: admins[0].id,
            manifesto: "Transparency and growth",
            party: "Demo Party",
            avatar: "https://via.placeholder.com/150",
          },
        })
      )
    );

    /* ======================
       REFRESH TOKENS (10)
    ====================== */
    await Promise.all(
      users.map((user) =>
        prisma.refresh_token.create({
          data: {
            token: crypto.randomBytes(40).toString("hex"),
            userId: user.id,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          },
        })
      )
    );

    /* ======================
       ELECTION VOTES (7)
    ====================== */
    await Promise.all(
      users.slice(3, 10).map((user, i) =>
        prisma.election_vote.create({
          data: {
            voteReceipt: crypto.randomUUID(),
            userId: user.id,
            electionId: elections[i % elections.length].id,
            candidateId: candidates[i % candidates.length].id,
          },
        })
      )
    );

    return res.json({
      success: true,
      message: "Database seeded successfully",
    });
  } catch (err) {
    console.error("SEED ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};
