export const usersRouter = ({ app, getUserById, createUser, deleteUser, updateUser }) => {
  app.route("/users").post(createUser);

  app.route("/users/:id").get(getUserById).delete(deleteUser).put(updateUser);
};
