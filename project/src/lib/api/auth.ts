import { UserLS } from "@/interfaces/auth/userLS";

export const getUser = (): UserLS => {
  const user = localStorage.getItem("user") || "";

  return JSON.parse(user);
};

export const clearUser = () => {
  localStorage.removeItem("user");
};
