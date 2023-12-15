import mongoose from "mongoose";

export function checkArrayObjectId(array) {
  let valid = false;
  try {
    if (Array.isArray(array)) {
      for (var data of array) {
        if (!mongoose.Types.ObjectId.isValid(data)) {
          return valid;
        }
      }
      valid = true;
    }
  } catch (error) {}
  return valid;
}

export function checkObjectId(id) {
  let valid = false;
  try {
    if (mongoose.Types.ObjectId.isValid(id)) {
      valid = true;
    }
  } catch (error) {}
  return valid;
}
