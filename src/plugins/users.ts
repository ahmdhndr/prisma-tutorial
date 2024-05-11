import Hapi from "@hapi/hapi";
import Joi from "@hapi/joi";

interface UserInput {
  firstName: string;
  lastName: string;
  email: string;
  social: {
    facebook?: string;
    twitter?: string;
    github?: string;
    website?: string;
  };
}

const userInputValidator = Joi.object({
  firstName: Joi.string(),
  lastName: Joi.string(),
  email: Joi.string(),
  social: Joi.object({
    facebook: Joi.string().optional(),
    twitter: Joi.string().optional(),
    github: Joi.string().optional(),
    website: Joi.string().optional()
  }).optional()
});

const createUserHandler = async (
  request: Hapi.Request,
  h: Hapi.ResponseToolkit
) => {
  const { prisma } = request.server.app;
  const payload = request.payload as UserInput;
  if (!payload.firstName || !payload.lastName || !payload.email) {
    return h.response({ status: "fail", message: "bad payload" }).code(400);
  }

  try {
    const createdUser = await prisma.user.create({
      data: {
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.email,
        social: JSON.stringify(payload.social)
      },
      select: { id: true }
    });

    return h.response(createdUser).code(201);
  } catch (error) {
    console.log(error);
  }
};

const usersPlugin = {
  name: "app/users",
  dependencies: ["prisma"],
  register: async function (server: Hapi.Server) {
    server.route([
      {
        method: "POST",
        path: "/users",
        handler: createUserHandler,
        options: {
          validate: {
            payload: userInputValidator
          }
        }
      }
    ]);
  }
};

export default usersPlugin;
