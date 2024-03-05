"use client"
import React from 'react'

const Loader = () => {
  return (
    <span className="relative flex h-16 w-16">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-900 opacity-75"></span>
    </span>
  )
}

export default Loader
