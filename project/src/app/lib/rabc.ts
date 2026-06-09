import { TabAccessMatrix } from "../interfaces/tabAccessMatrix";
import { UserLS } from "../interfaces/userLS";

const tabAccessMatrix: TabAccessMatrix = {
  transactions: ["admin", "finance_lead", "viewer"],
  stats: ["admin", "finance_lead", "analyst"],
  custom: ["admin", "finance_lead"],
};

export function hasAccess(
  user: UserLS,
  tab: "transactions" | "stats" | "custom",
) {
  // Check by tabs allowed
  const isTabAllowed = user.allowedTabs.includes(tab);

  // Check by role

  const isRoleAllowed = tabAccessMatrix[tab].includes(user.role);

  return isRoleAllowed && isTabAllowed;
}
