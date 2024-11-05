import CoffeeList from '@/components/CoffeeList'
import Link from 'next/link'
import React from 'react'

function page() {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Coffee Menu</h1>
            <Link href="/">Home</Link>
            <CoffeeList />
        </div>
    )
}

export default page