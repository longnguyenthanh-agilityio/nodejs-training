export const cardsRouter = ({
  app,
  authenticate,
  createCard,
  getCardList,
  updateCard,
  deleteCard,
  getCardById,
}) => {
  app.route("/cards").all(authenticate).get(getCardList).post(createCard);

  app.route("/cards/:id").all(authenticate).put(updateCard).delete(deleteCard).get(getCardById);
};
