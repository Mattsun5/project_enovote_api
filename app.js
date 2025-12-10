import express from "express";
import "dotenv/config";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import logger from "morgan";
import path from "path";
import { fileURLToPath } from 'url';

import userRouter from "./routes/users.js";
import authRoutes from "./routes/auth.routes.js";
// import voteRoutes from "./routes/vote.routes.js";

// initializing __filename and __dirname for "type" : "module"
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// initialization
const app = express();
const port = process.env.PORT || 5000;

// MIDDLEWARES
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// Security middleware
// app.use(helmet());

// CORS configuration
// app.use(
//   cors({
//     origin: process.env.CLIENT_URL || "*",
//     credentials: true,
//   })
// );
app.use(
  cors({
    origin: "http://127.0.0.1:5500" || "*",
    credentials: true
  })
);

// routes
app.use("/users", userRouter);
app.use("/auth", authRoutes);

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
app.listen(port, (err) => {
    if (err) {
        console.error(`failed to connect to server: ${err}`)
    }
    console.log(`server running on port: ${port}`)
})