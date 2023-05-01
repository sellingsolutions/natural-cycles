/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { createOrder } from "./../../services/payment";
import { CardPaymentSchema } from "../../../types";


export const paymentRouter = createTRPCRouter({
  transaction: publicProcedure
    .input(z.object({
      email: z.string(),
      plan: z.string(),
      subscriptionPrice: z.number(),
      thermometerName: z.string(),
      thermometer: z.boolean(),
      thermometerPrice: z.number(),
      cardPayment: CardPaymentSchema
    }))
    .mutation(async ({ input, ctx }) => {
      const order = await createOrder(input, ctx.prisma);
      return order.id;
    })
});
