const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth");
const securityRoutes = require("./routes/security");
const portfolioRoutes = require("./routes/portfolio");
const cryptoRoutes = require("./routes/crypto");

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use("/api", authRoutes);
app.use("/security", securityRoutes);
app.use("/portfolio", portfolioRoutes);
app.use("/crypto", cryptoRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  res.status(status).json({ message });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
