import { useContext, useEffect } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import Image from 'next/image'
import { Book } from '@prisma/client'
import { useRouter } from 'next/router'
import { BookModalContext } from '@/contexts/book-modal'

import BookModal from '../book-modal'

import { Star } from 'phosphor-react'

export type BookWithAVGRating = Book & {
    AVGRating: number,
    alreadyRead: boolean
}

interface BookCardProps {
    book: BookWithAVGRating
}

export default function BookCard({ book }: BookCardProps) {
    const { isBookModalOpen, openBookModal, onOpenChange } = useContext(BookModalContext)

    const router = useRouter()
    const paramBookID = router.query.book as string

    useEffect(() => {
        if(paramBookID === book?.id) {
            openBookModal()
        }
    }, [paramBookID, book.id])

    return (
        <Dialog.Root
            open={isBookModalOpen}
            onOpenChange={() => onOpenChange(book.id)}>
            <Dialog.Trigger asChild>
                <div className="
                    relative px-5 py-4 bg-bk-gray-700
                    grid grid-cols-[100px_1fr] gap-5 cursor-pointer
                    border-2 border-transparent rounded-lg
                    transition-colors hover:border-bk-purple-100">
                    {book.alreadyRead && (
                        <span className="
                            absolute -top-[2px] -right-[2px]
                            px-3 p-1 bg-bk-green-800
                            text-xs text-bk-green-100 font-bold uppercase text-center
                            rounded-tr-lg rounded-bl-lg">
                            Lido
                        </span>
                    )}

                    <figure>
                        <Image
                            src={book.cover_url}
                            title={`Imagem demonstrativa do livro ${book.name}`}
                            alt={`Imagem demonstrativa do livro ${book.name}`}
                            width={110} height={160}
                            className=" h-full" />
                    </figure>

                    <div className="flex flex-col justify-between">
                        <div className="flex flex-col gap-1">
                            <strong className="text-lg text-bk-gray-100 line-clamp-2">
                                {book.name}
                            </strong>
                            <span className="text-base text-bk-gray-400 line-clamp-2">
                                {book.author}
                            </span>
                        </div>

                        <div className="flex gap-1 items-center">
                            {Array.from({length: 5}).map((_, index) => {
                                return (
                                    <Star
                                    key={`star-${index}`}
                                    size={20}
                                    weight={(index + 1) <= book.AVGRating ? "fill" : "regular"}
                                    className="text-bk-purple-100" />
                                )
                            })}
                        </div>
                    </div>
                </div>
            </Dialog.Trigger>
            <BookModal bookID={book.id} />
        </Dialog.Root>
    )
}