import { ElementType } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

interface SidebarLinkProps {
    icon: ElementType
    url: string,
    text: string
}

export default function SidebarLink({ url, icon: Icon, text }: SidebarLinkProps) {
    const { asPath } = useRouter()
    const isLinkActive = asPath === url ? true : false

    return (
        <Link
            href={url}
            data-active={isLinkActive}
            className="
                relative px-6 py-3
                flex gap-2 items-center
                text-lg text-bk-gray-400 font-normal
                border-2 border-transparent rounded-lg
                transition-colors hover:bg-bk-gray-600 hover:text-bk-gray-200 focus:outline-none
                focus-visible:border-bk-gray-100 focus-visible:bg-bk-gray-600 focus-visible:text-bk-gray-200
                data-[active=true]:text-bk-gray-100 data-[active=true]:font-bold
                data-[active=true]:before:absolute data-[active=true]:before:top-auto
                data-[active=true]:before:left-0 data-[active=true]:before:w-1 data-[active=true]:before:h-[70%]
                data-[active=true]:before:bg-gradient-vertical data-[active=true]:before:rounded-full">
            <Icon size={24} weight="bold" />
            {text}
        </Link>
    )
}