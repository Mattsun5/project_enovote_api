import { prisma } from '../lib/prisma.js'

async function getCandidate (req, res) {
  // retrieve specific user
  try {
    const id = Number(req.query.id);

    if (!id) {
      return res.status(400).json({ message: "Candidate ID is required" });
    }

    const candidate = await prisma.candidate.findUnique({
      where: { id }
    });

    if (!candidate) {
      return res.status(404).json({ message: "candidate not found" });
    }

    res.status(201).json({
      message: "candidate fetched successfully",
      data: election
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function allCandidates (req, res) {
  // Fetch all users
  try {
    const electionId = Number(req.query.id);

    if (!electionId) {
      return res.status(400).json({ message: "Election ID is required" });
    }
    const candidates = await prisma.candidate.findMany({
      where: { electionId }
    });
    res.status(200).json(candidates);
    // console.log('All elections:', JSON.stringify(elections, null, 2))
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}


async function updateCandidate (req, res) {
  // update user record
  try {
    const id = Number(req.query.id);
    const electionId = Number(req.query.electionId);

    if (!id) {
      return res.status(400).json({ message: "candidate ID is required" });
    }

    if (!electionId) {
      return res.status(400).json({ message: "election ID is required" });
    }
    const candidate = await prisma.candidate.findUnique({ where: { id } });
    const election = await prisma.election.findUnique({ where: { id: electionId } });

    if (election.startAt < Date(now())) {
        return res.status(409).json({ message: "Can't update candidate, Election already started" });
    }

    const updated = await prisma.candidate.update({
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
      message: "candidate updated successfully",
      data: updated
    });

  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ message: "candidate not found" });
    }
    res.status(500).json({ message: err.message });
  }
}


async function createCandidate (req, res) {
  // create new user
  try {

    // admin that created the candidate
    const approvedBy = req.params.id;
    const electionId = req.query.electionId;
    const userId = req.query.userId;

    // get avatar location and name
    // const avatar = ;
    const { manifesto, party } = req.body;

    const checkUser = await prisma.candidate.findUnique({ where: { userId } });
    const election = await prisma.election.findUnique({ where: { id: electionId } });

    if (!checkUser) {
        return res.status(409).json({ message: "User does not exist" });

    }
    if (election.startAt < Date(now())) {
        return res.status(409).json({ message: "Can't create candidate, Election already started" });
    }

    const newCandidate = await prisma.candidate.create({
      data: {
        approvedBy,
        electionId,
        userId,
        manifesto,
        party
      }
    });

    // password already secured globally in lib/prisma
    // const { password: _, ...safe } = newelection;
    res.status(201).json(newCandidate);

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