import { app } from "./app/app.js";
import { connectDB } from "./app/db/mongodb/connectDB.js";
import { PORT } from "./app/config/env.js";

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});
