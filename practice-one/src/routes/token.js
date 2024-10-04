export const tokenRouter = ({ app, createToken }) => {
  app.route("/token").post(createToken);
};
