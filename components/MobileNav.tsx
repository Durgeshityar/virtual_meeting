'use client'
import React from 'react'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { cn } from '@/lib/utils'

import { sidebarLinks } from '@/constants'

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

const MobileNav = () => {
  const pathname = usePathname()
  return (
    <section className="w-full max-w-[264px]">
      <Sheet>
        <SheetTrigger asChild>
          <Image
            src="/icons/hamburger.svg"
            alt="logo"
            width={36}
            height={36}
            className="cursor-pointer sm:hidden"
          />
        </SheetTrigger>
        <SheetContent side="left" className="border-none bg-dark-1">
          <Link href={'/'} className="flex items-center gap-1">
            <Image
              src="icons/logo.svg"
              alt="logo"
              width={32}
              height={32}
              className="max-sm:size-10"
            />
            <p className="text-[26px] font font-extrabold  text-white px-2">
              PixleHQ
            </p>
          </Link>
          <div className="flex h-[calc(100vh-72)] flex-col justify-between overflow-y-auto">
            <SheetClose asChild>
              <section className="flex h-full flex-col gap-6 pt-16 to-white">
                {sidebarLinks.map((link) => {
                  const isActive = pathname === link.route
                  return (
                    <SheetClose asChild key={link.route}>
                      <Link
                        href={link.route}
                        className={cn(
                          'flex gap-4 items-center p-4  rounded-xl w-full',
                          { 'bg-blue-1': isActive } // conditional class
                        )}
                      >
                        <Image
                          src={link.imgURL}
                          alt={link.label}
                          width={24}
                          height={24}
                        />
                        <p className=" font-semibold ">{link.label}</p>
                      </Link>
                    </SheetClose>
                  )
                })}
              </section>
            </SheetClose>
          </div>
        </SheetContent>
      </Sheet>
    </section>
  )
}

export default MobileNav
