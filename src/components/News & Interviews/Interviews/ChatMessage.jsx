'use client'

import React from 'react'
import { IoPerson } from 'react-icons/io5'
import { RiRobot2Fill } from 'react-icons/ri'

const ChatMessage = ({ message }) => {
  return (
    <>
      {
        message.inputBy === 'bot' ? (<>
            <div className='flex flex-row gap-2 justify-start mr-4 md:mr-16 lg:mr-20'>
                <div className='flex items-start justify-center'>
                    <div className='p-1 rounded-full bg-cyan-900 text-white'>
                        <RiRobot2Fill size={20}/>
                    </div>
                </div>
                <div className='p-1 border-2 border-gray-400 rounded-md text-justify text-xs md:text-base'>{message.message}</div>
            </div>
        </>):(<>
            <div className='flex flex-row gap-2 justify-end ml-4 md:ml-16 lg:ml-20'>
                <div className='p-1 border-2 border-gray-400 rounded-md text-justify text-xs md:text-base'>{message.message}</div>
                <div className='flex items-start justify-center '>
                    <div className='p-1 rounded-full bg-cyan-900 text-white'>
                        <IoPerson size={20}/>
                    </div>
                </div>
            </div>
        </>)
      }
    </>
  )
}

export default ChatMessage
