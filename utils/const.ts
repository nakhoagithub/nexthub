export const typesSchema: string[] = ["String", "Boolean", "Object", "ObjectId", "Array", "ArrayObjectId"];

export const userStates: { name: string; key: string }[] = [
  {
    key: "user",
    name: "User",
  },
  {
    key: "master",
    name: "Master",
  },
  {
    key: "account-service",
    name: "Account Service",
  },
];

export const genders: { name: string; key: string }[] = [
  {
    key: "male",
    name: "Male",
  },
  {
    key: "female",
    name: "Female",
  },
  {
    key: "other",
    name: "Other",
  },
];

export const employeeStatus: { name: string; key: string; color: string }[] = [
  {
    key: "working",
    name: "Working",
    color: "green",
  },
  {
    key: "resign",
    name: "Resign",
    color: "red",
  },
  {
    key: "on-leave",
    name: "On leave",
    color: "yellow",
  },
];
