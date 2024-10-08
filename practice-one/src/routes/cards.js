export const cardsRouter = ({
  app,
  authenticate,
  createCard,
  cardValidations,
  getCardList,
  updateCard,
  deleteCard,
  getCardById,
}) => {
  app.route("/cards").all(authenticate).get(getCardList).post(cardValidations, createCard);

  app.route("/cards/:id").all(authenticate).put(updateCard).delete(deleteCard).get(getCardById);
};
