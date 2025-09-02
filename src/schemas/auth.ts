import { z } from "zod";


export const registerUserSchema = z.object({
    firstName: z.string().min(2).max(100).meta({
      description: "The user's first name",
      example: "John"
    }),
    lastName: z.string().min(2).max(100).meta({
      description: "The user's last name",
      example: "Doe"
    }),
    email: z.email().meta({
      description: "The user's email address",
      example: "john.doe@mail.com"
    }),
    password: z.string().min(6).max(100).meta({
      description: "The user's password (minimum 6 characters)",
      example: "strongpassword123"
    }),
});

export const loginUserSchema = z.object({
    email: z.email().meta({
      description: "The user's email address",
      example: "john.doe@mail.com"
    }),
    password: z.string().min(6).max(100).meta({
      description: "The user's password",
      example: "strongpassword123"
    }),
});

export const loginResponseSchema = z.object({
  message: z.string().meta({
    description: "Message describing the success",
    example: "Login successful"
  }),
  data: z.object({
    id: z.uuid().meta({
      description: "User ID",
      example: "123e4567-e89b-12d3-a456-426614174000"
    }),
    email: z.email().meta({
      description: "User email",
      example: "john.doe@mail.com"
    }),
    exp: z.number().meta({
      description: "Token expiration time as a UNIX timestamp",
      example: 1704067200
    })
  }).meta({
    description: "User data",
    example: {
      id: "123e4567-e89b-12d3-a456-426614174000",
      email: "john.doe@mail.com",
      exp: 1704067200
    }
  }),
  token: z.string().meta({
    description: "JWT authentication token",
    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  })
});

export const registerResponseSchema = z.object({
  message: z.string().meta({
    description: "Message describing the success",
    example: "User registered successfully"
  }),
  data: z.object({
    id: z.uuid().meta({
      description: "User ID",
      example: "123e4567-e89b-12d3-a456-426614174000"
    }),
    first_name: z.string().meta({
      description: "User's first name",
      example: "John"
    }),
    last_name: z.string().meta({
      description: "User's last name",
      example: "Doe"
    }),
    email: z.email().meta({
      description: "User email",
      example: "john.doe@mail.com"
    }),
    lastLoginAt: z.date().meta({
      description: "Last login timestamp",
      example: new Date("2024-01-01T12:00:00.000Z")
    })
  }).meta({
    description: "User data without password",
    example: {
      id: "123e4567-e89b-12d3-a456-426614174000",
      first_name: "John",
      last_name: "Doe",
      email: "john.doe@mail.com",
      lastLoginAt: "2024-01-01T12:00:00.000Z"
    }
  })
});

export const logoutResponseSchema = z.object({
  message: z.string().meta({
    description: "Message describing the success",
    example: "Logged out successfully"
  })
});

export type LoginResponse = z.infer<typeof loginResponseSchema>;
export type RegisterUserRequest = z.infer<typeof registerUserSchema>;
export type LoginUserRequest = z.infer<typeof loginUserSchema>;
export type RegisterResponse = z.infer<typeof registerResponseSchema>;
export type LogoutResponse = z.infer<typeof logoutResponseSchema>;
