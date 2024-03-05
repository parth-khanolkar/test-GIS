"use client"

import React,{ useState,useEffect } from 'react'
import ReactModal from 'react-modal';
import axios from 'axios';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { useInfoContext } from '@/context/info';
import { useWatchlistContext } from '@/context/WatchlistContext';
import Select from 'react-select';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';

const CreateNewScModal = ({ isOpen, closeModal }) => {
    const { uid,setUid } = useInfoContext();
    const router = useRouter();

    const [isMobile, setIsMobile] = useState(false); // Track mobile state

    const [ isPublic,setIsPublic ] = useState(false);
    
    const [ scName,setScName ] = useState('');
    const [ scDescription,setScDescription ] = useState('');
    const [ tagOptions,setTagOptions ] = useState([]);
    const [ selectedTags,setSelectedTags ] = useState([]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setIsMobile(window.innerWidth <= 768);
        }
    }, []);
    const getModalStyle = () => {
        return {
            content: {
                height: isMobile ? '90%' : '83%',
                maxHeight: isMobile ? '90%' : '83%',
                width: isMobile ? '85%' : '60%',
                maxWidth: isMobile ? '100%' : '60%',
                margin: 'auto',
                backgroundColor: 'rgba(249, 249, 249, 1)',
            },
            overlay: {
              position: 'fixed',
              top: 0,
              left: isMobile ? -20:0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.75)',
              zIndex: 999,
            },
        };
    };

    const getTags = async () => {
        try {
            const response = await axios.get(`https://transcriptanalyser.com/screener/get_tags`);

            setTagOptions(response.data);

        } catch (error) {
            console.log("Error in getTags: ",error);
        }
    }
    useEffect(()=>{
        getTags();
    },[]);

    const closeCreateNewScModal = () => {

        closeModal();
    }

    const createNewScreener = async () => {
        try {
            const response = await axios.post(`https://transcriptanalyser.com/screener/create_sc`,{
                userid: uid,
                name: scName,
                description: scDescription,
                is_public: isPublic ? ("yes"):("no"),
                tag_ids: selectedTags.map((item)=>(item.tag_id))
            });

            toast.success('Screen Created', {
                position: "bottom-center",
                autoClose: 1500,
                hideProgressBar: true,
                closeOnClick: false,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
                theme: "light",
            });
            router.push(`/customScreener/${response.data.id}`);

        } catch (error) {
            console.log("Error in createNewScreener: ",error);
            toast.error('Error! Try again later.', {
                position: "bottom-center",
                autoClose: 1500,
                hideProgressBar: true,
                closeOnClick: false,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
                theme: "light",
            });
        }
    }

    
  return (
    <>
        <ReactModal
            isOpen={isOpen}
            onRequestClose={closeCreateNewScModal}
            contentLabel="Create New Sc Modal"
            style={getModalStyle()}
        >
            <form className='flex flex-col w-full h-full text-black'
                onSubmit={(e)=>{
                    e.preventDefault();
                    createNewScreener();
                }}
            >
                <div className='flex flex-row justify-between'>
                    <div className='text-2xl font-semibold '>
                        {"New Screen"}
                    </div>
                    <button className='flex items-center text-2xl'
                        onClick={closeCreateNewScModal}
                    >
                        <AiOutlineCloseCircle />
                    </button>
                </div>

                <div className='text-sm md:text-base mt-5 md:mt-10 md:items-center flex flex-col gap-4 lg:gap-0 lg:flex-row md:justify-between lg:mx-16'>
                    <div className='flex flex-col gap-0.5 w-full'>
                        <div className=''>
                            {"Screener Name"}
                        </div>
                        <input type="text" className='border lg:w-[30vw] p-1' required
                            maxLength={40}
                            value={scName}
                            onChange={(e)=>{setScName(e.target.value);}}
                        />
                    </div>
                    <div className='flex flex-row gap-3 ml-auto lg:ml-0'>
                        <div className=''>
                            {"Private"}
                        </div>
                        <label htmlFor='check' className='flex items-center bg-gray-200 cursor-pointer relative w-12 h-6 rounded-full'>
                            <input
                                type="checkbox"
                                id='check'
                                className='sr-only peer'
                                checked={isPublic}
                                onClick={() => { setIsPublic(prev => !prev) }}
                                onChange={() => {}}
                            />
                            <span className='w-2/5 h-4/5 bg-gray-500 absolute rounded-full left-1  peer-checked:bg-[#093967] peer-checked:left-6 transition-all duration-500' />
                        </label>
                        <div className=''>
                            {"Public"}
                        </div>
                    </div>
                </div>

                <div className='text-sm md:text-base mt-5 md:items-center flex flex-col gap-4 md:gap-0 md:flex-row md:justify-between lg:mx-16'>
                    <div className='flex flex-col gap-0.5 w-full'>
                        <div>
                            {"Screener Name"}
                        </div>
                        <textarea 
                            required
                            value={scDescription}
                            onChange={(e)=>{
                                setScDescription(e.target.value);
                            }}
                            maxLength={220}
                            className='w-full resize-none text-xs md:text-base h-[18vh] md:h-[15vh] p-2 border ' 
                            placeholder='A brief description of your stock screener ...'
                        />
                    </div>

                </div>

                <div className='text-sm md:text-base mt-5 flex flex-col gap-4 md:gap-0 md:flex-row md:justify-between lg:mx-16'>
                    <div className='flex flex-col gap-0.5 w-full'>
                        <div>
                            {"Screener Tags"}
                        </div>
                        <Select 
                            isMulti={true}
                            required={true}
                            value={selectedTags}
                            options={tagOptions}
                            getOptionLabel={(option) => option.name}
                            getOptionValue={(option) => option.tag_id}
                            onChange={(option)=>{
                                setSelectedTags(option);
                            }}
                            maxMenuHeight={150}
                            className='w-full'
                        />
                    </div>
                </div>

                <div className='mt-auto ml-auto'>
                    <button type='submit' className='px-5 py-1 bg-[#093967] text-white rounded-md'>
                        {"Create"}
                    </button>
                </div>


            </form>           
        </ReactModal>

    </>
  )
}

export default CreateNewScModal
