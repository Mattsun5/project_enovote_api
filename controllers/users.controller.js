import { prisma } from '../lib/prisma.js';
import { sendOtp } from "../controllers/otp.controller.js";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

async function getUser (req, res) {
  // retrieve specific user
  try {
    const id = Number(req.params.id);

    if (!id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(201).json({
      // message: "User fetched successfully",
      success: true,
      user: req.user
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function allUsers (req, res) {
  // Fetch all users
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
    // console.log('All users:', JSON.stringify(users, null, 2))
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}


async function updateUser (req, res) {
  // update user record
  try {
    const id = Number(req.params.id);

    if (!id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const updated = await prisma.user.update({
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
      message: "User updated successfully",
      data: updated
    });

  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(500).json({ message: err.message });
  }
}

async function deleteUser (req, res) {
  // delete user record
  try {
    const id = Number(req.query.id);

    if (!id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const deleted = await prisma.user.delete({
      where: { id }
    });

    res.json({
      message: "User deleted successfully",
      data: deleted
    });

  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(500).json({ message: error.message });
  }
}

async function createNewUser (req, res) {
  // create new user
  try {
    const { email, password, f_name, l_name } = req.body;

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const hashed = await bcrypt.hash(password, SALT_ROUNDS);

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashed,
        f_name,
        l_name,
        role: "user",
        status: "pending"
      },
    });

    await sendOtp(email);

    return res.status(201).json({
      newUser,
      success: true,
      message: "Registration successful. OTP sent to email.",
    });
    // password already secured globally in lib/prisma
    // const { password: _, ...safe } = newUser;
    // res.status(201).json({
    //   newUser,
    //   success: true
    // });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Registration failed" });
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

  export { allUsers, createNewUser, getUser, updateUser, deleteUser };