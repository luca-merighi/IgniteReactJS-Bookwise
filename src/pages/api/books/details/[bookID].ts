import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'

export default async function hanlder(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if(req.method !== 'GET') {
        return res.status(405).end()
    }

    const bookID = String(req.query.bookID)

    const book = await prisma.book.findUnique({
        where: {
            id: bookID,
        },
        include: {
            categories: {
                include: {
                    category: true
                }
            },
            ratings: {
                include: {
                    user: true
                }
            }
        }
    })

    const booksAVGRating = await prisma.rating.groupBy({
        by: ['book_id', ],
        where: { book_id: bookID },
        _avg: { rate: true }
    })

    const bookWithAVGRating = {
        ...book,
        AVGRating: booksAVGRating[0]?._avg.rate ?? 0
    }

    return res.json({ book: bookWithAVGRating })
}