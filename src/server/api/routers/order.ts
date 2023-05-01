/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Transaction } from "@prisma/client";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

type Row = Transaction & { name: string, price: number };

export const orderRouter = createTRPCRouter({
  getLatestOrder: publicProcedure.input(z.object({ email: z.string() })).mutation(async ({ input, ctx }) => {
    const order = await ctx.prisma.order.findFirst({
      where: {
        user: {
          email: input.email
        }
      },
      orderBy: {
        order_date: 'desc'
      }
    });
    return order;
  }),
  getOrder: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
      const order = await ctx.prisma.order.findFirst({ where: { id: input.id } });
      const transactions = await ctx.prisma.transaction.findMany({ where: { order_id: input.id } });
      const total = transactions.reduce((sum, curr) => sum + curr.transaction_amount, 0);

      const rows: Row[] = [];
      for (const transaction of transactions) {
        if (transaction.transactionType === 'SUBSCRIPTION') {
          const subscription = await ctx.prisma.subscription.findFirst({ where: { id: transaction.transaction_reference_id } });
          rows.push({
            ...transaction,
            name: (subscription?.subscriptionType || '') + ' Subscription',
            price: transaction.transaction_amount,
          })
        }
        if (transaction.transactionType === 'ONE_TIME_PURCHASE') {
          const oneTimePurchase = await ctx.prisma.oneTimePurchase.findFirst({ where: { id: transaction.transaction_reference_id } });
          rows.push({
            ...transaction,
            name: oneTimePurchase?.name || '',
            price: transaction.transaction_amount,
          })
        }
      }
      return {
        order,
        rows,
        total
      };
    })
});
