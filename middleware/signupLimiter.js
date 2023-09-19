const rateLimit = require("express-rate-limit");
const { logEvents } = require("./logger");

const signupLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 3, // Limitez chaque adresse IP à 3 tentatives d'inscription par minute
  message: {
    message:
      "Trop de tentatives d'inscription pour cette IP, réessayez dans 1 minute",
  },
  handler: (req, res, next, options) => {
    logEvents(
      `Trop de demandes : ${options.message.message}\t${req.method}\t${req.url}\t${req.headers.origin}`,
      "errLog.log"
    );
    res.status(options.statusCode).send(options.message);
  },
  standardHeaders: true, // Retournez les informations sur la limite de taux dans les en-têtes `RateLimit-*`
  legacyHeaders: false, // Désactivez les en-têtes `X-RateLimit-*`
});

module.exports = signupLimiter;
