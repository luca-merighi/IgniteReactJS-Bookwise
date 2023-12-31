import Image from 'next/image'
import Link from 'next/link'
import { getRelativeTimeString } from '@/utils/get-relative-time-string'
import { User, Book, Rating } from '@prisma/client'
import { useToggleShowMore } from '@/hooks/toggle-show-more'

import { Star } from 'phosphor-react'

export type ReviewWithAuthorAndBook = Rating & {
    user: User,
    book: Book
}

interface BookReviewProps {
    review: ReviewWithAuthorAndBook
}

const MaxSummaryLength = 300

export default function BookReview({ review }: BookReviewProps) {
    const { text: bookSummary, toggleShowMore, isShowingMore } = useToggleShowMore(review.book.summary, MaxSummaryLength)

    const timeDistance = getRelativeTimeString(new Date(review.created_at), 'pt-BR')

    return (
        <li className="
                p-6 bg-bk-gray-700
                flex flex-col gap-8
                border-2 border-transparent rounded-lg cursor-pointer
                transition-colors hover:border-bk-green-100">
            <header className="flex justify-between">
                <Link
                    href={`/profile/${review.user.id}`}
                    className="flex gap-4 items-center">
                    <figure className="p-[2px] bg-gradient-vertical rounded-full">
                        <Image
                            src={review.user.avatar_url!} alt=""
                            width={40} height={40}
                            className="w-[40px] h-[40px] rounded-full" />
                    </figure>

                    <div className="flex flex-col gap-1">
                        <span className="text-base text-bk-gray-100">
                            {review.user.name}
                        </span>
                        <span className="text-sm text-bk-gray-400">
                            {timeDistance}
                        </span>
                    </div>
                </Link>

                <div className="flex gap-1 items-center">
                    {Array.from({length: 5}).map((_, index) => {
                        return (
                            <Star
                                key={`star-${index}`}
                                size={20}
                                weight={(index + 1) <= review.rate ? "fill" : "regular"}
                                className="text-bk-purple-100" />
                        )
                    })}
                </div>
            </header>

            <div className="grid grid-cols-[100px_1fr] gap-5">
                <figure className="w-full h-[150px]">
                    <Image
                        src={review.book.cover_url!}
                        title={`Imagem demonstrativa do livro ${review.book.name}`}
                        alt={`Imagem demonstrativa do livro ${review.book.name}`}
                        width={200} height={500} quality={100}
                        className="w-full h-full" />
                </figure>

                <div className="flex flex-col gap-5">
                    <div className="flex flex-col">
                        <strong className="text-base text-bk-gray-100">
                            {review.book.name}
                        </strong>
                        <span className="text-sm text-bk-gray-400">
                            {review.book.author}
                        </span>
                    </div>

                    <p className="text-base text-bk-gray-300 leading-7">
                        {review.description}
                        {review.book.summary.length > MaxSummaryLength && (
                            <button
                                type="button"
                                onClick={toggleShowMore}
                                className="
                                ml-1
                                text-base text-bk-purple-100 font-bold
                                transition-colors hover:underline">
                                {isShowingMore ? 'ver menos' : 'ver mais'}
                            </button>
                        )}
                    </p>
                </div>
            </div>
        </li>
    )
}