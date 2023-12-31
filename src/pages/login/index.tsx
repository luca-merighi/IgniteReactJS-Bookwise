import React from 'react'
import Head from 'next/head'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/router'

import LoginButton from '@/components/login-button'

export default function Login() {
    const router = useRouter()

    function handleGoogleLogin() {
        signIn('google', {
            callbackUrl: '/home'
        })
    }

    function handleGitHubLogin() {
        signIn('github', {
            callbackUrl: '/home'
        })
    }

    function handleLoginWithoutAccount() {
        router.push('/home')
    }

    return (
        <React.Fragment>
            <Head>
                <title>BookWise - Login</title>
            </Head>

            <div className="p-4 h-screen flex items-center">
                <figure className="h-full">
                    <img
                        src="/bg/login-bg.png"
                        alt="Uma imagem com blur de uma pessoa deitada em um sofá lendo um livro"
                        className="h-full object-cover rounded-lg" />
                </figure>

                <section className="h-full flex flex-1 items-center justify-center">
                    <div className="flex flex-col">
                        <h1 className="mb-2 text-2xl text-bk-gray-100 font-bold">
                            Boas Vindas!
                        </h1>
                        <span className="text-base text-bk-gray-200">
                            Faça seu login ou acesse como visitante.
                        </span>

                        <div className="mt-10 flex flex-col gap-4">
                            <LoginButton
                                onClick={handleGoogleLogin}
                                imageURL="/icons/google.svg"
                                text="Entrar com Google" />
                            <LoginButton
                                onClick={handleGitHubLogin}
                                imageURL="/icons/github.svg"
                                text="Entrar com GitHub" />
                            <LoginButton
                                onClick={handleLoginWithoutAccount}
                                imageURL="/icons/rocket.svg"
                                text="Acessar como Visitante" />
                        </div>
                    </div>
                </section>
            </div>
        </React.Fragment>
    )
}