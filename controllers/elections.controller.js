import { prisma } from '../lib/prisma.js'

async function getElection (req, res) {
  // retrieve specific user
  try {
    const id = Number(req.params.id);
    const userId = req.user.id;

    if (!id) {
      return res.status(400).json({ message: "Election ID is required" });
    }

    const election = await prisma.election.findUnique({
      where: { id },
      include: {
        candidate: {
          include: {
            user: {
              select: { f_name: true, l_name: true }
            },
            election_vote: true
          }
        },
        election_vote: true
      }
    });

    

    if (!election) {
      return res.status(404).json({ message: "Election not found" });
    }

    const userVote = await prisma.election_vote.findFirst({
      where: {
        id,
        userId
      }
    });

    const candidates = election.candidate.map(c => ({
      id: c.id,
      party: c.party,
      manifesto: c.manifesto,
      user: c.user,
      votes: c.election_vote.length
    }));

    res.status(201).json({
      success: true,
      election: {
        ...election,
        candidates
      },
      userVote: userVote
        ? { hasVoted: true, receipt: userVote.voteReceipt }
        : { hasVoted: false }
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function allElections (req, res) {
  // Fetch all elections
  try {
    const elections = await prisma.election.findMany({
      where: {
        startAt: { lte: new Date() },
        endAt: { gte: new Date() },
      },
      orderBy: { startAt: "desc" },
      include: {
        candidate: {
          include: {
            user: {
              select: { f_name: true, l_name: true }
            },
            election_vote: true
          }
        },
        election_vote: true
      }
    });
    res.json({ elections });
  } catch (err) {
    console.error("GET /elections ERROR:", err);
    res.status(500).json({ message: "Failed to fetch elections" });
  }
}


async function updateElection (req, res) {
  // update user record
  try {
    const id = Number(req.query.id);

    if (!id) {
      return res.status(400).json({ message: "election ID is required" });
    }
    const election = await prisma.election.findUnique({ where: { id } });
    if (election.startAt < Date(now())) {
        return res.status(409).json({ message: "Election already started" });
    }

    const updated = await prisma.election.update({
      where: { id },
      data: req.body // example: { f_name: "John", l_name: "Doe" }
      // to update specific data
      // data: {
      //   f_name: req.body.f_name,
      //   l_name: req.body.l_name,
      //   status: req.body.status
      // }
    });

    res.json({
      message: "election updated successfully",
      data: updated
    });

  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ message: "election not found" });
    }
    res.status(500).json({ message: err.message });
  }
}


async function createElection (req, res) {
  // create new user
  try {
  
    const { office_title, eligible_state, startAt, endAt } = req.body;
    // implement current logged in admin
    const adminId = req.params.id;
    // check if office title exist and date is not expired
    const exists = await prisma.election.findUnique({ where: { office_title } });
    if (exists) {
      if (startAt < exists.endAt){
        return res.status(409).json({ message: "Election already exist, ensure election ends before starting a new one." });
      }
    }

    const newElection = await prisma.election.create({
      data: {
        office_title, 
        eligible_state, 
        startAt, 
        endAt, 
        adminId
      }
    });

    // password already secured globally in lib/prisma
    // const { password: _, ...safe } = newelection;
    res.status(201).json(newElection);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

//   .then(async () => {
//     await prisma.$disconnect()
//   })
//   .catch(async (e) => {
//     console.error(e)
//     await prisma.$disconnect()
//     process.exit(1)
//   })

  export { 
    allElections, 
    getElection, 
    updateElection, 
    createElection 
  };