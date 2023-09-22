const dotenv = require("dotenv").config();
require("express-async-errors");
const express = require("express");
const app = express();
const connectDB = require("./config/db");
const cors = require("cors");
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++//
//++++++++++  Ajout FullStack pour déploiement ++++++++++++//
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++//
const path = require("path");
const { logger, logEvents } = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");
const cookieParser = require("cookie-parser");

const corsOptions = require("./config/corsOptions");

const mongoose = require("mongoose"); // pourquoi ?
const port = process.env.PORT || 5000;
// const port = 5000;
// console.log(process.env.NODE_ENV);

// Importation Nodemailer***
const nodemailer = require("nodemailer");

// Configuration Nodemailer***
const transporter = nodemailer.createTransport({
  service: "yahoo",
  auth: {
    // user: process.env.EMAIL_USERNAME,
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++//

// Authorisation CORS
app.use(cors(corsOptions));
// app.use(
//   cors({
//     origin: "http://localhost:3000",
//     credentials: true,
//     optionsSuccessStatus: 200,
//   })
// );

// Middleware qui permet de traiter les données de la Request
// Built-in Middleware
app.use(express.json());

// Route pour envoyer un e-mail***
app.post("/send-email", async (req, res) => {
  try {
    const { to, subject, text } = req.body;

    // Options de l'e-mail
    const mailOptions = {
      from: {
        name: "Melissande de BricAppBrac",
        address: process.env.EMAIL_FRONT,
      },
      to: to,
      subject: subject,
      text: text,
    };

    // Envoi de l'e-mail
    await transporter.sendMail(mailOptions);
    console.log("Email envoyé avec succès");
    res.status(200).json({ message: "E-mail envoyé avec succès" });
  } catch (error) {
    console.log("Erreur lors de l'envoi de l'email: " + error);
    console.error(error);
    res.status(500).json({ message: "Erreur lors de l'envoi de l'e-mail" });
  }
});

// connexion à la DB
connectDB();

// on place le logger avant tout le reste
app.use(logger);

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++//
//++++++++++  Ajout FullStack pour déploiement ++++++++++++//
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++//
// gestion des cookies
app.use(cookieParser());
// on lui dit où chercher les pages statiques
app.use("/", express.static(path.join(__dirname, "public")));
// s'écrit aussi :
// app.use(express.static("public"));
app.use("/", require("./routes/root"));
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++//

app.use(express.urlencoded({ extended: false }));

app.use("/auth", require("./routes/auth.routes"));
app.use("/recipe", require("./routes/recipe.routes"));
app.use("/user", require("./routes/user.routes"));
app.use("/menu", require("./routes/menu.routes"));
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++//
//++++++++++  Ajout FullStack pour déploiement ++++++++++++//
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++//
// Page 404, à traiter après les autres routes

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ message: "404 Not Found" });
  } else {
    res.type("txt").send("404 not found");
  }
});
// appel errorHandler

app.use(errorHandler);

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(port, () => console.log("Le serveur a démarré au port  " + port));
});

mongoose.connection.on("error", (err) => {
  console.log(err);
  logEvents(
    `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
    "mongoErrLog.log"
  );
});

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++//
// Lancer le serveur
// app.listen(port, () => console.log("Le serveur a démarré au port  " + port));
