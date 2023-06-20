import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { productValidationSchema } from 'validationSchema/products';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.product
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getProductById();
    case 'PUT':
      return updateProductById();
    case 'DELETE':
      return deleteProductById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getProductById() {
    const data = await prisma.product.findFirst(convertQueryToPrismaUtil(req.query, 'product'));
    return res.status(200).json(data);
  }

  async function updateProductById() {
    await productValidationSchema.validate(req.body);
    const data = await prisma.product.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteProductById() {
    const data = await prisma.product.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
