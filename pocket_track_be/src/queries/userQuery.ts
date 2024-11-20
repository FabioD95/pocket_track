import User from "../models/User";

export function getUserById(id: string) {
  return User.findById(id).select("-password").populate("families");
}
