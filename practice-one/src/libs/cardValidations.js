import { HTTP_STATUS } from "../constants/http-status-code.js";
import { MESSAGES, FIELD_INVALID } from "../constants/message.js";
import { CARD_TYPES, REQUIRE_FIELD } from "../constants/card.js";

export const cardValidations = async (req, res, next) => {
  const { cardType, zEnergyCost } = req.body;

  // Validate cardType
  const isCardTypeInvalid =
    !cardType || typeof cardType !== "string" || !CARD_TYPES.includes(cardType);
  if (isCardTypeInvalid) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: FIELD_INVALID("cardType") });
  }

  // Validate zEnergyCost with cardType starts with "z-"
  const isInvalidZCardType = zEnergyCost && !cardType.startsWith("z-");
  if (isInvalidZCardType) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: MESSAGES.CARD_TYPE });
  }

  // Helper function to validate fields
  const validateField = (field, type) => {
    if (type === "string") return !field || typeof field !== "string" || field.trim() === "";
    if (type === "number") return typeof field !== "number" || isNaN(field);
  };

  const validationChecks = Object.entries(req.body)
    .filter(([key]) => key in REQUIRE_FIELD) // Only validate known fields
    .map(([key, value]) => ({
      field: value,
      type: REQUIRE_FIELD[key],
      message: FIELD_INVALID(key),
    }));

  const invalidField = validationChecks.find(({ field, type }) => validateField(field, type));

  if (invalidField) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: invalidField.message });
  }

  // Proceed to the next middleware if validation passes
  next();
};
