"use client"
import React,{ useEffect, useState } from 'react'
import axios from 'axios';

// import Loader from './Loader';

const DetailedArticle = ({ article_detail }) => {
    

  return (<>
    <div className='flex rounded-md justify-center p-2 md:px-32 lg:px-80 text-justify break-words text-base md:text-sm lg:text-base'>
      <div dangerouslySetInnerHTML={{__html:article_detail?.Desciption}} />
    </div>
  </>)

  }

export default DetailedArticle
