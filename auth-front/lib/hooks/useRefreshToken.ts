"use client";
import { useSession } from "next-auth/react";
import axios from "../axios";

const useRefreshToken = () => {
  const { data: session } = useSession();

  const refreshToken = async () => {
    const res = await axios.post("/api/refresh", {
      refreshToken: session?.user.refreshToken,
      email: session?.user.email,
    });

    if (session) {
      session.user.accessToken = res.data.accessToken;
    }
  };
  return refreshToken;
};

export default useRefreshToken;
