import * as Dialog from '@radix-ui/react-dialog'
import { signIn } from 'next-auth/react'

import LoginButton from '../login-button'

import { X } from 'phosphor-react'

interface LoginModalProps {
    page: string
}

export default function LoginModal({ page }: LoginModalProps) {
    function handleGoogleLogin() {
        signIn('google', {
            callbackUrl: page
        })
    }

    function handleGitHubLogin() {
        signIn('github', {
            callbackUrl: page
        })
    }

    return (
        <Dialog.Portal>
            <Dialog.Overlay className="
                data-[state=open]:animate-overlayShow
                data-[state=closed]:animate-overlayHide
                fixed inset-0 z-40 bg-black/50" />
            <Dialog.Content className="
                data-[state=open]:animate-contentShow
                data-[state=closed]:animate-contentHide
                fixed z-50 top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]
                w-[516px] h-[337px] flex flex-col gap-10 items-center justify-center
                bg-bk-gray-700 p-4 rounded-lg shadow-modal-shadow">
                <Dialog.Close asChild>
                    <button
                        type="button"
                        title="Fechar Modal"
                        className="
                            absolute top-4 right-4
                            flex items-center justify-center p-1
                            text-bk-gray-400
                            border border-transparent rounded-md
                            transition-colors hover:bg-bk-gray-600 hover:text-bk-gray-200
                            focus:outline-none focus-visible:bg-bk-gray-600 focus-visible:text-bk-gray-200
                            focus-visible:border-bk-gray-200">
                        <X size={24} weight="bold" />
                    </button>
                </Dialog.Close>

                <strong className="text-base text-bk-gray-200 text-center">
                    Faça login para utilizar a plataforma
                </strong>

                <div className="flex flex-col gap-4">
                    <LoginButton
                        onClick={handleGoogleLogin}
                        imageURL="/icons/google.svg"
                        text="Entrar com Google" />
                    <LoginButton
                        onClick={handleGitHubLogin}
                        imageURL="/icons/github.svg"
                        text="Entrar com GitHub" />
                </div>
            </Dialog.Content>
        </Dialog.Portal>
    )
}