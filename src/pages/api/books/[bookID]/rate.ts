import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { buildNextAuthOptions } from '../../auth/[...nextauth]'
import * as zod from 'zod'

export default async function hanlder(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if(req.method !== 'POST') {
        return res.status(405).end()
    }

    const session = await getServerSession(
        req,
        res,
        buildNextAuthOptions(req, res)
    )

    if(!session) {
        return res.status(401).end()
    }

    try {
        const bookID = String(req.query.bookID)
        const userID = String(session?.user?.id)

        const bodySchema = zod.object({
            description: zod.string().max(450),
            rate: zod.number().min(1).max(5)
        })

        const { description, rate } = bodySchema.parse(req.body)

        const userAlreadyRated = await prisma.rating.findFirst({
            where: {
                user_id: userID,
                book_id: bookID
            }
        })

        if(userAlreadyRated) {
            return res.status(400).json({
                error: 'User already rated this book'
            })
        }

        await prisma.rating.create({
            data: {
                book_id: bookID,
                description,
                rate,
                user_id: userID
            }
        })

        return res.status(201).end()
    } catch (error) {
        console.error(error)
        return res.status(400).end()
    }
}