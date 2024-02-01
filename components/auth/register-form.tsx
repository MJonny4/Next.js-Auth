'use client'

import * as z from 'zod'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { RegisterSchema } from '@/schemas'
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
import { register } from '@/actions/register'
import { useState, useTransition } from 'react'

export function RegisterForm() {
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | undefined>('')
    const [success, setSuccess] = useState<string | undefined>('')

    const form = useForm<z.infer<typeof RegisterSchema>>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            email: '',
            password: '',
            name: '',
        },
    })

    const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
        setError(undefined)
        setSuccess(undefined)

        startTransition(() => {
            register(values).then((data) => {
                setError(data.error)
                setSuccess(data.success)
            })
        })
    }

    return (
        <CardWrapper
            headerLabel='Create an account'
            backButtonLabel="Already have an account?"
            backButtonHref='/auth/login'
            showSocial={true}
        >
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className='space-y-6'
                >
                    <div className='space-y-4'>
                        <FormField
                            control={form.control}
                            name='name'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor='name'>Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            disabled={isPending}
                                            placeholder='John Doe'
                                            type='text'
                                            required
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='email'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor='email'>Email</FormLabel>
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
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormError message={error} />
                    <FormSuccess message={success} />
                    <Button
                        type='submit'
                        className='w-full'
                        disabled={isPending}
                    >
                        Register
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    )
}
