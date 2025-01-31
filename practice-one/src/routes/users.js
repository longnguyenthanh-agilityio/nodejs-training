export const usersRouter = ({
  app,
  authenticate,
  getUserById,
  createUser,
  deleteUser,
  updateUser,
}) => {
  app.route("/users").post(createUser);

  app.route("/users/:id").all(authenticate).get(getUserById).delete(deleteUser).put(updateUser);
};
