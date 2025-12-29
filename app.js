import express from "express";
import http from "http";
import { Server } from "socket.io";
import "dotenv/config";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import logger from "morgan";
import path from "path";
import seedRoutes from "./routes/seed.route.js";
import { fileURLToPath } from 'url';

import userRouter from "./routes/users.js";
import authRoutes from "./routes/auth.routes.js";
// import resultRoutes from "./routes/results.js";
import electionRoutes from "./routes/elections.routes.js";
// import voteRoutes from "./routes/vote.routes.js";
// import { initSocket } from "./config/socket.js";

// initializing __filename and __dirname for "type" : "module"
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// origins
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://e-vote-sandy.vercel.app"
];

// initialization
const app = express();
const port = process.env.PORT || 5000;

const server = http.createServer(app);
// const io = initSocket(server);

// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:5173",
//     transports: ["polling"], //for vercel
//     credentials: true
//   },
const io = new Server(server, {
  cors: {
    origin: "https://e-vote-sandy.vercel.app",
    transports: ["polling"], //for vercel
    credentials: true
  },
  path: "/socket.io/",
});


io.on("connection", (socket) => {
    console.log("🟢 Socket connected:", socket.id);

    socket.on("join_election", (room) => {
        console.log("📥 Joined room:", room);
        socket.join(room);
    });

    // io.to(`election_${electionId}`).emit("vote_update", {
    //     electionId,
    // });

    socket.on("disconnect", () => {
        console.log("🔴 Socket disconnected:", socket.id);
    });
});
// attach io instance globally
app.use((req, res, next) => {
  req.io = io;
  next();
});

// io.on("connection", socket => {
//   console.log("Client connected");
// });

// io.on("connection", (socket) => {
//   console.error("Socket connected:");
//   console.log(" Socket connected:", socket.id);

//   // socket.on("join_election", (room) => {
//   //   socket.join(room);
//   //   console.log("Joined room:", room);
//   // });

//   socket.on("disconnect", () => {
//     console.log("🔴 Socket disconnected");
//   });
// });

// MIDDLEWARES
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// Security middleware
app.use(helmet());

// CORS configuration
// app.use(
//   cors({
//     origin: process.env.CLIENT_URL || "*",
//     credentials: true,
//   })
// );



app.use(
  cors({
    origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps, curl)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("CORS: Origin not allowed"), false);
    }
  },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
  })
);

// routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/dev", seedRoutes);
// app.use("/api/v1/results", resultRoutes);
app.use("/api/v1/elections", electionRoutes);

// 404 Middleware 
app.use((req, res) => {
  res.status(404).send('404 Not Found: The requested resource does not exist');
});

// error-handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});
// run server
server.listen(port, (err) => {
    if (err) {
        console.error(`failed to connect to server: ${err}`)
    }
    console.log(`server running on port: ${port}`)
})