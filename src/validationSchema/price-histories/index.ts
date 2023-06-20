import * as yup from 'yup';

export const priceHistoryValidationSchema = yup.object().shape({
  old_price: yup.number().integer().required(),
  new_price: yup.number().integer().required(),
  date: yup.date().required(),
  product_id: yup.string().nullable(),
});
