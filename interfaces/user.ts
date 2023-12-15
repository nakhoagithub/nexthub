export interface User {
  _id: string;
  name?: string;
  username: string;
  state: string;
  idsOrg?: string[];
  idsCurrentOrg?: string[];
  active: boolean;
}
