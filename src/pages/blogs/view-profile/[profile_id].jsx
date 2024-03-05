"use client"

import React,{ useState,useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import axios from 'axios'

import Loader from '@/components/Blogs/Loader';

import { AiFillLinkedin, AiOutlineHome } from 'react-icons/ai'
import { CgProfile } from 'react-icons/cg'
import Moment from 'react-moment'


const Profile = () => {
// Fetching userId from the URL
  const router = useRouter();
  const profileId = router.query.profile_id;
    
  const [isLoading, setIsLoading] = useState(true);   

  const [userProfile,setUserProfile] = useState({});
  const [articleList,setArticleList] = useState([]);
  const [userProfession,setUserProfession] = useState("");
  const [userLinkedIn,setUserLinkedIn] = useState("");
  const [userBio,setUserBio] = useState("");

  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
  }

  useEffect(() => {
    const fetchData = async () => {
        if(profileId){
            try {
            const response = await axios.post('https://transcriptanalyser.com/gislanding/blog-profile', {
                user_id:profileId,
            });
            
            setUserProfile(response.data?.key);
            setUserProfession(response.data?.key.profession);
            setUserLinkedIn(response.data?.key.linkedin);
            setUserBio(response.data?.key.bio);
            setArticleList(response.data?.key.article_list)

            setIsLoading(false);

            } catch (error) {
            console.error(error);
            }
        }
    };
  
      fetchData();
  },[profileId])

  return (
    <>
    <div className='overflow-y-auto bg-stone-100 h-screen'>
    {isLoading ? (
      <div className='flex items-center mt-[10%] justify-center'>
        <Loader />
      </div>
    ):(
        <>
        <div className='flex flex-col font-sans h-screen bg-stone-100'>

            <div className='m-4 '>
                <div className='hidden md:flex text-red-700 md:text-xl font-semibold w-full'>
                    Account Details
                </div>

                <div className='bg-[#1d3b61] text-white -ml-4 w-screen md:hidden text-center py-1 border border-blue-950 mb-2'>
                    Account Details
                </div>

                <div className=' md:mx-72 flex flex-col'>
                    {/* Edit Button */}
                    <div className='w-full flex justify-end mb-1'>
                        <Link href={`/blogs`} className='mr-auto'>
                            <button className='px-0.5 md:px-1 font-semibold border border-stone-700 rounded flex flex-row hover:bg-gray-300'>
                                <div className='flex items-center md:mr-1'>
                                    <AiOutlineHome className='m-2 md:m-0'/>
                                </div>
                                <span className='hidden md:block'>Blog Home</span>
                            </button>
                        </Link>                                
                    </div>

                    {/* User Info */}
                    <div className='flex md:flex-row flex-col'>  
                        <div className='md:border md:border-stone-300 rounded-lg mr-1.5 md:mr-0 flex justify-center'>
                            <img src={userProfile?.photo} alt="User Profile" 
                                className='rounded-full object-cover h-32 w-32 p-1.5 border border-stone-500 md:border-none'
                            />
                        </div>
                        <div className='flex flex-col w-full my-2 md:my-0 md:mx-3 border border-stone-300 rounded-lg p-1 md:p-0 md:border-none'>
                            <div className='w-full  md:mt-2 text-2xl font-semibold capitalize'>
                                {userProfile?.name}
                                
                            </div>
                            <div className=' flex flex-row'>
                                <div className='flex items-center'>
                                    <CgProfile className='mx-1'/>
                                </div>
                                <div className='w-full'>{userProfession}</div>
                                
                            </div>
                            <div className='flex flex-row'>
                                <div className='flex items-center'>
                                    <AiFillLinkedin className='mx-1'/>
                                </div>

                                <a className='md:ml-0.5  text-sm text-blue-500 flex items-center' 
                                    href={userLinkedIn}
                                    target='blank'
                                >
                                    {userLinkedIn}
                                </a>
                            </div>
                        </div>
                    </div>
                    <span className='md:mt-2 md:mb-1 font-semibold'>
                        Bio: 
                    </span>
                    <div className='md:p-2 p-1 border border-stone-300 rounded-lg '>
                        <span className='text-justify'>
                            {userBio}
                        </span> 
                    </div>
                    
                    <hr className='border border-black my-3  md:-mx-10'/>
  
                    <div className='flex flex-row justify-between'>
                        <span className='underline underline-offset-2 font-semibold'>
                            Articles by <span className='capitalize'>{userProfile?.name}</span>:
                        </span>
                    </div>

                    {/* Mapping Articles */}
                        {articleList && articleList.length > 0 ? (<>
                            <div className='overflow-y-auto mt-3 border border-stone-300 px-2 max-h-60 md:max-h-64 rounded '>
                            {articleList?.map((item,index)=>(
                                <>
                                <div className='flex flex-row' key={index}>
                                    <Link href={`/blogs/Blog/${item?.article_id}`} className='w-full my-2 px-2 rounded-lg border border-gray-300 md:border-gray-400 hover:shadow-lg hover:bg-stone-200 shadow-md md:shadow-none' >
                                        <div className=''>
                                            <span className='font-semibold line-clamp-1'>
                                                {item?.title} 
                                            </span>
                                        </div>
                                        <div className='h-8 md:h-12'>
                                            <span className='text-xs text-justify line-clamp-2 md:line-clamp-3 mt-0.5 pr-1'>
                                                {item?.synopsis}
                                            </span>
                                        </div>
                                        <div>
                                            <span className='text-xs text-neutral-500'>
                                            {`${formatDate(item?.updated_datetime)} `}
                                            </span>
                                            <span className='text-xs text-neutral-500'>
                                                • <Moment fromNow>{item?.updated_datetime}</Moment>
                                            </span>
                                        </div>
                                    </Link>
                                </div>
                                </>
                                ))}
                            </div> 
                        </>
                        ):(
                            <>
                            {/* Info for 0 articles */}
                            <div className='bg-white text-center mt-3 rounded border border-black p-5'>
                                <span className='font-semibold text-sm md:text-base'>
                                <span className='capitalize'>{userProfile?.name}</span> {"has not published any articles yet. Check back later for updates!"}
                                </span>
                            </div>
                            </>
                        )}
                </div>
            
            </div>
        </div>
        </>
    )}
    </div>
    </>
  )
}

export default Profile
