import { FormEvent, useState } from 'react'
import Image from 'next/image'
import * as Dialog from '@radix-ui/react-dialog'
import { useSession } from 'next-auth/react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import { BookWithAVGRating } from '../book-card'
import { CategoriesOnBooks, Category } from '@prisma/client'
import { useRouter } from 'next/router'

import BookReview, { ReviewWithAuthor } from './book-review'
import LoginModal from '../login-modal'

import { X, BookmarkSimple, BookOpen, Check, Star } from 'phosphor-react'

type BookDetails = BookWithAVGRating & {
    ratings: ReviewWithAuthor[],
    categories: (CategoriesOnBooks & {
        category: Category
    })[]
}

interface BookModalProps {
    bookID: string
}

export default function BookModal({ bookID }: BookModalProps) {
    const { data } = useSession()
    const [isLoginModalOpen, setLoginModalOpen] = useState(false)
    const [isUserWritingReview, setUserWritingReview] = useState(false)
    const [review, setReview] = useState('')
    const [reviewStars, setReviewStars] = useState(1)

    const { data: book } = useQuery<BookDetails>({
        queryKey: ['book', bookID],
        queryFn: async () => {
            const { data } = await api.get(`/books/details/${bookID}`)
            return data?.book ?? {}
        }
    })

    const sortedBookReviews = book?.ratings.sort((a, b) => {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })

    const canUserReviewBook = book?.ratings.every(X => X.user_id !== data?.user.id)

    const categories = book?.categories?.map(X => X?.category?.name)?.join(', ') ?? ''

    const queryClient = useQueryClient()

    const { mutateAsync: handleRate } = useMutation({
        mutationFn: async () => {
            await api.post(`/books/${bookID}/rate`, {
                description: review,
                rate: reviewStars
            })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['book', bookID]
            }),
            queryClient.invalidateQueries({
                queryKey: ['books']
            })
            handleCloseReview()
        }
    })

    function handleWriteReview() {
        if(canUserReviewBook) {
            setUserWritingReview(true)
        } else {
            return
        }
    }

    function handleMouseEnter(index: number) {
        setReviewStars(index)
    }

    function handleMouseLeave(AVGRating: number) {
        setReviewStars(AVGRating)
    }

    function handleSetValue(AVGRating: number) {
        setReviewStars(AVGRating)
    }

    function handleCloseReview() {
        setUserWritingReview(false)
        setReviewStars(0)
        setReview('')
    }

    async function handleFormSubmit(event: FormEvent) {
        event.preventDefault()

        await handleRate()
    }

    const router = useRouter()
    const paramBookID = router.query.book as string

    return (
        <Dialog.Portal>
            <Dialog.Overlay className="
                data-[state=open]:animate-overlayShow
                data-[state=closed]:animate-overlayHide
                fixed inset-0 z-40 bg-black/10" />
            <Dialog.Content className="
                data-[state=open]:animate-bookModalShow
                data-[state=closed]:animate-bookModalHide
                fixed z-50 top-0 right-0
                w-[30%] h-full px-12 pt-16 pb-8 bg-bk-gray-800
                flex flex-col gap-10 shadow-modal-shadow
                focus:outline-none">
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

                <div className="
                    px-8 py-6 bg-bk-gray-700
                    flex flex-col gap-10
                    rounded-lg">
                    <div className="flex gap-8">
                        <figure>
                            <Image
                                src={book?.cover_url!}
                                title={`Imagem demonstrativa do livro ${book?.name}`}
                                alt={`Imagem demonstrativa do livro ${book?.name}`}
                                width={130} height={200} quality={100}
                                className="rounded-lg" />
                        </figure>

                        <div className="flex flex-col justify-between">
                            <div className="flex flex-col gap-1">
                                <strong className="text-xl text-bk-gray-100 line-clamp-2">
                                    {book?.name}
                                </strong>
                                <span className="text-lg text-bk-gray-300 line-clamp-2">
                                    {book?.author}
                                </span>
                            </div>

                            <div className="flex flex-col gap-1">
                                <div className="flex gap-1 items-center">
                                    {Array.from({length: 5}).map((_, index) => {
                                        return (
                                            <Star
                                            key={`star-${index}`}
                                            size={20}
                                            weight={(index + 1) <= book?.AVGRating! ? "fill" : "regular"}
                                            className="text-bk-purple-100" />
                                        )
                                    })}
                                </div>

                                <span className="text-sm text-bk-gray-400">
                                    {book?.ratings.length} {book?.ratings.length! > 1 ? 'avaliações' : 'avaliação'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <footer className="
                        pt-6 flex gap-14 items-center
                        border-t border-bk-gray-600">
                        <div className="flex gap-4 items-center">
                            <BookmarkSimple
                                size={24}
                                weight="bold"
                                className="text-bk-green-100" />

                            <div className="flex flex-col">
                                <span className="text-sm text-bk-gray-300">
                                    Categoria
                                </span>
                                <strong className="text-base text-bk-gray-200">
                                    {categories}
                                </strong>
                            </div>
                        </div>

                        <div className="flex gap-4 items-center">
                            <BookOpen
                                size={24}
                                weight="bold"
                                className="text-bk-green-100" />

                            <div className="flex flex-col">
                                <span className="text-sm text-bk-gray-300">
                                    Páginas
                                </span>
                                <strong className="text-base text-bk-gray-200">
                                    {book?.total_pages}
                                </strong>
                            </div>
                        </div>
                    </footer>
                </div>

                <div className="
                    overflow-auto flex flex-col gap-4">
                    <header className="flex items-center justify-between">
                        <span className="text-base text-bk-gray-200">
                            Avaliações
                        </span>

                        {data?.user ? (
                            <button
                                type="button"
                                onClick={handleWriteReview}
                                className="
                                    text-base text-bk-purple-100 font-bold
                                    hover:underline">
                                Avaliar
                            </button>
                        ) : (
                            <Dialog.Root
                                open={isLoginModalOpen}
                                onOpenChange={setLoginModalOpen}>
                                <Dialog.Trigger asChild>
                                    <button
                                        type="button"
                                        className="
                                            text-base text-bk-purple-100 font-bold
                                            hover:underline">
                                        Avaliar
                                    </button>
                                </Dialog.Trigger>
                                <LoginModal page={paramBookID ? `/explore?book=${paramBookID}` : "/explore"} />
                            </Dialog.Root>
                        )}
                    </header>

                    {isUserWritingReview && (
                        <div className="
                            p-6 bg-bk-gray-700
                            flex flex-col gap-5
                            rounded-lg">
                            <header className="flex items-center justify-between">
                                <div
                                className="flex gap-4 items-center">
                                    <figure className="p-[2px] bg-gradient-vertical rounded-full">
                                        <Image
                                            src={data?.user.avatar_url!} alt=""
                                            width={40} height={40}
                                            className="rounded-full" />
                                    </figure>

                                    <strong className="text-base text-bk-gray-100 font-bold">
                                        {data?.user.name}
                                    </strong>
                                </div>

                                <div className="flex items-center">
                                    {Array.from({length: 5}).map((_, index) => {
                                        return (
                                            <Star
                                            key={`star-${index}`}
                                            size={20}
                                            weight={(index + 1) <= reviewStars ? "fill" : "regular"}
                                            onMouseEnter={() => handleMouseEnter(index + 1)}
                                            onMouseLeave={() => handleMouseLeave(reviewStars)}
                                            onClick={() => handleSetValue(reviewStars)}
                                            className="text-bk-purple-100 cursor-pointer" />
                                        )
                                    })}
                                </div>
                            </header>

                            <form
                                onSubmit={handleFormSubmit}
                                className="
                                flex flex-col gap-3">
                                <div className="relative w-full h-32">
                                    <textarea
                                        value={review}
                                        onChange={e => setReview(e.target.value)}
                                        placeholder="Escreva sua avaliação"
                                        required
                                        maxLength={450}
                                        className="
                                            w-full h-32 px-4 py-3 bg-bk-gray-800 resize-none
                                            text-base text-bk-gray-200
                                            border-2 border-bk-gray-500 rounded-lg
                                            placeholder:text-bk-gray-400
                                            transition-colors hover:border-bk-purple-100 focus:outline-none
                                            focus-visible:border-bk-purple-100" />
                                    <span className="
                                        absolute bottom-3 right-5 p-[2px]
                                        bg-bk-gray-800 text-sm text-bk-gray-400">
                                        {review.length}/450
                                    </span>
                                </div>

                                <footer className="flex gap-2 items-center justify-end">
                                    <button
                                        type="button"
                                        onClick={handleCloseReview}
                                        className="
                                            w-10 h-10 bg-bk-gray-600
                                            text-bk-purple-100
                                            flex items-center justify-center
                                            border-2 border-transparent rounded-md
                                            transition-colors hover:bg-bk-gray-500 hover:text-bk-gray-300
                                            focus:outline-none focus-visible:bg-bk-gray-500
                                            focus-visible:text-bk-gray-300 focus-visible:border-bk-gray-300">
                                            <X size={24} weight="bold" />
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={review === ''}
                                        className="
                                            w-10 h-10 bg-bk-gray-600
                                            text-bk-green-100
                                            flex items-center justify-center
                                            border-2 border-transparent rounded-md
                                            disabled:opacity-75 disabled:cursor-not-allowed
                                            transition-colors hover:bg-bk-gray-500 hover:text-bk-gray-300
                                            focus:outline-none focus-visible:bg-bk-gray-500
                                            focus-visible:text-bk-gray-300 focus-visible:border-bk-gray-300">
                                            <Check size={24} weight="bold" />
                                    </button>
                                </footer>
                            </form>
                        </div>
                    )}

                    <ul className="
                        overflow-y-scroll scrollbar-thin
                        scrollbar-track-bk-gray-800 scrollbar-thumb-bk-gray-700
                        h-full pr-4 flex flex-col gap-3">
                        {sortedBookReviews?.map(rating => {
                            return (
                                <BookReview review={rating} />
                            )
                        })}
                    </ul>
                </div>
            </Dialog.Content>
        </Dialog.Portal>
    )
}