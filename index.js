import express from "express";
import { dbConnection } from "./config/db.js";
import { userRouter } from "./routes/user_routes.js";
import { educationRouter } from "./routes/education_route.js";
// import session from "express-session";
// import MongoStore from "connect-mongo";
import "dotenv/config";
import { projectRouter } from "./routes/project_route.js";
import { ExperienceRouter } from "./routes/experience_route.js";
import { achievementRouter } from "./routes/achievement_route.js";
import { skillRouter } from "./routes/skills_route.js";
import { volunteeringRouter } from "./routes/volunteering_route.js";
import cors from "cors";
// import { restartServer } from "./restart_server.js";
import expressOasGenerator from '@mickeymond/express-oas-generator'
import mongoose from "mongoose";

const portfolioApp = express();

expressOasGenerator.handleResponses(portfolioApp, {
  alwaysServeDocs: true,
  tags: ['auth', 'userProfile', 'skills', 'projects', 'volunteering', 'experiences', 'education', 'achievements'],
  mongooseModels: mongoose.modelNames(),
})

const PORT = process.env.PORT || 8990;
portfolioApp.use(express.json());
portfolioApp.use(cors({ credentials: true, origin: 'http://localhost:5173' }));

// portfolioApp.use(
//   session({
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: true,
//     // Store session
//     store: MongoStore.create({
//       mongoUrl: process.env.connectionString,
//     }),
//   })
// );

portfolioApp.get("/api/v1/health", (req, res) => {
  res.json({ status: "UP" });
});

portfolioApp.use("/api/v1", userRouter);
portfolioApp.use("/api/v1", educationRouter);
portfolioApp.use("/api/v1", projectRouter);
portfolioApp.use("/api/v1", ExperienceRouter);
portfolioApp.use("/api/v1", achievementRouter);
portfolioApp.use("/api/v1", skillRouter);
portfolioApp.use("/api/v1", volunteeringRouter);

expressOasGenerator.handleRequests();
portfolioApp.use((req, res) => res.redirect('/api-docs/'));


dbConnection()
  .then(() => {
    portfolioApp.listen(PORT, () => {
      console.log(`Server is connected to Port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
    process.exit(-1);
  });
