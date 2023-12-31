import { ReactNode } from 'react'
import BookModalProvider from '@/contexts/book-modal'

import Sidebar from '../sidebar'

interface LayoutProps {
    children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
    return (
        <BookModalProvider>
            <div className="
                overflow-hidden p-4 h-screen w-screen flex gap-24">
                <Sidebar />

                <main className="mt-16 flex flex-1 gap-16">
                    {children}
                </main>
            </div>
        </BookModalProvider>
    )
}