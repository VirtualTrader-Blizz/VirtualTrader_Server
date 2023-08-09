const bcrypt = require("bcryptjs");
const User = require("../models/user");
const Portfolio = require("../models/portfolio");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

exports.register = async (req, res, next) => {
  const { username, email, password } = req.body;
  let isCreate = false;

  await User.findUserByEmail(email).then((user) => {
    if (user[0].length !== 0) {
      isCreate = true;
      res.status(409).json({ message: "L'adresse e-mail est déjà inscrite." });
    }
  });

  if (isCreate) return;

  bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
      return User.createUser(username, email, hashedPassword);
    })
    .then(() => {
      const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      const verificationUrl = `${process.env.DOMAIN_NAME}/verify-email?token=${verificationToken}`;

      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      const mailOptions = {
        from: process.env.SMTP_USER,
        to: email,
        subject: `Vérification de l'adresse e-mail pour ${process.env.APP_NAME}`,
        text: `Veuillez cliquer sur le lien suivant pour vérifier votre adresse e-mail: ${verificationUrl}`,
      };

      return transporter.sendMail(mailOptions);
    })
    .then(() => {
      res.status(201).json({
        message:
          "Inscription réussie! Veuillez vérifier votre e-mail pour la vérification.",
      });
      return;
    })
    .catch((err) => {
      console.log(err);
      res
        .status(500)
        .json({ message: "Une erreur s’est produite lors de l’inscription." });
      return;
    });
};

exports.login = (req, res, next) => {
  const { email, password } = req.body;
  let loadedUser;
  let mailVerified = false;

  User.findUserByEmail(email)
    .then((user) => {
      if (!user[0].length) {
        mailVerified = true;
        res
          .status(500)
          .json({ message: "Utilisateur avec cet e-mail introuvable." });
        return;
      }

      loadedUser = user[0][0];

      if (loadedUser.isVerify !== 1) {
        const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET, {
          expiresIn: "1h",
        });
        const verificationUrl = `${process.env.DOMAIN_NAME}/verify-email?token=${verificationToken}`;

        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });

        const mailOptions = {
          from: process.env.SMTP_USER,
          to: email,
          subject: `Vérification de l'adresse e-mail pour ${process.env.APP_NAME}`,
          text: `Veuillez cliquer sur le lien suivant pour vérifier votre adresse e-mail: ${verificationUrl}`,
        };

        return transporter.sendMail(mailOptions).then(() => {
          res.status(500).json({ message: "Veuillez vérifier votre e-mail." });
          mailVerified = true;
        });
      }

      return bcrypt.compare(password, loadedUser.password_hash);
    })
    .then((isEqual) => {
      if (!isEqual) {
        if (mailVerified) return;
        return res.status(500).json({ message: "Mot de passe incorrect." });
      }

      const token = jwt.sign(
        {
          email: loadedUser.email,
          userId: loadedUser.user_id,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      if (mailVerified) return;
      res.status(200).json({ token, userId: loadedUser.user_id });
      return;
    })
    .catch((err) => {
      console.log(err);
      res.status(401).json({ message: err.message });
      return;
    });
};

exports.requestPasswordChange = (req, res, next) => {
  const { email } = req.body;

  User.findUserByEmail(email)
    .then((user) => {
      if (!user[0].length) {
        throw new Error("Utilisateur avec cet e-mail introuvable.");
      }

      const resetToken = jwt.sign({ email }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      const resetUrl = `${process.env.DOMAIN_NAME}/reset-password?token=${resetToken}`;

      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      const mailOptions = {
        from: process.env.SMTP_USER,
        to: email,
        subject: `Réinitialisation du mot de passe pour ${process.env.APP_NAME}`,
        text: `Veuillez cliquer sur le lien suivant pour réinitialiser votre mot de passe: ${resetUrl}`,
      };

      return transporter.sendMail(mailOptions);
    })
    .then(() => {
      res.status(200).json({
        message:
          "Le lien de réinitialisation du mot de passe a été envoyé à votre adresse e-mail.",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        message:
          "Une erreur s’est produite lors de la demande de changement de mot de passe.",
      });
    });
};

exports.changePassword = (req, res, next) => {
  const { token, newPassword } = req.body;

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Token non valide ou expiré." });
    }

    const email = decoded.email;

    bcrypt
      .hash(newPassword, 12)
      .then((hashedPassword) => {
        return User.updatePassword(email, hashedPassword);
      })
      .then(() => {
        res
          .status(200)
          .json({ message: "Mot de passe réinitialisé avec succès." });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          message: "Erreur lors de la réinitialisation du mot de passe.",
        });
      });
  });
};

exports.verifyEmail = async (req, res, next) => {
  const { token } = req.body;

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const userEmail = payload.email;
    const user = await User.findUserByEmail(userEmail);

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    User.updateVerify(true, user[0][0].user_id);
    await Portfolio.createPortfolioByUserId(user[0][0].user_id);

    return res.status(200).json({ message: "Email vérifié avec succès" });
  } catch (error) {
    console.error(error);
    return res
      .status(400)
      .json({ message: "Erreur lors de la vérification de l'email" });
  }
};
