import React, { useState } from 'react'
import Head from 'next/head'
import { useQuery } from '@tanstack/react-query'
import { Category } from '@prisma/client'
import { api } from '@/lib/axios'

import Layout from '@/components/layout'
import BookCard, { BookWithAVGRating } from '@/components/book-card'

import { Binoculars, MagnifyingGlass } from 'phosphor-react'

export default function Explorepage() {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
    const [search, setSearch] = useState('')

    const { data: categories } = useQuery<Category[]>({
        queryKey: ['categories'],
        queryFn: async () => {
            const { data } = await api.get('/reviews/categories')
            return data.categories ?? []
        }
    })

    const { data: books } = useQuery<BookWithAVGRating[]>({
        queryKey: ['books', selectedCategory],
        queryFn: async () => {
            const { data } = await api.get('/books', {
                params: {
                    category: selectedCategory
                }
            })
            return data.books ?? []
        }
    })

    const filteredBooks = books?.filter(book => {
        return book.name.toLowerCase().includes(search.toLowerCase())
            || book.author.toLowerCase().includes(search.toLowerCase())
    })

    return (
        <React.Fragment>
            <Head>
                <title>BookWise - Explorar</title>
            </Head>

            <Layout>
                <section className="
                    w-full pr-24 pb-4 flex flex-col gap-12">
                    <header className="w-full flex flex-col gap-10">
                        <div className="w-full flex items-center justify-between">
                            <div className="flex gap-3 items-center">
                                <Binoculars
                                    size={24}
                                    weight="bold"
                                    className="text-bk-green-100" />
                                <strong className="text-2xl text-bk-gray-100">
                                    Explorar
                                </strong>
                            </div>

                            <div className="
                                relative w-96 flex items-center">
                                <input
                                    type="text"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    placeholder="Buscar por livro ou autor"
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
                                        text-bk-gray-500
                                        transition-colors hover:text-bk-gray-300" />
                            </div>
                        </div>

                        <div className="w-full flex gap-3 items-center">
                            <button
                                type="button"
                                data-state={selectedCategory === null}
                                onClick={() => setSelectedCategory(null)}
                                className="
                                    px-4 py-1 bg-transparent
                                    text-sm text-bk-purple-100
                                    border border-bk-purple-100 rounded-full
                                    transition-colors hover:text-bk-gray-300 hover:border-bk-gray-300
                                    focus:outline-none focus:text-bk-gray-300 focus-visible:border-bk-gray-300
                                    data-[state=true]:bg-bk-purple-700 data-[state=true]:text-bk-gray-100
                                    data-[state=true]:border-bk-purple-700">
                                Tudo
                            </button>
                            {categories?.map(category => {
                                return (
                                    <button
                                        key={category.id}
                                        type="button"
                                        data-state={selectedCategory === category.id ? true : false}
                                        onClick={() => setSelectedCategory(category.id)}
                                        className="
                                            px-4 py-1 bg-transparent
                                            text-sm text-bk-purple-100
                                            border border-bk-purple-100 rounded-full
                                            transition-colors hover:text-bk-gray-300 hover:border-bk-gray-300
                                            focus:outline-none focus:text-bk-gray-300 focus-visible:border-bk-gray-300
                                            data-[state=true]:bg-bk-purple-700 data-[state=true]:text-bk-gray-100
                                            data-[state=true]:border-bk-purple-700">
                                        {category.name}
                                    </button>
                                )
                            })}
                        </div>
                    </header>

                    <div className="
                        overflow-y-scroll scrollbar-thin
                        scrollbar-track-bk-gray-800 scrollbar-thumb-bk-gray-700
                        pr-4 grid grid-cols-4 gap-5">
                        {filteredBooks?.map(book => {
                            return (
                                <BookCard
                                    key={book.id}
                                    book={book} />
                            )
                        })}
                    </div>
                </section>
            </Layout>
        </React.Fragment>
    )
}