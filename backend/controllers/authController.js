const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const cleanName =
      typeof name === "string"
        ? name.trim()
        : "";

    const cleanEmail =
      typeof email === "string"
        ? email.trim().toLowerCase()
        : "";

    // Name validation
    if (!cleanName) {
      return res.status(400).json({
        message: "Name is required",
      });
    }

    if (
      cleanName.length < 2 ||
      cleanName.length > 50
    ) {
      return res.status(400).json({
        message:
          "Name must be between 2 and 50 characters",
      });
    }

    // Email validation
    if (!cleanEmail) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    if (!EMAIL_REGEX.test(cleanEmail)) {
      return res.status(400).json({
        message: "Please enter a valid email address",
      });
    }

    // Password validation
    if (
      typeof password !== "string" ||
      !password
    ) {
      return res.status(400).json({
        message: "Password is required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message:
          "Password must be at least 6 characters long",
      });
    }

    const checkQuery =
      "SELECT * FROM users WHERE email = ?";

    db.query(
      checkQuery,
      [cleanEmail],
      async (err, result) => {
        if (err) {
          console.log(err);

          return res.status(500).json({
            message: "Database error",
          });
        }

        if (result.length > 0) {
          return res.status(400).json({
            message: "User already exists",
          });
        }

        try {
          const hashedPassword =
            await bcrypt.hash(password, 10);

          const insertQuery =
            "INSERT INTO users(name,email,password) VALUES(?,?,?)";

          db.query(
            insertQuery,
            [
              cleanName,
              cleanEmail,
              hashedPassword,
            ],
            (err) => {
              if (err) {
                console.log(err);

                return res.status(500).json({
                  message: "Database error",
                });
              }

              return res.status(201).json({
                message:
                  "User Registered Successfully",
              });
            }
          );
        } catch (error) {
          console.log(error);

          return res.status(500).json({
            message: "Registration failed",
          });
        }
      }
    );
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Registration failed",
    });
  }
};

const loginUser = (req, res) => {
  try {
    const { email, password } = req.body;

    const cleanEmail =
      typeof email === "string"
        ? email.trim().toLowerCase()
        : "";

    // Email validation
    if (!cleanEmail) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    if (!EMAIL_REGEX.test(cleanEmail)) {
      return res.status(400).json({
        message: "Please enter a valid email address",
      });
    }

    // Password validation
    if (
      typeof password !== "string" ||
      !password
    ) {
      return res.status(400).json({
        message: "Password is required",
      });
    }
    const query =
      "SELECT * FROM users WHERE email = ?";

    db.query(
      query,
      [cleanEmail],
      async (err, result) => {
        if (err) {
          console.log(err);

          return res.status(500).json({
            message: "Database error",
          });
        }

        if (result.length === 0) {
          return res.status(401).json({
            message: "Invalid email or password",
          });
        }

        try {
          const user = result[0];

          const isMatch =
            await bcrypt.compare(
              password,
              user.password
            );

          if (!isMatch) {
            return res.status(401).json({
              message:
                "Invalid email or password",
            });
          }

          if (!process.env.JWT_SECRET) {
            console.error(
              "JWT_SECRET is not configured"
            );

            return res.status(500).json({
              message: "Server configuration error",
            });
          }

          const token = jwt.sign(
            {
              id: user.id,
              email: user.email,
            },
            process.env.JWT_SECRET,
            {
              expiresIn: "7d",
            }
          );

          return res.status(200).json({
            message: "Login Successful",
            token,
          });
        } catch (error) {
          console.log(error);

          return res.status(500).json({
            message: "Login failed",
          });
        }
      }
    );
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Login failed",
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
};