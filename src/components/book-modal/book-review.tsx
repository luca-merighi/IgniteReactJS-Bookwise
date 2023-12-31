import Image from 'next/image'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { Rating, User } from '@prisma/client'
import { getRelativeTimeString } from '@/utils/get-relative-time-string'

import { Star } from 'phosphor-react'

export type ReviewWithAuthor = Rating & {
    user: User
}

interface BookReviewProps {
    review: ReviewWithAuthor
}

export default function BookReview({ review }: BookReviewProps) {
    const { data } = useSession()
    const isOwner = data?.user.id === review.user_id
    const timeDistance = getRelativeTimeString(new Date(review.created_at), 'pt-BR')

    return (
        <li className={`
            p-6 ${isOwner ? 'bg-bk-gray-600' : 'bg-bk-gray-700'}
            flex flex-col gap-5
            rounded-lg`}>
            <header className="flex justify-between">
                <Link
                    href={`/profile/${review.user.id}`}
                    className="flex gap-4 items-center">
                    <figure className="p-[2px] bg-gradient-vertical rounded-full">
                        <Image
                            src={review.user.avatar_url!} alt=""
                            width={40} height={40}
                            className="w-10 h-10 rounded-full" />
                    </figure>

                    <div className="flex flex-col">
                        <strong className="text-base text-bk-gray-100">
                            {review.user.name}
                        </strong>
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

            <p className="text-base text-bk-gray-300">
                {review.description}
            </p>
        </li>
    )
}