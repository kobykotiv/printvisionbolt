import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const ShopSchema = z.object({
  name: z.string().min(1),
  url: z.string().url(),
  email: z.string().email(),
  status: z.enum(['active', 'disabled']),
  description: z.string().optional(),
  currency: z.string().length(3)
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    switch (req.method) {
      case 'GET':
        const { page = '1', limit = '10', status, search } = req.query;
        const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

        const where = {
          ...(status && { status }),
          ...(search && {
            OR: [
              { name: { contains: search as string } },
              { email: { contains: search as string } }
            ]
          })
        };

        const [total, shops] = await Promise.all([
          prisma.shop.count({ where }),
          prisma.shop.findMany({
            where,
            skip,
            take: parseInt(limit as string),
            include: { integrations: true }
          })
        ]);

        return res.json({ data: shops, total });

      case 'POST':
        const validated = ShopSchema.parse(req.body);
        const shop = await prisma.shop.create({
          data: validated,
          include: { integrations: true }
        });
        return res.status(201).json(shop);

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.issues });
    }
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
