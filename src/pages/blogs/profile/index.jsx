"use client"

import React,{ useState,useEffect } from 'react'
import Link from 'next/link'
import axios from 'axios'

import Loader from '@/components/Blogs/Loader';

import { AiFillLinkedin, AiOutlineHome } from 'react-icons/ai'
import { CgAdd, CgProfile } from 'react-icons/cg'
import Moment from 'react-moment'
import { RiDeleteBin5Fill } from 'react-icons/ri'
import { FaRegEdit } from 'react-icons/fa'
import { BsClipboard2CheckFill } from 'react-icons/bs'
import ConfirmationModal from '@/components/Blogs/ProfilePageComponents/ConfirmationModal'
import { TiCancel } from 'react-icons/ti'
import { useInfoContext } from '@/context/info';

const Profile = () => {
    const { uid,setUid } = useInfoContext();

    
  const [isLoading, setIsLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [reload, setReload] = useState(false);
  const [isConfirmationModalOpen,setIsConfirmationModalOpen] = useState(false);
   

  const [userProfile,setUserProfile] = useState({});
  const [articleList,setArticleList] = useState([]);
  const [userProfilePhoto,setUserProfilePhoto] = useState("");
  const [userProfession,setUserProfession] = useState("");
  const [userLinkedIn,setUserLinkedIn] = useState("");
  const [userBio,setUserBio] = useState("");
  const [articleId,setArticleId] = useState(0);

  const [image,setImage] =useState("");
  const [selectedFile,setSelectedFile] =useState(null);

  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
  }

  const saveChanges = async () => {
    try {
        const response = await axios.post('https://transcriptanalyser.com/gislanding/blog-profileadd', {
          user_id:uid,
          photo: image,
          bio: userBio,
          profession: userProfession,
          linkedin: userLinkedIn,
        });

        alert("Profile changes successful");
        setReload((prev)=>!prev);
        setIsEditMode((prev)=>!prev);
      } catch (error) {
        console.error(error);
      }
  }

  const closeModal = () => {
    setIsConfirmationModalOpen(false);
  };

  const toggleReload = () => {
    setReload((prev)=>!prev);
  }

  const handleDelete = (article_Id) => {
    setArticleId(article_Id);
    setIsConfirmationModalOpen(true);
  }

  const handleFileInput = (e) => {
    setSelectedFile(e.target.files[0]);
    handleUpload(e.target.files[0]);
  }

  const handleUpload = async (file) => {
        setImage('load');
        var form_data = new FormData();
        form_data.append('file', file, file.name);
        const headers={'Content-Type': file.type}
        await
        axios.post("https://transcriptanalyser.com/gislanding/uploadfile",form_data,headers)
        .then(data => {
            setImage(data['data']['link']);
        });
    }

  useEffect(() => {
    const fetchData = async () => {
        if(uid){
            try {
            const response = await axios.post('https://transcriptanalyser.com/gislanding/blog-profile', {
                user_id:uid,
            });
            
            setUserProfile(response.data?.key);
            setUserProfession(response.data?.key.profession);
            setUserLinkedIn(response.data?.key.linkedin);
            setUserBio(response.data?.key.bio);
            setUserProfilePhoto(response.data?.key.photo)
            setImage(response.data?.key.photo)
            setArticleList(response.data?.key.article_list)

            setIsLoading(false);

            } catch (error) {
            console.error(error);
            }
        }
    };
  
      fetchData();
  },[uid,isEditMode,reload])

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
                        
                            {isEditMode ? (
                                <div className='flex flex-row gap-2'>
                                    <button className='px-0.5 md:px-1 font-semibold border bg-green-500 hover:bg-green-600 border-black rounded flex flex-row' onClick={()=>{saveChanges()}}>
                                        <span className='hidden md:block'>Save Changes</span>
                                        <div className='flex items-center'>
                                            <BsClipboard2CheckFill className='md:ml-1 m-2 md:m-0'/>
                                        </div>
                                    </button>
                                    <button className='px-0.5 md:px-1 font-semibold border bg-gray-100 hover:bg-gray-300 border-black rounded flex flex-row' onClick={()=>{setIsEditMode((prev)=>!prev)}}>
                                        <span className='hidden md:block'>Cancel</span>
                                        <div className='flex items-center'>
                                            <TiCancel className='md:ml-1 m-2 md:m-0'/>
                                        </div>
                                    </button>
                                </div>
                            ):(
                                <>
                                    <Link href={`/blogs`} className='mr-auto'>
                                        <button className='px-0.5 md:px-1 font-semibold border border-stone-700 rounded flex flex-row hover:bg-gray-300'>
                                            <div className='flex items-center md:mr-1'>
                                                <AiOutlineHome className='m-2 md:m-0'/>
                                            </div>
                                            <span className='hidden md:block'>Blog Home</span>
                                        </button>
                                    </Link>

                                    <button className='px-0.5 md:px-1 font-semibold border border-stone-700 rounded flex flex-row hover:bg-gray-300' 
                                        onClick={()=>{setIsEditMode((prev)=>!prev)}}>
                                        <span className='hidden md:block'>Edit Profile</span> 
                                        <div className='flex items-center'>
                                            <FaRegEdit className='md:ml-1 m-2 md:m-0 fill-current'/>
                                        </div>
                                    </button>
                                </>
                            )}
                        
                    </div>


                    <div className='flex md:flex-row flex-col'>     
                        {/* User Info Edit*/}
                        {isEditMode ? (
                            // Edit Details
                            <>
                                <div className='border border-stone-300 rounded-lg'>
                                    <img src={image} alt="User Profile" className='border border-black h-32 w-32 p-1.5 m-1'/>
                                    <div className='mx-1.5'>
                                        <input type="file" onChange={handleFileInput}/>
                                    </div>
                                </div>
                                <div className='flex flex-col w-full mx-1 md:mx-3 '>
                                    <div className='w-full  md:mt-2 text-2xl font-semibold capitalize'>
                                        {userProfile?.name}
                                        
                                    </div>
                                    <div className='mt-2 flex flex-row'>
                                        <div className='flex items-center'>
                                            <CgProfile className='mx-1'/>
                                        </div>

                                        <input type="text" 
                                            value={userProfession} 
                                            onChange={(e)=>{setUserProfession(e.target.value)}}
                                            className='md:px-1 border border-stone-300 bg-stone-100 w-full'
                                        />
                                    </div>
                                    <div className='flex flex-row mt-2 '>
                                        <div className='flex items-center'>
                                            <AiFillLinkedin className='mx-1'/>
                                        </div>

                                        <input type="text" 
                                            value={userLinkedIn}
                                            onChange={(e)=>{setUserLinkedIn(e.target.value)}}
                                            className='md:px-1 border border-stone-300 bg-stone-100 w-full'
                                            maxLength={80}
                                        />
                                    </div>
                                </div>
                            
                            </>

                        ):(
                            // Display details
                            <>
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
                            </>
                        )}
                    </div>

                    {/* User Bio */}
                    { isEditMode ? (
                        <>
                            <span className='md:mt-2 md:mb-1'>
                                Bio: 
                            </span>
                            <div className='md:p-2 p-1 border border-stone-300 rounded-lg '>
                                <textarea type="text" 
                                    value={userBio}
                                    className='w-full bg-stone-100 md:px-1'
                                    onChange={(e)=>{setUserBio(e.target.value)}}
                                    rows="4"
                                    maxLength={300}
                                    //need to add h and w based on Bio Character Limit
                                />
                            </div>
                        </>
                    ):(
                        <>
                            <span className='md:mt-2 md:mb-1 font-semibold'>
                                Bio: 
                            </span>
                            <div className='md:p-2 p-1 border border-stone-300 rounded-lg '>
                                <span className='text-justify'>
                                    {userBio}
                                </span> 
                            </div>
                        </>
                    )

                    }
                    
                    <hr className='border border-black my-3  md:-mx-10'/>
                    <div className='flex flex-row justify-between'>
                        <span className='underline underline-offset-2 font-semibold'>
                            My Articles
                        </span>
                        <button >
                            <Link  href={`/blogs/create-article/0`} className='flex flex-row bg-blue-900 hover:bg-blue-950 p-1 rounded shadow-sm text-white'>
                            <span className='p-0.5 pr-1.5 text-xs '>
                                Write Article
                            </span>
                            <span className="text-white flex items-center ">
                                <CgAdd className="fill-current"/>
                            </span>
                            </Link>
                        </button>
                    </div>

                    {/* Mapping Articles */}
                        {articleList && articleList.length > 0 ? (<>
                            <div className='overflow-y-auto mt-3 border border-stone-300 px-2  md:max-h-60 rounded '>
                            {articleList?.map((item,index)=>(
                                <div className='flex flex-row md:mr-2 ' key={index}>
                                    <Link href={`/blogs/Blog/${item?.article_id}`} className='w-full my-2 px-1 rounded-l border-y border-l border-gray-400 hover:bg-stone-200' >
                                        <div className=''>
                                            <span className='font-semibold line-clamp-1'>
                                                {item?.title}
                                            </span>
                                        </div>
                                        <div>
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
                                    <Link href={`/blogs/create-article/${item?.article_id}`} className='flex items-center justify-center bg-blue-800 my-2  w-14 md:w-16 cursor-pointer   hover:bg-blue-900 border border-black '
                                    >
                                        <button className='text-white text-xl md:text-2xl' >
                                            <FaRegEdit />
                                        </button>
                                    </Link>
                                    <div 
                                        className='flex items-center justify-center bg-red-700 hover:bg-red-800 my-2 rounded-r w-14 md:w-16 cursor-pointer   border-y border-r border-black'
                                        onClick={()=>{handleDelete(item?.article_id)}}
                                    >
                                        <div className=' text-xl md:text-2xl text-white'>
                                            <RiDeleteBin5Fill />
                                        </div>
                                    </div>
                                </div>
                                
                                ))}
                            </div> 
                        </>
                        ):(
                            <>
                            {/* Info for 0 articles */}
                            <div className='bg-white text-center mt-3 rounded border border-black p-5'>
                                <span className='font-semibold text-sm md:text-base'>
                                    Reach 100,000+ Engaged Readers! Join our website,<br/> Where your articles make a difference. Boost your reputation, network with finance experts. Educate, inspire, and be part of our thriving community. Empower investors worldwide with your valuable insights!
                                </span>
                                <div className='mt-5'>
                                        <button>
                                            <Link href={`/blogs/create-article/0`} className='flex flex-row bg-red-700 p-1 rounded shadow-sm text-white cursor-pointer'>
                                                <span className='p-0.5 pr-1.5'>
                                                    Write Article
                                                </span>
                                                <span className="text-white flex items-center">
                                                    <CgAdd className="fill-current" />
                                                </span>
                                            </Link>
                                        </button>
                                    </div>
                            </div>
                            </>
                        )}
                    

                </div>
            
            </div>
        </div>
        </>
    )}
    </div>
    <ConfirmationModal isOpen={isConfirmationModalOpen} closeModal={closeModal} articleId={articleId} toggleReload={toggleReload}/>
    </>
  )
}

export default Profile

Profile.requireAuth = true;
