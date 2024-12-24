'use client'

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useActionState } from 'react'
import { submitOrder } from "../(server)/actions"

export default function Profile() {
  const [state, formAction, isPending] = useActionState(submitOrder, {
    errors: {},
    message: ''
  })

  return (
    <div className="mt-[5rem]">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Please fill out the form below to proceed with your order.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" name="firstName" required />
                {state?.errors?.firstName && (
                  <p className="text-sm text-red-500">{state.errors.firstName[0]}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" name="lastName" required />
                {state?.errors?.lastName && (
                  <p className="text-sm text-red-500">{state.errors.lastName[0]}</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" name="address" required />
              {state?.errors?.address && (
                <p className="text-sm text-red-500">{state.errors.address[0]}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input id="phoneNumber" name="phoneNumber" type="tel" required />
              {state?.errors?.phoneNumber && (
                <p className="text-sm text-red-500">{state.errors.phoneNumber[0]}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" name="email" type="email" required />
              {state?.errors?.email && (
                <p className="text-sm text-red-500">{state.errors.email[0]}</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="unitNumber">Unit Number (if applicable)</Label>
                <Input id="unitNumber" name="unitNumber" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unitType">Unit Type (if applicable)</Label>
                <Input id="unitType" name="unitType" />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? 'Submitting...' : 'Submit Order Information'}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          {state?.message && (
            <Alert variant={state.errors ? "destructive" : "default"} className="w-full">
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
