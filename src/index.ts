import { NODE_ENV, PORT } from "./env";
import connectDB from "./db";
import app from "./app";

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(
      `Server running on port http://localhost:${PORT} at ${NODE_ENV}`
    );
  });
});
