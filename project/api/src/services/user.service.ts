import { and, eq } from "drizzle-orm";
import jwt from "jsonwebtoken";

import type { User } from "../lib/db/schemas";

import db from "../lib/db";
import { user } from "../lib/db/schemas";
import { provider } from "../lib/db/schemas/provider";
import env from "../lib/env";

export function userService() {
  function generateToken({ id, email, uuid }: User) {
    return jwt.sign({ id, email, uuid }, env.JWT_SECRET, {
      expiresIn: env.EXPIRATION_TIME,
    });
  }

  const initProvider = async ({
    userId,
    name,
    providerToken,
    expireAt,
  }: {
    userId: number;
    name: string;
    providerToken: string;
    expireAt: string;
  }): Promise<void> => {
    await db.insert(provider).values({
      name,
      token: providerToken,
      expireAt,
      userId,
    }).onConflictDoUpdate({
      target: provider.userId,
      set: {
        name,
        token: providerToken,
        expireAt,
      },
    });
  };

  const getUser = async ({
    email,
    uuid,
    name,
    providerToken,
    expireAt,
  }: {
    email: string;
    uuid: string;
    name: string;
    providerToken: string;
    expireAt: string;
  }): Promise<{ user: User; token: string }> => {
    try {
      const existingUser = await db
        .select()
        .from(user)
        .where(and(eq(user.email, email), eq(user.uuid, uuid)))
        .limit(1)
        .then(res => res[0]);

      if (existingUser) {
        const token = generateToken({ id: existingUser.id, email, uuid });
        await initProvider({
          userId: existingUser.id,
          name,
          providerToken,
          expireAt,
        });
        return { user: existingUser, token };
      }
      const newUser = await db.insert(user).values({
        email,
        uuid,
      }).returning().then(res => res[0]);
      if (!newUser || !newUser.id) {
        throw new Error("Failed to create user");
      }
      await initProvider({
        userId: newUser.id,
        name,
        providerToken,
        expireAt,
      });
      const token = generateToken({
        id: newUser.id,
        email,
        uuid,
      });

      return { user: newUser, token };
    }
    catch (error) {
      throw new Error(`Failed to create user: ${error}`);
    }
  };

  return { getUser };
}
