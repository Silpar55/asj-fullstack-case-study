// The way the user is stored in Local Storage

export interface UserLS {
  id: string;
  name: string;
  role: string;
  allowedTabs: string[];
}
