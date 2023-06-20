import * as yup from 'yup';

export const productValidationSchema = yup.object().shape({
  name: yup.string().required(),
  price: yup.number().integer().required(),
  store_id: yup.string().nullable(),
});
