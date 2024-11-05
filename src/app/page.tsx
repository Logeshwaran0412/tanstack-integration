'use client';

import Link from "next/link";

const Page = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Home page</h1>
      <div className="space-x-4">
        <Link
          href="/coffee"
          className="text-blue-500 hover:text-blue-700 underline"
        >
          Coffee
        </Link>
        <Link
          href="/todos"
          className="text-blue-500 hover:text-blue-700 underline"
        >
          Todos
        </Link>
      </div>
    </div>
  );
};

export default Page;