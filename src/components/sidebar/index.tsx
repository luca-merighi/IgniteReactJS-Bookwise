import { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import Image from 'next/image'

import { useSession, signOut } from 'next-auth/react'

import SidebarLink from './sidebar-link'

import { ChartLineUp, Binoculars, User, SignIn } from 'phosphor-react'
import LoginModal from '../login-modal'

export default function Sidebar() {
    const { data } = useSession()
    const [isLoginModalOpen, setLoginModalOpen] = useState(false)

    function handleLogOut() {
        signOut()
    }

    return (
        <aside className="
            p-5 pt-10 h-full w-60
            flex flex-col items-center
            bg-[url('/bg/sidebar-bg.svg')] bg-no-repeat bg-cover
            rounded-lg">
            <Image
                src="/logo.svg" alt="Logo Book Wise"
                width={128} height={32} quality={100} />

            <nav className="mt-16 flex flex-col gap-4">
                <SidebarLink
                    url="/home"
                    icon={ChartLineUp}
                    text="Início" />
                <SidebarLink
                    url="/explore"
                    icon={Binoculars}
                    text="Explorar" />
                {data?.user && (
                    <SidebarLink
                        url={`/profile/${data?.user.id}`}
                        icon={User}
                        text="Perfil" />
                )}
            </nav>

            <footer className="
                mt-auto w-full">
                {data?.user ? (
                    <div className="w-full flex gap-3 items-center">
                        <figure className="p-[2px] bg-gradient-vertical rounded-full">
                            <Image
                                src={data?.user.avatar_url!} alt=""
                                width={40} height={40}
                                className="rounded-full" />
                        </figure>

                        <strong
                            title={data?.user.name}
                            className="text-base text-bk-gray-200 truncate">
                            {data?.user.name}
                        </strong>

                        <button
                            type="button"
                            onClick={handleLogOut}
                            className="
                                ml-auto p-1
                                text-red-500
                                border border-transparent rounded-md
                                transition-colors hover:bg-bk-gray-600 focus:outline-none
                                focus-visible:bg-bk-gray-600 focus-visible:border-red-500">
                            <SignIn size={24} />
                        </button>
                    </div>
                ) : (
                    <div className="w-full flex items-center justify-center">
                        <Dialog.Root
                            open={isLoginModalOpen}
                            onOpenChange={setLoginModalOpen}>
                            <Dialog.Trigger asChild>
                                <button
                                    type="button"
                                    className="
                                        px-4 py-3 flex gap-3 items-center
                                        text-base text-bk-gray-200 font-bold
                                        border-2 border-transparent rounded-lg
                                        transition-colors hover:bg-bk-gray-600 focus:outline-none
                                        focus-visible:bg-bk-gray-600 focus-visible:border-bk-gray-200">
                                    Fazer Login
                                    <SignIn
                                        size={24}
                                        className="
                                        text-bk-green-100" />
                                </button>
                            </Dialog.Trigger>
                            <LoginModal page="/home" />
                        </Dialog.Root>
                    </div>
                )}
            </footer>
        </aside>
    )
}