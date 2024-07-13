'use client'

import React, { useState } from 'react'
import ReactDatePicker from 'react-datepicker'

import { useRouter } from 'next/navigation'

import HomeCard from '@/components/HomeCard'
import MeetingModal from '@/components/MeetingModal'
import { useToast } from '@/components/ui/use-toast'
import { Textarea } from './ui/textarea'

import { useUser } from '@clerk/nextjs'

import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk'
import { Input } from './ui/input'

const MeetingTypeList = () => {
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useUser()
  const client = useStreamVideoClient()

  const [meetingState, setMeetingState] = useState<
    'isScheduleMeeting' | 'isJoiningMeeting' | 'isInstantMeeting' | undefined
  >()

  const [values, setValues] = useState({
    dateTime: new Date(),
    description: '',
    link: '',
  })

  const [callDetais, setCallDetais] = useState<Call>()

  const createMeeting = async () => {
    if (!client || !user) return

    try {
      if (!values.dateTime) {
        toast({ title: 'Please select a date and time' })
        return
      }

      const id = crypto.randomUUID()
      const call = client.call('default', id)

      if (!call) throw new Error('Failed to create Call')

      const startsAt =
        values.dateTime.toISOString() || new Date(Date.now()).toISOString()

      const description = values.description || 'Instant meeting'

      await call.getOrCreate({
        data: {
          starts_at: startsAt,
          custom: {
            description,
          },
        },
      })

      setCallDetais(call)

      if (!values.description) {
        router.push(`/meeting/${call.id}`)
      }

      toast({
        title: 'Meeting created',
      })
    } catch (e) {
      console.log(e)
      toast({
        title: 'Failed to create meeting',
      })
    }
  }

  const meetinglink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetais?.id}`

  return (
    <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
      <HomeCard
        iconUrl="/icons/add-meeting.svg"
        title="New Meeting"
        description="Start an instant meeting"
        className="bg-orange-1"
        handleClick={() => setMeetingState('isInstantMeeting')}
      />
      <HomeCard
        iconUrl="/icons/schedule.svg"
        title="Schedule Meeting"
        description="Plan your meeting"
        className="bg-blue-1"
        handleClick={() => setMeetingState('isScheduleMeeting')}
      />
      <HomeCard
        iconUrl="/icons/recordings.svg"
        title="View Recordings"
        description="check out your recordings"
        className="bg-purple-1"
        handleClick={() => router.push('/recordings')}
      />
      <HomeCard
        iconUrl="/icons/join-meeting.svg"
        title="Join Meeting"
        description="via invitation link"
        className="bg-yellow-1"
        handleClick={() => setMeetingState('isJoiningMeeting')}
      />

      {!callDetais ? (
        <MeetingModal
          isOpen={meetingState === 'isScheduleMeeting'}
          onClose={() => setMeetingState(undefined)}
          title="Creating Meeting"
          handleClick={createMeeting}
        >
          <div className="flex flex-col gap-2.5">
            <label className="text-base text-normal leading-[22px] text-sky-2">
              Add a description
            </label>
            <Textarea
              className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0"
              onChange={(e) => {
                setValues({ ...values, description: e.target.value })
              }}
            />
          </div>
          <div className="flex w-full flex-col gap-2.5">
            <label className="text-base text-normal leading-[22px] text-sky-2">
              Select date and time
            </label>

            {/* This requires a custom css file  */}
            <ReactDatePicker
              selected={values.dateTime}
              onChange={(date) => setValues({ ...values, dateTime: date! })}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              timeCaption="time"
              dateFormat="MMMM d, yyyy h:mm aa"
              className="w-full rounded bg-dark-3 p-2 focus:outline-none"
            />
          </div>
        </MeetingModal>
      ) : (
        <MeetingModal
          isOpen={meetingState === 'isScheduleMeeting'}
          onClose={() => setMeetingState(undefined)}
          title="Meeting Craeted"
          className="text-center"
          handleClick={() => {
            navigator.clipboard.writeText(meetinglink)
            toast({ title: 'Link Copied' })
          }}
          image="/icons/checked.svg"
          buttonIcon="/icons/copy.svg"
          buttonText="Copy meeting link"
        />
      )}

      <MeetingModal
        isOpen={meetingState === 'isInstantMeeting'}
        onClose={() => setMeetingState(undefined)}
        title="Start an Instant Meeting"
        className="text-center"
        buttonText="Start Meeting"
        handleClick={createMeeting}
      />

      <MeetingModal
        isOpen={meetingState === 'isJoiningMeeting'}
        onClose={() => setMeetingState(undefined)}
        title="Type the link here"
        className="text-center"
        buttonText="Join Meeting"
        handleClick={() => router.push(values.link)}
      >
        <Input
          placeholder="Meeting link"
          className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0"
          onChange={(e) => setValues({ ...values, link: e.target.value })}
        />
      </MeetingModal>
    </section>
  )
}

export default MeetingTypeList
