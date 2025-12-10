import { revokeToken } from "../services/token.service.js";

export async function logout(req, res) {
  const token = req.cookies.refresh_token;

  // console.log(`token on log out: ${token}`);
  // res.end("done");
  if (token) await revokeToken(token);

  res.clearCookie("refresh_token");
  res.json({ message: "Logged out" });
}

// async function deleteUserToken (req, res) {
//   // delete user record
//   try {
//     const id = Number(req.param.id);

//     if (!id) {
//       return res.status(400).json({ message: "User ID is missing" });
//     }

//     await prisma.refresh_token.delete({
//       where: { id }
//     });
//     // res.json({
//     //   message: "User deleted successfully",
//     //   data: deleted
//     // });

//   } catch (error) {
//     if (error.code === "P2025") {
//       return res.status(404).json({ message: "Token not found" });
//     }
//     res.status(500).json({ message: error.message });
//   }
// }