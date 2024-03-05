'use client' 

import React from 'react'
import { useRouter } from "next/router";
import InterviewDetailModal from '@/components/News & Interviews/Interviews/InterviewDetailModal';

const InterviewDetail = () => {

    const router = useRouter();
    const { interviewId } = router.query;

  return (
    <>
      <InterviewDetailModal isOpen={true} interviewId={interviewId} />
    </>
  )
}

export default InterviewDetail
