'use client'

import React from 'react'
import { useCall, useCallStateHooks } from '@stream-io/video-react-sdk'

import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'

const EndCallButton = () => {
  const call = useCall()
  const router = useRouter()

  const { useLocalParticipant } = useCallStateHooks()
  const localParticipant = useLocalParticipant()

  const isMeetingOwner =
    localParticipant &&
    call?.state.createdBy &&
    localParticipant.userId === call.state.createdBy.id

  if (!isMeetingOwner) return null

  return (
    <Button
      className="bg-red-500"
      onClick={async () => {
        await call.endCall()
        router.push('/')
      }}
    >
      End call for everyone
    </Button>
  )
}

export default EndCallButton
