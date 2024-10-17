import dotenv from "dotenv";


import connectDB from "./src/db/db.js";
import app from "./app.js";
dotenv.config();
connectDB()
  .then(() => {
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`server is running at port ${port}`);
    });
  })
  .catch((err) => {
    console.log("mongodb connection failed !!! :", err);
  });
