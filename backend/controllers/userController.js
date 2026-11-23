import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import userModel from "../db/users.js";
import tokenModel from "../db/tokens.js";
dotenv.config();

export const getUsers = async (req, res) => {
  try {
    const users = await userModel.find().select("-password");
    res.status(200).json(users);
  } catch {
    res.status(500).json({ message: `Error fetching users` });
  }
};

export const createUser = async (req, res) => {
  const { name, age, email, password, role } = req.body;

  if(!name || !age || !email || !password) return res.status(400).json({message: "All fields are required"})
  const existingUser = await userModel.findOne({ email });

  if (existingUser)
    return res.status(409).json({ message: "Email already exists" });

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const newUser = await userModel.create({
      name: name,
      age: age,
      email: email,
      password: hashedPassword,
      role: role || "user",
      status: "activated",
    });

    res.status(201).json(newUser);
  } catch (error) {
    console.error("error:", error);
    res.status(500).json({ message: `Error creating user` });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) return res.status(400).json({message: "All fields are required"});
  
  try {
    const user = await userModel.findOne({ email: email });

    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    if (user.status === "deactivated")
      return res
        .status(403)
        .json({ message: "Your account has been deactivated" });

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      if (
        user.failedAttempts &&
        user.failedAttempts >= 3 &&
        user.lockUntil === null
      ) {
        user.lockUntil = Date.now() + 3 * 60 * 1000; // Lock for 3 minutes
        await user.save();
        return res.status(403).json({
          message:
            "Your account has been deactivated, Try again after three minutes",
          lockedUntil: user.lockUntil,
        });
      }

      if (user.failedAttempts >= 3) {
        user.failedAttempts = 3;
        await user.save();
        return res.status(403).json({
          message:
            "Your account has been deactivated, Try again after 3 minutes",
          lockedUntil: user.lockUntil,
        });
      }
      user.failedAttempts += 1;
      await user.save();
      return res.status(401).json({
        message: "Invalid credentials",
        failedAttempts: user.failedAttempts,
      });
    }

    if (isValid) {
      if (user.lockUntil && user.lockUntil > Date.now()) {
        return res.status(403).json({
          message: "Account locked for 3 minutes",
        });
      } else {
        user.lockUntil = null;
        user.failedAttempts = 0;
        await user.save();
        const accessToken = jwt.sign(
          {
            userId: user._id,
            name: user.name,
            email: user.email,
          },
          process.env.ACCESS_SECRET_TOKEN,
          {
            expiresIn: "15m",
          },
        );

        const refreshToken = jwt.sign(
          {
            userId: user._id,
            name: user.name,
            email: user.email,
          },
          process.env.REFRESH_SECRET_TOKEN,
          {
            expiresIn: "1d",
          },
        );

        await tokenModel.create({
          token: refreshToken,
        });
        res.status(200).json({
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            status: user.status,
          },
          accessToken: accessToken,
          refreshToken: refreshToken,
        });
      }
    } else {
      res.status(403).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.error("error:", error);
  }
};

