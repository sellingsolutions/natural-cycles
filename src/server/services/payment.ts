/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { BraintreeGateway, Customer, Environment, ValidatedResponse } from "braintree";
import { CardPayment } from "../../types";
import { Order, PrismaClient, SubscriptionStatus, SubscriptionType } from "@prisma/client";
import { Transaction } from "braintree";

const gateway: BraintreeGateway = new BraintreeGateway({
  environment: Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID || '',
  publicKey: process.env.BRAINTREE_PUBLIC_KEY || '',
  privateKey: process.env.BRAINTREE_PRIVATE_KEY || '',
});

export const createOrder = async (input: {
  email: string,
  plan: string,
  subscriptionPrice: number,
  thermometerName: string,
  thermometer: boolean,
  thermometerPrice: number,
  cardPayment: CardPayment
}, prisma: PrismaClient): Promise<Order> => {

  const user = await ensureUser(input.email, prisma);
    
  const now = new Date();
  const paymentMethodResult = await gateway.paymentMethod.create({
    customerId: user.bt_customer_id,
    paymentMethodNonce: input.cardPayment.nonce,
    options: {
      makeDefault: true,
    },
  });
  if (!paymentMethodResult.success) throw new Error('Payment method creation failed');

  const paymentMethodToken = paymentMethodResult.paymentMethod.token;
  
  let btOneTimePurchase: ValidatedResponse<Transaction> | undefined;
  if (input.thermometer) {
    btOneTimePurchase = await gateway.transaction.sale({
      amount: `${input.thermometerPrice}`,
      paymentMethodToken,
      customerId: user.bt_customer_id,
      options: {
        // This option requests the funds from the transaction
        // once it has been authorized successfully
        submitForSettlement: true
      },
      lineItems: [
        {
          name: input.thermometerName,
          kind: 'credit',
          quantity: '1',
          unitAmount: `${input.thermometerPrice}`,
          totalAmount: `${input.thermometerPrice}`,
        },
      ],
    });
    if (!btOneTimePurchase.success) throw new Error('One time purchase failed');
  }

  if (!paymentMethodResult.success) throw new Error('Payment method creation failed');
  
  const btSubscription = await gateway.subscription.create({
    paymentMethodToken,
    planId: input.plan,
    price: `${input.subscriptionPrice}`
  });
  if (!btSubscription.success) throw new Error('Subscription creation failed');
  

  const order = await prisma.$transaction(async (tx) => {
    const order = await tx.order.create({
      data: {
        user_id: user.id,
        order_date: now,
      }
    });

    if (btOneTimePurchase) {
      const oneTimePurchase = await tx.oneTimePurchase.create({
        data: {
          user_id: user.id,
          bt_transaction_id: btOneTimePurchase.transaction.id,
          name: input.thermometerName
        }
      });
      const oneTimePurchaseTransaction = await tx.transaction.create({
        data: {
          user_id: user.id,
          order_id: order.id,
          transactionType: 'ONE_TIME_PURCHASE',
          transaction_reference_id: oneTimePurchase.id,
          transaction_amount: input.thermometerPrice,
          transaction_date: now,
          status: 'SUCCESS',
        }
      });
    }
    const subscription = await tx.subscription.create({
      data: {
        user_id: user.id,
        bt_subscription_id: btSubscription.subscription.id,
        subscriptionType: input.plan === 'Annual' ? 'ANNUAL' : 'MONTHLY',
        start_date: new Date(btSubscription.subscription.billingPeriodStartDate),
        end_date: new Date(btSubscription.subscription.billingPeriodEndDate),
        status: btSubscription.subscription.status === 'Active' ? "ACTIVE" : "PENDING",
      }
    });
    const subscriptionTransaction = await tx.transaction.create({
      data: {
        user_id: user.id,
        order_id: order.id,
        transactionType: 'SUBSCRIPTION',
        transaction_reference_id: subscription.id,
        transaction_amount: input.subscriptionPrice,
        transaction_date: now,
        status: 'SUCCESS',
      }
    });

    return order;
  });
  
  return order;
}

const ensureUser = async (email: string, prisma: PrismaClient) => {
  let user = await prisma.user.findUnique({
    where: {
      email: email,
    }
  });
  if (!user) {
    const { customer } = await gateway.customer.create({
      email: email,
    });
    user = await prisma.user.create({
      data: {
        email: email,
        bt_customer_id: customer.id,
      }
    });
  }
  return user;
}