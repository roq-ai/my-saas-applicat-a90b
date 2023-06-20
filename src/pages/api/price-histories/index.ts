import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { priceHistoryValidationSchema } from 'validationSchema/price-histories';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getPriceHistories();
    case 'POST':
      return createPriceHistory();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getPriceHistories() {
    const data = await prisma.price_history
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'price_history'));
    return res.status(200).json(data);
  }

  async function createPriceHistory() {
    await priceHistoryValidationSchema.validate(req.body);
    const body = { ...req.body };

    const data = await prisma.price_history.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
