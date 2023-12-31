import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import { useSession } from 'next-auth/react'

import Layout from '@/components/layout'
import BookReview, { ReviewWithAuthorAndBook } from '@/components/book-review'
import PopularReview, { PopularReviewWithAVGRating } from '@/components/popular-review'

import { ChartLineUp, CaretRight, Star } from 'phosphor-react'

export default function Homepage() {
    const { data } = useSession()

    const userID = data?.user.id

    const { data: latestUserReview } = useQuery<ReviewWithAuthorAndBook>({
        queryKey: ['latest-user-review', userID],
        queryFn: async () => {
            const { data } = await api.get('reviews/user-latest')
            return data?.rating ?? null
        },
        enabled: !!userID
    })

    const { data: reviews } = useQuery<ReviewWithAuthorAndBook[]>({
        queryKey: ['latest-reviews'],
        queryFn: async () => {
            const { data } = await api.get('/reviews/latest')
            return data.reviews ?? []
        }
    })

    const { data: popularReviews } = useQuery<PopularReviewWithAVGRating[]>({
        queryKey: ['popular-reviews'],
        queryFn: async () => {
            const { data } = await api.get('/popular/reviews')
            return data.popularReviews ?? []
        }
    })

    return (
        <React.Fragment>
            <Head>
                <title>BookWise - Início</title>
            </Head>

            <Layout>
                <section className="
                    w-[70%] pb-4 flex flex-col gap-4">
                    <header className="flex flex-col gap-10">
                        <div className="flex gap-3 items-center">
                            <ChartLineUp
                                size={24}
                                weight="bold"
                                className="text-bk-green-100" />
                            <strong className="text-2xl text-bk-gray-100">
                                Início
                            </strong>
                        </div>
                    </header>

                    {latestUserReview && (
                        <div className="flex flex-col gap-4">
                            <header className="flex items-center justify-between">
                                <span className="text-base text-bk-gray-100">
                                    Sua última leitura
                                </span>

                                <Link
                                    href={`/profile/${userID}`}
                                    className="
                                        px-2 py-1
                                        flex gap-2 items-center
                                        text-base text-bk-purple-100 font-bold
                                        border border-transparent rounded-md">
                                    Ver todas
                                    <CaretRight size={20} weight="bold" />
                                </Link>
                            </header>

                            <div className="
                                px-6 py-5 bg-bk-gray-600
                                flex gap-6
                                rounded-lg">
                                <figure>
                                    <Image
                                        src={latestUserReview.book.cover_url!}
                                        title={`Imagem demonstrativa do livro ${latestUserReview.book.name}`}
                                        alt={`Imagem demonstrativa do livro ${latestUserReview.book.name}`}
                                        width={100} height={150} quality={100}
                                        className="" />
                                </figure>

                                <div className="w-full flex flex-col">
                                    <header className="flex items-center justify-between">
                                        <span className="text-base text-bk-gray-300">
                                            dois dias
                                        </span>

                                        <div className="flex gap-1 items-center">
                                            {Array.from({length: 5}).map((_, index) => {
                                                return (
                                                    <Star
                                                        key={`star-${index}`}
                                                        size={20}
                                                        weight={(index + 1) <= latestUserReview.rate ? "fill" : "regular"}
                                                        className="text-bk-purple-100" />
                                                )
                                            })}
                                        </div>
                                    </header>

                                    <div className="h-full flex flex-col justify-between">
                                        <div className="flex flex-col">
                                            <strong className="text-base text-bk-gray-100">
                                                {latestUserReview.book.name}
                                            </strong>
                                            <span className="text-sm text-bk-gray-400">
                                                {latestUserReview.book.author}
                                            </span>
                                        </div>

                                        <p className="mt-auto text-sm text-bk-gray-300 line-clamp-2">
                                            {latestUserReview.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="
                    overflow-y-scroll scrollbar-thin
                    scrollbar-track-bk-gray-800 scrollbar-thumb-bk-gray-700
                    pr-4 flex flex-col gap-5">
                        <span className="text-sm text-bk-gray-100">
                            Avaliações mais recentes
                        </span>

                        <ul className="flex flex-col gap-3">
                            {reviews?.map(review => {
                                return (
                                    <BookReview
                                        key={review.id}
                                        review={review} />
                                )
                            })}
                        </ul>
                    </div>
                </section>

                <section className="flex flex-1 flex-col gap-4">
                    <header className="mt-[60px] flex items-center justify-between">
                        <span className="text-sm text-bk-gray-100">
                            Livros Populares
                        </span>

                        <Link
                            href="/explore"
                            className="
                                px-2 py-1 flex gap-2 items-center
                                text-sm text-bk-purple-100
                                border border-transparent rounded-md
                                transition-colors hover:bg-bk-gray-700 focus:outline-none
                                focus-visible:bg-bk-gray-700 focus-visible:border-bk-purple-100">
                            Ver todos
                            <CaretRight size={18} />
                        </Link>
                    </header>

                    <ul className="flex flex-col gap-3">
                        {popularReviews?.map(review => {
                            return (
                                <PopularReview
                                    key={review.id}
                                    review={review} />
                            )
                        })}
                    </ul>
                </section>
            </Layout>
        </React.Fragment>
    )
}