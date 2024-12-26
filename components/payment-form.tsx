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
// import { toast } from "@/components/ui/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from 'react'

// Implement strong client-side validation using Zod
const formSchema = z.object({
  amount: z.number().min(0.01, "Amount must be greater than 0"),
  number: z.string().regex(/^[0-9]{13,19}$/, "Invalid card number"),
  expiration: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Expiration should be in MM/YY format'),
  securityCode: z.string().regex(/^[0-9]{3,4}$/, "Invalid security code"),
  postalCode: z.string().min(5).max(10),
  tipAmount: z.number().min(0),
})

export function PaymentFormCard() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 0,
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
      // Simulate sending data to a secure API endpoint
      const response = await fetch('/api/process-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add CSRF token if implemented
          // 'X-CSRF-Token': csrfToken,
        },
        // Only send necessary data, avoid sending full card number
        body: JSON.stringify({
          amount: values.amount,
          tipAmount: values.tipAmount,
          last4: values.number.slice(-4),
          expiration: values.expiration,
          postalCode: values.postalCode,
        }),
      })

      if (response.ok) {
        // toast({
        //   title: "Payment processed successfully",
        //   description: "Your payment has been securely processed.",
        // })
      } else {
        throw new Error('Payment processing failed')
      }
    } catch (error) {
      console.error('Payment error:', error)
      // toast({
      //   title: "Payment failed",
      //   description: "There was an error processing your payment. Please try again.",
      //   variant: "destructive",
      // })
    } finally {
      setIsSubmitting(false)
      // Clear sensitive data from the form
      form.reset({
        amount: 0,
        number: "",
        expiration: "",
        securityCode: "",
        postalCode: "",
        tipAmount: 0,
      })
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Secure Payment</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                        placeholder="0.00"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                        // Prevent negative values
                        min="0"
                        step="0.01"
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
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                        // Prevent negative values
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
                      placeholder="1234 5678 9012 3456"
                      {...field}
                      // Implement input masking for card number
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '')
                        field.onChange(value)
                      }}
                      maxLength={19}
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
                        // Implement input masking for expiration date
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '')
                          const maskedValue = value.length > 2 ? `${value.slice(0, 2)}/${value.slice(2, 4)}` : value
                          field.onChange(maskedValue)
                        }}
                        maxLength={5}
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
                    <FormLabel>CVC</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="123"
                        {...field}
                        type="password" // Hide CVC input
                        maxLength={4}
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
                      <Input placeholder="12345" {...field} maxLength={10} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Processing...' : 'Pay Now'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
