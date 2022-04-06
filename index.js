const express = require("express");
const { createLogger, format, transports } = require("winston");
const ecsFormat = require("@elastic/ecs-winston-format");
const { logLevels } = require("./constants/loglevels");

const app = express();
const port = 3000;

const logger = createLogger({
  levels: logLevels,
  transports: [new transports.Console()],
  format: ecsFormat(),
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

function UserException(message) {
  this.error = {
    message: message,
    name: "UserException",
  };
  this.service = "backend-service";
  this.controller = "backend-controller";
}

app.get("/error", (req, res) => {
  try {
    throw new UserException("Something went wrong");
  } catch (err) {
    logger.error("Error", { err });
    res.send(err);
  }
});

app.listen(port, () => {
  logger.info(`Example app listening on port ${port}`);
});
