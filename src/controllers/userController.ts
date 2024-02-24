import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import * as Joi from "joi";

// สร้าง instance ของ PrismaClient
const prisma = new PrismaClient();

// Interface สำหรับรับ request body จาก client
interface UserInput {
  email: string;
  firstName: string;
  lastName: string;
  social: {
    facebook?: string;
    twitter?: string;
    github?: string;
    website?: string;
  };
}

// Create a new user
// POST /users
const createUser = async (req: Request, res: Response) => {
  const userInput: UserInput = req.body;
  // console.log(userInput);

  // Validate the request body
  const schema = Joi.object({
    email: Joi.string().email().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    social: Joi.object({
      facebook: Joi.string().uri(),
      twitter: Joi.string().uri(),
      github: Joi.string().uri(),
      website: Joi.string().uri(),
    }),
  });

  // If the request body is invalid, return 400 Bad Request
  const { error } = schema.validate(userInput);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const user = await prisma.user.create({
      data: userInput,
    });

    res.json(user);
  } catch (error) {
    console.error((error as Error).message);
    res.status(500).json({
      error: "Failed to create user",
    });
  }
};

// GET /users
const getUsers = async (_: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (e) {
    console.error((e as Error).message);
    res.status(500).json({ error: "Failed to get users" });
  }
};

// GET /users/:userId: Get a user by ID
const getUserById = async (req: Request, res: Response) => {
  const userId = parseInt(req.params.userId);
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (e) {
    console.error((e as Error).message);
    res.status(500).json({ error: "Failed to get user" });
  }
};

// PUT /users/:userId: Update a user by ID
const updateUser = async (req: Request, res: Response) => {
  const userId = parseInt(req.params.userId);
  const userInput: UserInput = req.body;

  // Validate the request body
  const schema = Joi.object({
    email: Joi.string().email(),
    firstName: Joi.string(),
    lastName: Joi.string(),
    social: Joi.object({
      facebook: Joi.string().uri(),
      twitter: Joi.string().uri(),
      github: Joi.string().uri(),
      website: Joi.string().uri(),
    }),
  });

  // If the request body is invalid, return 400 Bad Request
  const { error } = schema.validate(userInput);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const user = await prisma.user.update({
      where: {
        id: userId,
      },
      data: userInput,
    });
    res.json(user);
  } catch (e) {
    console.error((e as Error).message);
    res.status(500).json({ error: "Failed to update user" });
  }
};

// DELETE /users/:userId: Delete a user by ID
const deleteUser = async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId)
    try {
      await prisma.user.delete({
        where: {
          id: userId,
        },
      })
      res.json({ message: "User deleted successfully" })
    } catch (e) {
      console.error((e as Error).message)
      res.status(500).json({ error: "Failed to delete user" })
    }
}
export { createUser, getUsers, getUserById, updateUser, deleteUser };
