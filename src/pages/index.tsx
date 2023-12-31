import React from 'react'
import { useSession } from 'next-auth/react'

import Login from './login'

export default function Home() {
    const { data } = useSession()

    return (
        <React.Fragment>
            <Login />
        </React.Fragment>
    )
}