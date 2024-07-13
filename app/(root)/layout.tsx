import StreamVideoProvider from '@/providers/StreamClientProvider'

import React from 'react'

import { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'pixle HQ',
  description: 'Video Calling app',
  icons: {
    icon: '/icons/logo.svg',
  },
}
const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main>
      <StreamVideoProvider>{children}</StreamVideoProvider>
    </main>
  )
}

export default RootLayout
