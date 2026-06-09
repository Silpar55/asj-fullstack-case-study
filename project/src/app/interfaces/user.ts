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
