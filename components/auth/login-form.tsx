'use client'

import * as z from 'zod'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { login } from '@/actions/login'
import { LoginSchema } from '@/schemas'
import { useSearchParams } from 'next/navigation'
import { useState, useTransition } from 'react'
import { FormError } from '../form-error'
import { FormSuccess } from '../form-success'
import { Button } from '../ui/button'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '../ui/form'
import { Input } from '../ui/input'
import { CardWrapper } from './card-wrapper'
import Link from 'next/link'

export function LoginForm() {
    const searchParams = useSearchParams()
    const urlError =
        searchParams.get('error') === 'OAuthAccountNotLinkedError'
            ? 'This account is already linked to another user. Please sign in with the original account.'
            : undefined
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | undefined>('')
    const [success, setSuccess] = useState<string | undefined>('')
    const [showTwoFactor, setShowTwoFactor] = useState(false)

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    })

    const onSubmit = (values: z.infer<typeof LoginSchema>) => {
        setError(undefined)
        setSuccess(undefined)

        startTransition(() => {
            login(values)
                .then((data) => {
                    if (data?.error) {
                        form.reset()
                        setError(data?.error)
                    }

                    if (data?.success) {
                        form.reset()
                        setSuccess(data?.success)
                    }

                    if (data?.twoFactor) {
                        setShowTwoFactor(true)
                    }
                })
                .catch((error) => {
                    setError(error.message || 'Something went wrong')
                })
        })
    }

    return (
        <CardWrapper
            headerLabel='Welcome back'
            backButtonLabel="Don't have an account?"
            backButtonHref='/auth/register'
            showSocial={true}
        >
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className='space-y-6'
                >
                    <div className='space-y-4'>
                        {!showTwoFactor && (
                            <>
                                <FormField
                                    control={form.control}
                                    name='email'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel htmlFor='email'>
                                                Email
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    disabled={isPending}
                                                    placeholder='john.doe@example.com'
                                                    type='email'
                                                    required
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name='password'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel htmlFor='password'>
                                                Password
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    disabled={isPending}
                                                    placeholder='********'
                                                    type='password'
                                                    required
                                                />
                                            </FormControl>
                                            <Button
                                                size='sm'
                                                variant='link'
                                                asChild
                                                className='px-0 font-normal'
                                            >
                                                <Link href='/auth/reset'>
                                                    Forgot password?
                                                </Link>
                                            </Button>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </>
                        )}
                        {showTwoFactor && (
                            <FormField
                                control={form.control}
                                name='code'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor='code'>
                                            Two Factor Code
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                disabled={isPending}
                                                placeholder='123456'
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}
                    </div>
                    <FormError message={error || urlError} />
                    <FormSuccess message={success} />
                    <Button
                        type='submit'
                        className='w-full'
                        disabled={isPending}
                    >
                        {showTwoFactor ? 'Verify' : 'Login'}
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    )
}
