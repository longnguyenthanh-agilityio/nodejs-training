export const usersRouter = ({ app, getUserById }) => {
  // TODO: Will update more feature in future
  app.route("/users/:id").get(getUserById);
};
