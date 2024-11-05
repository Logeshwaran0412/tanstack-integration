'use client';

import Link from "next/link";


const Page = () => {

  return (
    <div>
      Home page
      <Link href="/coffee">Coffee</Link>
    </div>
  );
};

export default Page;