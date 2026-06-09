export interface Users {
  company: string;
  authNote: string;
  tabAccessMatrix: TabAccessMatrix;
  users: User[];
}

export interface TabAccessMatrix {
  transactions: string[];
  stats: string[];
  custom: string[];
}

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  title: string;
  role: string;
  allowedTabs: string[];
  department: string;
  active: boolean;
  createdAt: string;
}
