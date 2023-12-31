import React, { useEffect, useMemo, useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import { Book, CategoriesOnBooks, Category, Rating } from '@prisma/client'

import Layout from '@/components/layout'

import { User, MagnifyingGlass, Star, BookOpen, Books, BookmarkSimple, UserList, CaretLeft } from 'phosphor-react'

export type ProfileRating = Rating & {
    book: Book & {
      categories: CategoriesOnBooks & {
        category: Category
      }[]
    }
}

export type ProfileData = {
    ratings: ProfileRating[]
    user: {
      avatar_url: string
      name: string
      member_since: string
    }
    readPages: number
    ratedBooks: number
    readAuthors: number
    mostReadCategory?: string
}

export default function Profile() {
    const [search, setSearch] = useState('')
    const { data, status } = useSession()
    const router = useRouter()
    const userID = router.query.id as string

    const { data: profile } = useQuery<ProfileData>({
        queryKey: ['profile', userID],
        queryFn: async () => {
            const { data } = await api.get(`/profile/${userID}`)
            return data?.profile ?? {}
        },
        enabled: !!userID
    })

    const isOwnProfile = data?.user?.id === userID

    const memberSince = new Date(profile?.user.member_since!).getFullYear()

    const filteredReviews = useMemo(() => {
        return profile?.ratings.filter(rating => {
            return rating.book.name.toLowerCase().includes(search.toLowerCase())
        })
    }, [profile?.ratings, search])

    useEffect(() => {
        if(status !== 'authenticated') {
            router.push('/')
        }
    }, [status])

    return (
        <React.Fragment>
            <Head>
                <title>BookWise - Explorar</title>
            </Head>

            <Layout>
                <section className="
                    w-[60%] pb-4 flex flex-col gap-12">
                    <header className="w-full flex flex-col gap-10">
                        {isOwnProfile ? (
                            <div className="flex gap-3 items-center">
                                <User
                                    size={24}
                                    weight="bold"
                                    className="text-bk-green-100" />
                                <strong className="text-2xl text-bk-gray-100">
                                    Perfil
                                </strong>
                            </div>
                        ) : (
                            <Link
                                href="/home"
                                className="
                                    px-2 py-1 w-fit
                                    flex gap-3 items-center
                                    text-base text-bk-gray-200
                                    border border-transparent rounded-md
                                    transition-colors hover:bg-bk-gray-700 hover:text-bk-gray-100
                                    focus:outline-none focus-visible:bg-bk-gray-700 focus-visible:text-bk-gray-100
                                    focus-visible:border-bk-gray-100">
                                <CaretLeft
                                    size={24}
                                    weight="bold" />
                                Voltar
                            </Link>
                        )}

                        <div className="
                            relative w-full flex items-center">
                            <input
                                type="text"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Buscar por livro avaliado"
                                className="
                                h-full w-full px-5 py-3 bg-transparent
                                text-bk-gray-100 placeholder:text-bk-gray-400 cursor-pointer
                                border-2 border-bk-gray-500 rounded-lg
                                transition-colors hover:border-bk-purple-100
                                focus:outline-none focus-visible:border-bk-purple-100" />
                            <MagnifyingGlass
                                size={20}
                                weight="bold"
                                className="
                                    absolute right-4
                                    text-bk-gray-500" />
                        </div>
                    </header>

                    <ul className="
                        overflow-y-scroll scrollbar-thin
                        scrollbar-track-bk-gray-800 scrollbar-thumb-bk-gray-700
                        pr-4 flex flex-col gap-6">
                        {filteredReviews?.map(rating => {
                            return (
                                <li className="flex flex-col gap-2">
                                    <span className="text-base text-bk-gray-300">
                                        Há 2 dias
                                    </span>

                                    <div className="
                                        p-6 bg-bk-gray-700
                                        flex flex-col gap-6
                                        border-2 border-transparent rounded-lg
                                        transition-colors hover:border-bk-green-100 focus:outline-none">
                                        <div className="flex gap-6">
                                            <figure>
                                                <Image
                                                    src={rating.book.cover_url}
                                                    title={`Imagem demonstrativa do livro ${rating.book.name}`}
                                                    alt={`Imagem demonstrativa do livro ${rating.book.name}`}
                                                    width={100} height={135}
                                                    className="rounded-lg" />
                                            </figure>

                                            <div className="flex flex-col justify-between">
                                                <div className="flex flex-col gap-2">
                                                    <strong className="text-xl text-bk-gray-100">
                                                        {rating.book.name}
                                                    </strong>
                                                    <span className="text-lg text-bk-gray-400">
                                                        {rating.book.author}
                                                    </span>
                                                </div>

                                                <div className="flex gap-1 items-center">
                                                    {Array.from({length: 5}).map((_, index) => {
                                                        return (
                                                            <Star
                                                                key={`star-${index}`}
                                                                size={20}
                                                                weight={(index + 1) <= rating.rate ? "fill" : "regular"}
                                                                className="text-bk-purple-100" />
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        </div>

                                        <p className="text-lg text-bk-gray-300">
                                            {rating.description}
                                        </p>
                                    </div>
                                </li>
                            )
                        })}
                        {filteredReviews?.length! <= 0 && (
                            <strong className="text-xl text-bk-gray-100 text-center">
                                {search ? 'Nenhum resultado encontrado' : 'Nenhuma avaliação encontrada'}
                            </strong>
                        )}
                    </ul>
                </section>

                <section className="
                    w-[20%] pb-4 flex flex-col gap-12 items-center
                    border-l border-bk-gray-700">
                    <div className="mt-[60px] flex flex-col gap-5 items-center">
                        <figure className="
                            p-[2px] w-[72px] h-[72px] bg-gradient-vertical
                             rounded-full">
                            <Image
                                src={profile?.user.avatar_url!} alt=""
                                width={72} height={72}
                                className=" rounded-full" />
                        </figure>

                        <div className="flex flex-col gap-1 items-center">
                            <strong className="text-xl text-bk-gray-100">
                                {profile?.user.name}
                            </strong>
                            <span className="text-lg text-bk-gray-400">
                                membro desde {memberSince}
                            </span>
                        </div>
                    </div>

                    <hr className="w-8 h-1 bg-gradient-horizontal border-none rounded-full" />

                    <div className="flex flex-col gap-10">
                        <div className="flex gap-5 items-center">
                            <BookOpen size={24} weight="bold" className="text-bk-green-100" />

                            <div className="flex flex-col">
                                <strong className="text-xl text-bk-gray-100">
                                    {profile?.readPages}
                                </strong>
                                <span className="text-lg text-bk-gray-400">
                                    Páginas lidas
                                </span>
                            </div>
                        </div>
                        <div className="flex gap-5 items-center">
                            <Books size={24} weight="bold" className="text-bk-green-100" />

                            <div className="flex flex-col">
                                <strong className="text-xl text-bk-gray-100">
                                    {profile?.ratedBooks}
                                </strong>
                                <span className="text-lg text-bk-gray-400">
                                    Livros avaliados
                                </span>
                            </div>
                        </div>
                        <div className="flex gap-5 items-center">
                            <UserList size={24} weight="bold" className="text-bk-green-100" />

                            <div className="flex flex-col">
                                <strong className="text-xl text-bk-gray-100">
                                    {profile?.readAuthors}
                                </strong>
                                <span className="text-lg text-bk-gray-400">
                                    Autores lidos
                                </span>
                            </div>
                        </div>
                        <div className="flex gap-5 items-center">
                            <BookmarkSimple size={24} weight="bold" className="text-bk-green-100" />

                            <div className="flex flex-col">
                                <strong className="text-xl text-bk-gray-100">
                                    {profile?.mostReadCategory}
                                </strong>
                                <span className="text-lg text-bk-gray-400">
                                    Categoria mais lida
                                </span>
                            </div>
                        </div>
                    </div>
                </section>
            </Layout>
        </React.Fragment>
    )
}