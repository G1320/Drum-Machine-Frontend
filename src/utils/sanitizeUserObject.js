export const sanitizeUserObject = (user) => {
  delete user.username;
  delete user.password;
  delete user.__v;
  delete user.createdAt;
  delete user.updatedAt;
  delete user.email;

  return user;
};
