//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++//
//++++++++++  Ajout FullStack pour déploiement ++++++++++++//
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++//
const { format } = require("date-fns");
const { v4: uuid } = require("uuid");
const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");

const logEvents = async (message, logFileName) => {
  const dateTime = `${format(new Date(), "yyyyMMdd\tHH:mm:ss")}`;
  const logItem = `${dateTime}\t${uuid()}\t${message}\n`;

  try {
    if (!fs.existsSync(path.join(__dirname, "..", "logs"))) {
      await fsPromises.mkdir(path.join(__dirname, "..", "logs"));
    }
    await fsPromises.appendFile(
      path.join(__dirname, "..", "logs", logFileName),
      logItem
    );
  } catch (err) {
    console.log(err);
  }
};

const logger = (req, res, next) => {
  // A conditionner si les logs sont trop volumineux et qu'on ne veut pas prendre les provenances de notre url... A voir
  logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`, "reqLog.log");
  console.log(`${req.method} ${req.path}`);
  // appel au prochain middleware ou au contrôleur où la demande serait traitée
  next();
};

module.exports = { logEvents, logger };
