const router = require("express").Router();
const Password = require("../models/password");
const bcrypt = require("bcryptjs");
const { passwordValidation } = require("../validation");
const { passwordStrength } = require('check-password-strength')

//Store Password
router.post("/passwords", async (req, res) => {
  // Validating user input
  try {
    await passwordValidation(req.body);
  } catch (error) {
    return res.status(400).send(error.details[0].message);
  }


  const userId = req.query.userId; 
  const strengthValue = passwordStrength(req.body.password);

  const password = new Password({
    source: req.body.source,
    email: req.body.email,
    password: req.body.password,
    strength: strengthValue.value,
    user: userId,
  });

  try {
    const savedPassword = await password.save();
    res.send(savedPassword);
  } catch (err) {
    res.status(400).send(err);
  }
});

//Fetch all passwords
router.get("/passwords", async (req, res) => {
  try {
    console.log(req)
    const userId = req.query.userId; 

    const passwords = await Password.find({ user: userId });

    console.log("Passwords for the user:", passwords);
    res.send(passwords);
  } catch (error) {
    console.error("Error finding passwords:", error);
    res.status(500).send("An error occurred while fetching passwords.");
  }
});

// Update an existing password
router.put("/passwords/:id", async (req, res) => {
  try {
    // Validate the updated data
    await passwordValidation(req.body);
    
    //Strength Check
  const strengthValue = passwordStrength(req.body.password)
  
    // Find the password entry by ID
    const updatedPassword = await Password.findByIdAndUpdate(
      req.params.id,
      {
        source: req.body.source,
        email: req.body.email,
        password: req.body.password,
        strength: strengthValue.value
      },
      { new: true }
    );
    if (!updatedPassword) {
      return res.status(404).json({ message: "Password not found" });
    }

    res.json(updatedPassword);
  } catch (error) {
    console.log(error)
    res
      .status(400)
      .json({ error });
  }
});

// Delete an existing password
router.delete("/passwords/:id", async (req, res) => {
  try {
    // Find the password entry by ID and delete it
    const deletedPassword = await Password.findByIdAndRemove(req.params.id);

    if (!deletedPassword) {
      return res.status(404).json({ message: "Password not found" });
    }

    res.json({ message: "Password deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
