'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState, useEffect } from 'react'
import { useChat } from 'ai/react'
import CryptoJS from 'crypto-js';

// Strong validation schema with detailed error messages
const formSchema = z.object({
  amount: z.coerce.number(),
  number: z
    .string()
    // .regex(/^[0-9]{16}$/, "Card number must be exactly 16 digits")
    .transform((val) => val.replace(/\s+/g, '')), // Remove spaces
  expiration: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/([2-9]\d)$/, 'Invalid expiration date (MM/YY)')
    .refine((val) => {
      const [month, year] = val.split('/');
      const expDate = new Date(2000 + parseInt(year), parseInt(month) - 1);
      return expDate > new Date();
    }, "Card has expired"),
  securityCode: z
    .string()
    .regex(/^[0-9]{3,4}$/, "CVV must be 3 or 4 digits"),
  postalCode: z
    .string(),
  // .regex(/^[0-9]{5}(-[0-9]{4})?$/, "Invalid postal code format"),
  tipAmount: z
    .number()
    .min(0, "Tip cannot be negative")
    .transform((val) => Math.round(val * 100) / 100), // Round to 2 decimal places
})

export function PaymentFormCard({ amount, orderId, order }: {
  amount: number, // Accept either string or number
  orderId: string,
  order: any
}) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { append } = useChat({ id: "store-select" });

  useEffect(() => {
    if (amount && !isNaN(amount)) {
      setIsLoading(false)
    }
  }, [amount])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: isNaN(amount) ? 0 : Number(amount),
      number: "",
      expiration: "",
      securityCode: "",
      postalCode: "",
      tipAmount: 0,
    },
  })

  if (isLoading) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Loading Payment Details...</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
        </CardContent>
      </Card>
    )
  }

  console.log('amount', amount)

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      // Format card data securely
      const sanitizedCardInfo = {
        number: values.number.replace(/\s+/g, ''),
        expiration: values.expiration,
        securityCode: values.securityCode,
        postalCode: values.postalCode,
        tipAmount: Number(values.tipAmount.toFixed(2)),
      };

      // Encrypt sensitive data
      const encryptionKey = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || "default_key"; // Replace with a secure key
      const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(sanitizedCardInfo), encryptionKey).toString();

      // Process payment through API route
      const response = await fetch('/api/process-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          order,
          paymentDetails: encryptedData,
          amount,
        }),
      });

      const paymentResult = await response.json();

      if (paymentResult.success) {
        await append({
          role: 'assistant',
          content: `Payment successful for order ${orderId}, let's track your order.`,
        });
      } else {
        throw new Error(paymentResult.error || 'Payment failed');
      }

      // Clear sensitive data immediately
      form.reset({
        amount: 0,
        number: '',
        expiration: '',
        securityCode: '',
        postalCode: '',
        tipAmount: 0,
      });
    } catch (error: any) {
      console.error('Payment error:', error);
      await append({
        role: 'assistant',
        content: `${error?.message}`,
      });
    } finally {
      setIsSubmitting(false);
    }
  }


  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Secure Payment</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
            autoComplete="on"
          >
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        value={isNaN(amount) ? 0 : amount}
                        disabled
                        readOnly
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tipAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tip</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0.00"
                        {...field}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value);
                          field.onChange(isNaN(value) ? 0 : value);
                        }}
                        min="0"
                        step="0.01"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Card Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="•••• •••• •••• ••••"
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '')
                          .replace(/(.{4})/g, '$1 ').trim();
                        field.onChange(value);
                      }}
                      maxLength={19}
                      autoComplete="cc-number"
                      inputMode="numeric"
                      pattern="[0-9\s]{13,19}"
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="expiration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expiration</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="MM/YY"
                        {...field}
                        onChange={(e) => {
                          let value = e.target.value.replace(/\D/g, '');
                          if (value.length >= 2) {
                            value = value.slice(0, 2) + '/' + value.slice(2, 4);
                          }
                          field.onChange(value);
                        }}
                        maxLength={5}
                        autoComplete="cc-exp"
                        inputMode="numeric"
                        required
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="securityCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CVV</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="•••"
                        {...field}
                        maxLength={4}
                        autoComplete="cc-csc"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        required
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="postalCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Postal Code</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="12345"
                        {...field}
                        maxLength={10}
                        autoComplete="postal-code"
                        // inputMode="numeric"
                        // pattern="[0-9]{5}(-[0-9]{4})?"
                        required
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Processing...' : 'Pay Now'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
