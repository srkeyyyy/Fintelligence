import {
  signupService,
  loginService,
  getCurrentUserService,
} from "../services/auth.service.js";

export const signup = async (req, res) => {
  try {
    const result = await signupService(req.body);

    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const result = await loginService(req.body);

    res.status(200).json(result);
  } catch (error) {
    res.status(401).json({
      message: error.message,
    });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const user = await getCurrentUserService(req.user.id);

    res.status(200).json({
      user,
    });
  } catch (error) {
    res.status(401).json({
      message: error.message,
    });
  }
};