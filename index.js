import express from "express";

import { router as apiRouter } from "./routes/index.js";

const app = express();

app.use("/api/v1", apiRouter);

app.listen(3000, () => {
  console.log("server started on port 3000");
});
