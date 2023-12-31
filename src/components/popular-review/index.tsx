import Image from 'next/image'
import { Book } from '@prisma/client'

import { Star } from 'phosphor-react'

export type PopularReviewWithAVGRating = Book & {
    avgRating: number
}

interface PopularReviewProps {
    review: PopularReviewWithAVGRating
}

export default function PopularReview({ review }: PopularReviewProps) {
    return (
        <li
        className="
            p-5 bg-bk-gray-700
            grid grid-cols-[70px_1fr] gap-5
            border-2 border-transparent rounded-lg cursor-pointer
            transition-colors hover:border-bk-purple-100">
            <figure className="w-full h-full">
                <Image
                    src={review.cover_url}
                    title={`Imagem demonstrativa do livro ${review.name}`}
                    alt={`Imagem demonstrativa do livro ${review.name}`}
                    width={70} height={100}
                    className="w-full h-full" />
            </figure>

            <div className="flex flex-col justify-between">
                <div className="flex flex-col">
                    <strong className="text-base text-bk-gray-100 leading-5 line-clamp-2">
                        {review.name}
                    </strong>
                    <span className="text-sm text-bk-gray-400">
                        {review.author}
                    </span>
                </div>

                <div className="flex gap-1 items-center">
                    {Array.from({length: 5}).map((_, index) => {
                        return (
                            <Star
                                key={`star-${index}`}
                                size={20}
                                weight={(index + 1) <= review.avgRating ? "fill" : "regular"}
                                className="text-bk-purple-100" />
                        )
                    })}
                </div>
            </div>
        </li>
    )
}