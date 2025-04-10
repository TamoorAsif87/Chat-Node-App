import mongoose from "mongoose";
import { config } from "./config";
import Logger from "bunyan";

const logger: Logger = config.createLogger("Database");

export default () => {
  const connection = () => {
    mongoose
      .connect(`${config.Database_Url}`)
      .then(() => logger.info("Database is connected successfully."))
      .catch((err) => {
        logger.error("Error while connecting to database");
        process.exit(1);
      });
  };

  connection();

  mongoose.connection.on("disconnected", connection);
};
