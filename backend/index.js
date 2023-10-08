const express = require("express")
const app = express()
const PORT = 3001
const connectDB = require("./DB/db");
const dotenv = require("dotenv");
const cors = require('cors')

app.use(cors()) 
dotenv.config();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Connecting the Database
connectDB();

 //Schema
const User = require("./models/user")

// Import Routes
const authRoutes = require("./routes/auth");
const passwordRoutes = require("./routes/store_password");

app.use("/user", authRoutes);
app.use("/user", passwordRoutes);

const server = app.listen(PORT, () =>
  console.log(`Server Connected to port ${PORT}`)
)
// Handling Error
process.on("unhandledRejection", err => {
  console.log(`An error occurred: ${err.message}`)
  server.close(() => process.exit(1))
})

