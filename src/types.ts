import { z } from "zod";

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
export const CardPaymentSchema = z.object({
  nonce: z.string(),
  details: z.object({
    bin: z.string(),
    cardType: z.string(),
    expirationMonth: z.string(),
    expirationYear: z.string(),
    cardholderName: z.string().nullable().optional(),
    lastFour: z.string(),
    lastTwo: z.string(),
  }),
  type: z.string(),
  binData: z.object({
    commercial: z.string(),
    countryOfIssuance: z.string(),
    debit: z.string(),
    durbinRegulated: z.string(),
    healthcare: z.string(),
    issuingBank: z.string(),
    payroll: z.string(),
    prepaid: z.string(),
    productId: z.string(),
  }),
  vaulted: z.boolean().optional(),
  deviceData: z.string().optional(),
  liabilityShifted: z.boolean().optional(),
  liabilityShiftPossible: z.boolean().optional(),
  threeDSecureInfo: z.object({
    liabilityShiftPossible: z.boolean(),
    liabilityShifted: z.boolean(),
    cavv: z.string(),
    xid: z.string(),
    dsTransactionId: z.string(),
    threeDSecureVersion: z.string(),
    eciFlag: z.string(),
    threeDSecureAuthenticationId: z.string(),
  }).optional(),

});

export interface CardPayment {
  nonce: string;
  details: {
    bin: string;
    cardType: string;
    expirationMonth: string;
    expirationYear: string;
    cardholderName?: string | undefined | null;
    lastFour: string;
    lastTwo: string;
  };
  type: string;
  binData: binData;
  vaulted?: boolean | undefined;
  deviceData?: string | undefined;
  liabilityShifted?: boolean | undefined;
  liabilityShiftPossible?: boolean | undefined;
  threeDSecureInfo?: ThreeDSecureInfo | undefined;
}

interface binData {
  commercial: string;
  countryOfIssuance: string;
  debit: string; // 'Yes' | 'No' | 'Unknown';
  durbinRegulated: string; // 'Yes' | 'No' | 'Unknown';
  healthcare: string; // 'Yes' | 'No' | 'Unknown';
  issuingBank: string;
  payroll: string; // 'Yes' | 'No' | 'Unknown';
  prepaid: string; // 'Yes' | 'No' | 'Unknown';
  productId: string;
}

interface ThreeDSecureInfo {
  liabilityShiftPossible: boolean;
  liabilityShifted: boolean;
  cavv: string;
  xid: string;
  dsTransactionId: string;
  threeDSecureVersion: string;
  eciFlag: string;
  threeDSecureAuthenticationId: string;
}