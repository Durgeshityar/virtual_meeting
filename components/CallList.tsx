//@ts-nocheck

'use client'

import React, { useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

import { useGetCalls } from '@/hooks/useGetCalls'

import { Call, CallRecording } from '@stream-io/video-react-sdk'

import MeetingCard from './MeetingCard'
import Loaders from './Loaders'
import { useToast } from './ui/use-toast'
import { title } from 'process'

const CallList = ({ type }: { type: 'ended' | 'upcoming' | 'recordings' }) => {
  const { endedCalls, upcomingCalls, callRecordings, isLoading } = useGetCalls()
  const router = useRouter()
  const [recordings, setRecordings] = useState<CallRecording[]>([])
  const { toast } = useToast()

  const getCalls = () => {
    switch (type) {
      case 'ended':
        return endedCalls

      case 'recordings':
        return recordings

      case 'upcoming':
        return upcomingCalls

      default:
        return []
    }
  }

  const getNoCallsMsg = () => {
    switch (type) {
      case 'ended':
        return 'No Previous Calls'

      case 'recordings':
        return 'No Recordings'

      case 'upcoming':
        return 'No previous Calls'

      default:
        return ''
    }
  }

  useEffect(() => {
    const fetchRecordings = async () => {
      try {
        const callData = await Promise.all(
          callRecordings?.map((meeting) => meeting.queryRecordings()) ?? []
        )

        const recordings = callData
          .filter((call) => call.recordings.length > 0)
          .flatMap((call) => call.recordings)

        setRecordings(recordings)
      } catch (e) {
        toast({ title: 'Try again after some time' })
      }
    }

    if (type === 'recordings') {
      fetchRecordings()
    }
  }, [type, callRecordings])

  const calls = getCalls()

  const noCallsMsg = getNoCallsMsg()

  if (isLoading) return <Loaders />

  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
      {calls && calls.length > 0 ? (
        calls.map((meeting: Call | CallRecording) => (
          <MeetingCard
            key={(meeting as Call)?.id}
            icon={
              type === 'ended'
                ? '/icons/previous.svg'
                : type === 'upcoming'
                ? '/icons/upcoming.svg'
                : '/icons/recordings.svg'
            }
            title={
              (meeting as Call).state?.custom?.description?.substring(0, 26) ||
              meeting.filename?.substring(0, 25) ||
              'Personal Meeting '
            }
            date={
              meeting.state?.startsAt.toLocaleString() ||
              meeting.start_time?.toLocaleString()
            }
            isPreviousMeeting={type === 'ended'}
            buttonIcon1={type === 'recordings' ? '/icons/play.svg' : undefined}
            buttonText={type === 'recordings' ? 'Play' : 'Start'}
            handleClick={
              type === 'recordings'
                ? () => router.push(`${meeting.url}`)
                : () => router.push(`/meeting/${meeting.id}`)
            }
            link={
              type === 'recordings'
                ? meeting.url
                : `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${meeting.id}`
            }
          />
        ))
      ) : (
        <h1>{noCallsMsg}</h1>
      )}
    </div>
  )
}

export default CallList
