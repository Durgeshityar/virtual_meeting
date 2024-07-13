import React from 'react'

import Image from 'next/image'
import Link from 'next/link'

import { SignedIn, UserButton } from '@clerk/nextjs'

import MobileNav from '@/components/MobileNav'

//todo: font press start P2 for name

const Navbar = () => {
  return (
    <nav className="flex-between fixed z-50 w-full bg-dark-1 px-6 py-4 lg:px-10">
      <Link href={'/'} className="flex items-center gap-1">
        <Image
          src="icons/logo.svg"
          alt="logo"
          width={32}
          height={32}
          className="max-sm:size-10"
        />
        <p className="text-[26px] font font-extrabold max-sm:hidden text-white px-2">
          PixleHQ
        </p>
      </Link>
      <div className="flex-between gap-5">
        <SignedIn>
          <UserButton />
        </SignedIn>
        <MobileNav />
      </div>
    </nav>
  )
}

export default Navbar
