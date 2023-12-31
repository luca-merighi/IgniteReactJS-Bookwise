import { useRouter } from 'next/router'
import { ReactNode, createContext, useState } from 'react'

interface BookModalContextData {
    isBookModalOpen: boolean,
    onOpenChange: (bookID: string) => void,
    openBookModal: (bookID?: string) => void
}

interface BookModalProps {
    children: ReactNode
}

export const BookModalContext = createContext<BookModalContextData>({} as BookModalContextData)

export default function BookModalProvider({ children }: BookModalProps) {
    const [isBookModalOpen, setBookModalOpen] = useState(false)

    const router = useRouter()

    function onOpenChange(bookID: string) {
        if(isBookModalOpen === false) {
            setBookModalOpen(true)
            router.push(`/explore?book=${bookID}`, undefined, { shallow: true})
        } else {
            setBookModalOpen(false)
            router.push('/explore', undefined, { shallow: true})
        }
    }

    function openBookModal(bookID?: string) {
        setBookModalOpen(true)
        if(isBookModalOpen === false) {
            router.push(`/home?book=${bookID}`, undefined, { shallow: true})
        }
    }

    return (
        <BookModalContext.Provider value={{
            isBookModalOpen,
            onOpenChange,
            openBookModal
        }}>
            {children}
        </BookModalContext.Provider>
    )
}