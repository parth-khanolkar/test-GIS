"use client"

import React,{ useState,useEffect } from 'react'
import ReactModal from 'react-modal';
import axios from 'axios';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { CgAdd } from 'react-icons/cg';
import { useInfoContext } from '@/context/info';
import { HiRefresh } from 'react-icons/hi';
import { useWatchlistContext } from '@/context/WatchlistContext';
import Select from 'react-dropdown-select';
import { toast } from 'react-toastify';
import Downshift from 'downshift';

const EmailShareModal = ({ isModalOpen, closeModal }) => {
    const { uid,setUid } = useInfoContext();
    const { watchlist,setWatchlist } = useWatchlistContext();

    const [isMobile, setIsMobile] = useState(false); // Track mobile state
    const [ emailList,setEmailList ] = useState([]);
    const [ existingEmails,setExistingEmails ] = useState([]);

    const [ selectedEmail,setSelectedEmail ] = useState('');
    const [suggestions, setSuggestions] = useState([]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setIsMobile(window.innerWidth <= 768);
        }
    }, []);
    const getModalStyle = () => {
        return {
            content: {
                height: isMobile ? '45%' : '50%',
                maxHeight: isMobile ? '80%' : '40%',
                width: isMobile ? '80%' : '40%',
                maxWidth: isMobile ? '90%' : '50%',
                margin: 'auto',
            },
            overlay: {
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.75)',
              zIndex: 999,
            }, 
        };
    };

    const getEmailIdList = async () => {
        try {
            const response = await axios.post('https://transcriptanalyser.com/watchlists/user_email',{
                WatchListGroupId:watchlist.WatchListGroupId,
                UserId:uid
            });
            setEmailList(response.data.data);
            setExistingEmails(response.data.email_exist);
        } catch (error) {
            console.log("Error in getEmailIdList: ",error);
        }
    }
    useEffect(()=>{
        if(uid !== -1 && watchlist){
            getEmailIdList();
        }
    },[watchlist]);

    const shareWatchlist = async (emailParameter) => {
        if(existingEmails.some(email => email.EmailId === emailParameter)){
            toast.info(`${watchlist.WatchGroupName} already shared with ${emailParameter}`, {
                position: "bottom-center",
                autoClose: 2500,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                progress: undefined,
                theme: "light",
            });
        } else {
            try {
                const response = await axios.post('https://transcriptanalyser.com/watchlists/share_watchlist',{
                    WatchListGroupId: watchlist.WatchListGroupId,
                    UserId: uid,
                    EmailId: emailParameter
                });
                
                if(response.data.data === 'success') {
                    toast.success(`${watchlist.WatchGroupName} shared with ${emailParameter}`, {
                        position: "bottom-center",
                        autoClose: 2500,
                        hideProgressBar: true,
                        closeOnClick: true,
                        pauseOnHover: true,
                        progress: undefined,
                        theme: "light",
                    });
                }
            } catch (error) {
                console.log("Error in shareWatchlist:",error);
            }
        }
        
    }


  return (
    <>
        <ReactModal
            isOpen={isModalOpen}
            onRequestClose={closeModal}
            contentLabel="Example Modal"
            style={getModalStyle()}
        >
            <div className='flex flex-col '>
                <div className='flex flex-row justify-between border-b border-gray-300'>
                    <div className='flex flex-row gap-3 md:gap-4 lg:gap-5'>
                        <div className='text-rose-600 text-2xl font-semibold '>
                            SHARE WATCHLIST
                        </div>
                    </div>
                    
                    <button className='flex items-center text-2xl'
                        onClick={closeModal}
                    >
                        <AiOutlineCloseCircle />
                    </button>
                </div>

                <div className='h-full mt-5 flex flex-col mx-5 gap-3'>
                    {/* <div className=''>
                        Share watchlist <span className='font-semibold'>{`"${watchlist.WatchGroupName}"`}</span> with:
                    </div>
                    <div className=''>
                        <Select 
                            options={emailList} 
                            labelField="EmailId" 
                            valueField="UserId"
                            onChange={(option)=>{
                                setSelectedEmail(option[0]);
                            }}
                            searchable={true}
                            searchBy='EmailId'
                            maxHeight={5}
                        />
                    </div> */}
                        <Downshift
                            onChange={(selection) =>{
                                shareWatchlist(selection.EmailId);
                                console.log(selection);
                            }}
                            itemToString={(item) => (item ? item.EmailId : '')}
                            onInputValueChange={(input)=>{
                                setSelectedEmail(input);
                            }}
                        >
                            {({
                                getInputProps,
                                getItemProps,
                                getMenuProps,
                                getLabelProps,
                                // getToggleButtonProps,
                                inputValue,
                                highlightedIndex,
                                selectedItem,
                                isOpen,
                            }) => (
                            <div className='flex flex-col gap-2' >
                                <label {...getLabelProps()}>{"Share watchlist "}<span className='font-semibold'>{`"${watchlist.WatchGroupName}"`}</span>{" with: "}</label>
                                <input {...getInputProps()} className='p-1 border border-black rounded-md' />
                                {/* <button {...getToggleButtonProps()} aria-label={'toggle menu'}>
                                &#8595;
                                </button> */}
                                <ul {...getMenuProps()} className='z-50 overflow-y-auto max-h-[15vh]'>
                                {isOpen &&
                                    emailList
                                    .filter((email) => !inputValue || email.EmailId.includes(inputValue))
                                    .map((item, index) => (<>
                                        {
                                            index < 6 ? (<>
                                                <li
                                            {...getItemProps({
                                                key: `${item.EmailId}${index}`,
                                                item,
                                                index,
                                            })}
                                            className={`my-0.5 px-0.5 border-b border-x
                                                ${
                                                    highlightedIndex === index ? 'bg-blue-500 text-white' : ''
                                                }
                                            `}
                                            >
                                            {item.EmailId}
                                            </li>
                                            </>):(<></>)
                                        }
                                    </>))}
                                </ul>
                            </div>
                            )}
                        </Downshift>
                </div>
                <div className='flex items-center justify-center mt-16'>
                    <button className='px-2.5 py-1 rounded-md bg-rose-600 text-white'
                        disabled={selectedEmail.length > 0 ? (true) : (false)}
                        onClick={()=>{shareWatchlist(selectedEmail)}}
                    >
                        Share
                    </button>
                </div>

            </div>
        </ReactModal>
      
    </>
  )
}

export default EmailShareModal
