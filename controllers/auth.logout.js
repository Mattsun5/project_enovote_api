import { revokeToken } from "../services/token.service.js";

export async function logout(req, res) {
  try {
    const userId = req.user.id;
    const token = req.cookies.refresh_token;

    // delete refresh token from DB
    await prisma.refresh_token.delete({
      where: { userId },
    });
 
    if (token) await revokeToken(token);

    res.clearCookie("refresh_token");
      res.json({
        success: true,
        message: "Logged out successfully",
      });
  } catch (err) {
    res.status(500).json({ message: "Logout failed" });
  }
  
  // const userId = req.user.id;

  // console.log(`token on log out: ${token}`);
  // res.end("done");

//   res.json({ message: "Logged out" });
// }

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
}