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
import { useState } from 'react'
import { useChat } from 'ai/react'

// Strong validation schema with detailed error messages
const formSchema = z.object({
  amount: z.number().min(0.01, "Amount must be greater than 0"),
  number: z
    .string()
    .regex(/^[0-9]{16}$/, "Card number must be exactly 16 digits")
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
    .string()
    .regex(/^[0-9]{5}(-[0-9]{4})?$/, "Invalid postal code format"),
  tipAmount: z
    .number()
    .min(0, "Tip cannot be negative")
    .transform((val) => Math.round(val * 100) / 100), // Round to 2 decimal places
})

export function PaymentFormCard({ amount }: { amount: number }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { append } = useChat({ id: "store-select" });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: amount || 0,
      number: "",
      expiration: "",
      securityCode: "",
      postalCode: "",
      tipAmount: 0,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    try {
      // Format card data securely
      const sanitizedCardInfo = {
        amount: values.amount,
        number: values.number.replace(/\s+/g, ''), // Remove any spaces
        expiration: values.expiration,
        securityCode: values.securityCode,
        postalCode: values.postalCode,
        tipAmount: Number(values.tipAmount.toFixed(2)), // Ensure proper number format
      }

      // Send message to AI to process payment
      await append({
        role: 'user',
        content: 'Process this payment',
        toolName: "processCardPayments",
        toolArgs: {
          cardInfo: sanitizedCardInfo
        }
      })

      // Clear sensitive data immediately
      form.reset({
        amount: 0,
        number: "",
        expiration: "",
        securityCode: "",
        postalCode: "",
        tipAmount: 0,
      })

    } catch (error) {
      console.error('Payment error:', error)
    } finally {
      setIsSubmitting(false)
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
                        value={amount}
                        disabled
                        className="bg-gray-50"
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
                        inputMode="numeric"
                        pattern="[0-9]{5}(-[0-9]{4})?"
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
