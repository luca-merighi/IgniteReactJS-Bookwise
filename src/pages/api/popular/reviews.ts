import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'

export default async function hanlder(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if(req.method !== 'GET') {
        return res.status(405).end()
    }

    const reviews = await prisma.book.findMany({
        orderBy: {
            ratings: {
                _count: 'desc'
            }
        },
        include: {
            ratings: true
        },
        take: 4
    })

    const averageRating = await prisma.rating.groupBy({
        by: ['book_id'],
        where: {
            book_id: {
                in: reviews.map(review => review.id)
            }
        },
        _avg: {
            rate: true
        }
    })

    const reviewsWithAVGRating = reviews.map(review => {
        const reviewAvgRating = averageRating.find(avgRating => avgRating.book_id === review.id)
        const { ratings, ...bookInfo } = review
        return {
            ...bookInfo,
            avgRating: reviewAvgRating?._avg.rate
        }
    })

    return res.json({ popularReviews: reviewsWithAVGRating })
}