export const fetchUserData = async (req, res) => {
  const { id } = req.params;
  const selectedUser = await userModel.findById(id);
  if (!selectedUser) return res.status(404).json({ message: "Invalid user" });
  try {
    res.status(200).json({
      user: {
        name: selectedUser.name,
        age: selectedUser.age,
        email: selectedUser.email,
        role: selectedUser.role,
        status: selectedUser.status,
      },
    });
  } catch (error) {
    console.error("error:", error);
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;

  // Ensure request body exists (protect against middleware/route issues)
  if (!req.body) {
    console.error("updateUser: req.body is undefined", { headers: req.headers });
    return res.status(400).json({ message: "Missing request body" });
  }

  const {
    name,
    age ,
    email,
    role,
    status,
    current_password,
    new_password,
  } = req.body;

  try {
    const selectedUser = await userModel.findById(id);

    if (!selectedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Update normal fields only if they exist
    if (name) selectedUser.name = name;
    if (email) selectedUser.email = email;
    if (role) selectedUser.role = role;
    if (age) selectedUser.age = age;
    if (status) selectedUser.status = status;



    // Password update section
    if (current_password || new_password) {
      // Both fields are required
      if (!current_password || !new_password) {
        return res.status(400).json({
          message: "Both current and new password are required",
        });
      }

      const isValid = await bcrypt.compare(
        current_password,
        selectedUser.password
      );

      if (!isValid) {
        return res.status(403).json({
          message: "Invalid current password",
        });
      }

      const hashedPassword = await bcrypt.hash(new_password, 10);

      selectedUser.password = hashedPassword;
    }

    await selectedUser.save();

    res.status(200).json({
      user: {
        name: selectedUser.name,
        age: selectedUser.age,
        email: selectedUser.email,
        role: selectedUser.role,
        status: selectedUser.status,
      },
      message: `User with ID ${selectedUser._id} has been successfully updated`,
    });
  } catch (error) {
    console.error("Error:", error);

    res.status(500).json({
      message: "Error updating user",
    });
  }
};

export const resetPassword = async(req, res) => {
  const {id} = req.params;
  const {new_password} = req.body;
try {
    const user = await userModel.findById(id);
  // if(user.role !== "admin") return res.json(401).json({message: "Access Denied"})
  const newPassword = await bcrypt.hash(new_password,10);
  user.password = newPassword;
  await user.save()


  res.status(200).json({user})
 
} catch (error) {
  res.status(500).json({message: "Error finding user"})
}
}

export const deleteUser = async (req, res) => {
  const { id } = req.params;

  const selectedUser = await userModel.findById(id);
  if (!selectedUser) return res.status(404).json({ message: "User not found" });
  try {
    await userModel.deleteOne(selectedUser);
    res.status(200).json({
      message: `User with ID ${selectedUser._id} has been successfully deleted  `,
    });
  } catch (error) {
    console.error("error:", error);
    res.status(500).json({ message: "Error deleting user" });
  }
};

export const getToken = async (req, res) => {
  const { token } = req.body;

  if (token == null) return res.sendStatus(401);

  const isTokenStored = await tokenModel.findOne({ token });
  if (!isTokenStored) return res.sendStatus(403);
  try {
    jwt.verify(token, process.env.REFRESH_SECRET_TOKEN, (err, user) => {
      if (err) return res.sendStatus(403);
      const accessToken = generateAccessToken(user);
      res.status(201).json({ accessToken: accessToken });
    });
  } catch (error) {
    console.error("error:", error);
  }
};

function generateAccessToken(user) {
  try {
    return jwt.sign(
      {
        userId: user.userId,
        name: user.name,
        email: user.email,
      },
      process.env.ACCESS_SECRET_TOKEN,
      {
        expiresIn: "15m",
      },
    );
  } catch (error) {
    console.error("error:", error);
  }
}

export const deleteToken = async (req, res) => {
  const { token } = req.body;
  const storedToken = await tokenModel.findOne({ token });
  if (!storedToken)
    return res.status(403).json({ message: `Invalid refresh token` });

  try {
    await tokenModel.findOneAndDelete({ token });

    res.status(200).json({ message: `Refresh token was deleted successfully` });
  } catch {
    res.status(500).json({ message: `Error deleting refresh token` });
  }
};

export function authenticateAccessToken(req, res, next) {
  // Debug: log request metadata to help diagnose missing body
  console.log("authenticateAccessToken:", {
    method: req.method,
    url: req.originalUrl || req.url,
    contentType: req.headers["content-type"],
    hasBody: !!req.body,
  });

  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);
  try {
    jwt.verify(token, process.env.ACCESS_SECRET_TOKEN, (err, user) => {
      if (err) return res.sendStatus(401);
      req.user = user;
      next();
    });
  } catch (error) {
    console.error("error:", error);
  }
}
