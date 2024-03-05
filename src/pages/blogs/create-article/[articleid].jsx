"us client"

import React, { useState,useEffect, useRef, useMemo } from 'react';
import Select from 'react-select';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import axios from 'axios';

import Loader from '@/components/Blogs/Loader';
import DraftModal from '@/components/Blogs/CreateArticlePage/DraftModal';

import { AiFillCloseCircle } from 'react-icons/ai';
import TitleModal from '@/components/Blogs/CreateArticlePage/TitleModal';
import { useInfoContext } from '@/context/info';

const CreateArticle = ({  }) => {
  const { uid,setUid } = useInfoContext();

  // Fetching userId from the URL
    const router = useRouter();
    const aid = router.query.articleid;

    const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false });
    const editor = useRef(null);

    const [isLoading, setIsLoading] = useState(true);
    const [isGuidelineOpen, setIsGuidelineOpen] = useState(true);
    const [isDraftModalOpen,setIsDraftModalOpen] = useState(false);
    const [isTitleModalOpen,setIsTitleModalOpen] = useState(false);
    const [buttonEnable,setButtonEnable] = useState(false);

    const [blogData,setBlogData] = useState({});
    const [articleHTML, setArticleHTML] = useState('');
    const [synopsisData, setSynopsisData] = useState('');
    const [titleData, setTitleData] = useState('');
    const [savedTitleData, setSavedTitleData] = useState('');
    const [compFincode,setCompFincode] = useState(0);
    const [articleId, setArticleId] = useState(aid);
    
    const [articleStatus, setArticleStatus] = useState("");
    const [errorMessage, setErrorMessage] = useState('');   
    const [dropDownSelectedItem, setDropDownSelectedItem] = useState(null);
    
    const joditConfig = {
      zIndex: 0,
      readonly: false,
      activeButtonsInReadOnly: ["source", "fullsize", "print", "about"],
      toolbarButtonSize: "middle",
      theme: "default",
      enableDragAndDropFileToEditor: true,
      saveModeInCookie: false,
      spellcheck: true,
      editorCssClass: false,
      triggerChangeEvent: true,
      height: 550,
      direction: "ltr",
      language: "en",
      debugLanguage: false,
      i18n: "en",
      tabIndex: -1,
      toolbar: true,
      enter: "P",
      useSplitMode: false,
      imageDefaultWidth: 100,
      removeButtons: [
        "source",
        "about",
        "outdent",
        "indent",
        "video",
        "print",
        "superscript",
        "subscript",
        "file",
        "cut",
        "selectall",
        "colorPickerDefaultTab",
      ],
      disablePlugins: ["paste", "stat"],
      events: {},
      textIcons: false,
      uploader: {
        insertImageAsBase64URI: true,
      },
      placeholder: "",
      showXPathInStatusbar: false,
    };

    const handleFincode = (item) => {
      setDropDownSelectedItem(item);
      setButtonEnable(true)
      setCompFincode(item?.value ?(item?.value):(0));
    };

    const openDraftModal = () => {
      setIsDraftModalOpen(true);
    }

    const closeDraftModal = () => {
      setIsDraftModalOpen(false);
    };

    const closeTitleModal = () => {
      setIsTitleModalOpen(false);
    };
    
    const getTitleData = (title) => {
      setTitleData(title);
      setSavedTitleData(title);
    }

    const toggleGuidelines = () => {
      setIsGuidelineOpen((prev) => !prev)
    }

    const handleAutoSave = async (article_status,htmldata) => {
      setTitleData((prevTitleData) => prevTitleData.trim());
      setSavedTitleData(titleData.trim());

      if((articleStatus === "draft" || (titleData)) && articleId)
      {
        try {
          console.log("Article data in API CALL---> ",htmldata);

          const response = await axios.post('https://transcriptanalyser.com/gislanding/blog-store', {
            user_id:uid,
            article_id:articleId,
            title:titleData.trim(),
            synopsis:synopsisData,
            article_html:htmldata,
            article_status:article_status,
            comp_fincode:compFincode,
          });
          setArticleId(response.data.key)
        } catch (error) {
          console.error(error);
        }
      }
    }
    
    const handleSubmit = async (article_status) => {
      if(articleHTML.trim())  
      {
        try {
          const response = await axios.post('https://transcriptanalyser.com/gislanding/blog-store', {
            user_id:uid,
            article_id:aid,
            title:titleData,
            synopsis:synopsisData,
            article_html:articleHTML,
            article_status:article_status,
            comp_fincode:compFincode,
          });

          alert("Blog Published successfully!")
          router.push(`/blogs/profile`)

        } catch (error) {
          console.error(error);
        }
      }
      else {
        alert("Article Cannot be empty!");
      }
    }
    

    useEffect(() => {
      if(aid == 0){
        setIsTitleModalOpen(true);
      }
      else{
        setIsTitleModalOpen(false);
      }

      setArticleId(aid);
      const fetchData = async () => {
        if(uid && aid) {
        try {
          const response = await axios.post('https://transcriptanalyser.com/gislanding/blog-landing', {
            user_id:uid,
            article_id:aid,
          });
  
          setBlogData(response.data);
          setArticleHTML(response.data.article_html)
          setSynopsisData(response.data.synopsis)
          setTitleData(response.data.title)
          setSavedTitleData(response.data.title)
          setIsLoading(false);
          if(response.data.comp_fincode === 0)
          {
            setDropDownSelectedItem(null);
          } else {
          setDropDownSelectedItem({
            "label": response.data.comp_name,
            "value": response.data.comp_fincode,
          })}
          setArticleStatus(response.data.article_status);

        } catch (error) {
          console.error(error);
        }
      };
    }
      fetchData();
  
    }, [uid,aid])

    

  return (
    <>
    {isLoading ? (
      <div className='flex items-center mt-[70%] md:mt-[25%] justify-center'>
        <Loader />
      </div>
    ):(
    <>
      <div className='flex flex-row h-[calc(100vh-49px)] overflow-y-auto'>
      {/* Editor */}
        <div className={`${isGuidelineOpen ? 'md:w-2/3' : 'w-full'} bg-white overflow-y-auto relative`}>

          {/* Mobile View of Guidelines,Draft Articles and Profile Photo */}
          <div className='flex flex-row justify-between w-full md:hidden mt-5 ml-2'>
            <div className='flex flex-row justify-between space-x-2'>
              <Link href={`/blogs`} className='pt-2.5  underline underline-offset-2 text-cyan-900 text-xs '>
                Blog Home
              </Link>
              <button className='underline underline-offset-2 text-cyan-900 text-xs' onClick={toggleGuidelines}>
                Guidelines
              </button>
              <button className=' underline underline-offset-2 text-cyan-900 text-xs' 
                onClick={openDraftModal}
              >
                Draft Articles
              </button>
              <Link href={`/blogs/create-article/0`} className='pt-2.5  underline underline-offset-2 text-cyan-900 text-xs '>
                New Article
              </Link>
            </div>
            <button className='mb-1 mr-5' 
              onClick={()=>{router.push(`/blogs/profile`)}}
            >
              <img src={blogData?.profile_img} alt="Profile logo" className='h-8 w-8 md:h-12 md:w-12  border rounded-full object-cover '/>
            </button>
          </div>

          {/* DropDown and PC view of Guidelines,Draft articles and Profile */}
          <div className='flex flex-row mt-4 md:mt-0 p-0.5 md:p-8 w-full'>
            
            {/* PC View of Guidelines,Draft Articles and Profile Photo */}
            <div className='hidden md:flex md:flex-row  space-x-5  mr-10'>
              
              <button className='px-0.5 underline underline-offset-2 text-cyan-900 hover:text-cyan-600 text-lg'>
                <Link href={`/blogs`} >
                  Blog Home
                </Link>
              </button>
              
              <button className='px-0.5 underline underline-offset-2 text-cyan-900 hover:text-cyan-600 text-lg' 
                onClick={toggleGuidelines}
              >
                Guidelines
              </button>

              <button className='underline underline-offset-2 text-cyan-900 text-lg hover:text-cyan-600' 
                onClick={openDraftModal}
              >
                Draft Articles
              </button>

              <button className='px-0.5 underline underline-offset-2 text-cyan-900 hover:text-cyan-600 text-lg'>
                <Link href={`/blogs/create-article/0`}>
                  New Article
                </Link>
              </button>

            </div>
              <button className='px-2 ml-auto ' 
                onClick={()=>{router.push(`/blogs/profile`)}}
              >
                <img src={blogData?.profile_img} alt="Profile logo" className='h-12 w-12 hover:p-0.5 border border-stone-300 rounded-full object-cover shadow-md'/>
              </button>
          </div>
        <form
          onSubmit={(e) => {
            e.preventDefault(); 
            handleSubmit("publish");
          }}
        >
          {/* Publish Button */}  
          <div className='flex flex-row  md:mt-0 mx-1 md:mx-10'>  
            <div className='flex-col'>
            <div className='md:pt-1.5'>
                <Select
                  options={blogData?.comp_dropdown_list}
                  value={dropDownSelectedItem}
                  onChange={(values) => handleFincode(values)}
                  className='text-xs md:text-base w-44 md:w-64'
                  placeholder="Select company..."
                  isClearable={true}
                />
              
            </div>
            </div>      
            <div className='flex ml-auto mt-auto'>
                <button type='submit'
                  disabled={!buttonEnable}  
                  className={`rounded text-white px-4 py-1 md:mt-4 ${buttonEnable ? "bg-red-700 hover:bg-red-800" : "bg-gray-400 cursor-not-allowed"}`}
                >
                    {articleStatus === "publish" ? ("Republish"):("Publish")}
                  </button>
            </div>
          </div>
            

          {/* Editing Space */}
          <div className='flex flex-col mt-5 md:mt-3'>
            {/* Title Div */}
            <div className='flex flex-row mx-1 md:mx-10'>
              <span className='text-red-700'>*</span>
              <label htmlFor="synopsis" className=''>Title:</label> 
            </div>
            <div className='flex  justify-start pb-2 mx-1 md:mx-10'>
              <input type="text" placeholder='*Title' required
                className=' p-2 my-1 w-full text-2xl font-semibold border border-stone-300'
                value={titleData}
                onChange={(e) => {setTitleData(e.target.value); setButtonEnable(true); setErrorMessage("")}}
                maxLength={120}
                onBlur={(newContent) => {
                  if(newContent.target.value.trim())
                  {
                    handleAutoSave("draft",articleHTML);
                  }
                  else{
                    setTitleData(savedTitleData);
                    setErrorMessage('Title cannot be empty!');
                  }
                }}
              />
            </div>
            {errorMessage && (
                <>
                  <div className='text-xs md:text-sm text-red-600 mx-1 md:mx-10 -mt-2 md:-mt-3'>{errorMessage}</div>
                </>
            )}
            <hr className='border my-2 border-black mx-1 md:mx-9'/>
            {/* Synopsis Div */}
            <div className='px-1 md:px-10 '>
              <span className='text-red-700'>*</span>
              <label htmlFor="synopsis" className=''>Synopsis:</label> 
               <br />
              <input type="text" id='synopsis' required
                className='w-full p-1 text-sm border border-stone-300 my-1 md:my-2'
                value={synopsisData}
                placeholder='Synopsis is a brief summary of your blog'
                onChange={(e) => {setSynopsisData(e.target.value); setButtonEnable(true)}}
                maxLength={500}
                onBlur={newContent => {handleAutoSave("draft",articleHTML)}}
              />
            </div>

            {/* Jodit Editor */}
            <div className='px-1 md:px-10 '>
              <span className='text-red-700'>*</span>
              <label htmlFor="">Article:</label>
              <div className='my-1 md:my-2 break-words'>
                <JoditEditor
                  ref={editor}
                  value={articleHTML}
                  config={joditConfig}
                  tabIndex={1} 
                  onBlur={newContent => {
                    setArticleHTML(newContent); 
                    setButtonEnable(true);
                    handleAutoSave("draft",newContent);
                  }} 
                  />
              </div>
            </div>
          </div>

          </form>
            
        </div>

        {/* Guidelines Sidebar */}
        <div className={`${isGuidelineOpen ? 'w-10/12 md:w-1/3 ml-auto' : 'hidden'} bg-stone-200 overflow-y-auto absolute inset-0 md:static scrollbar-none`}>
          <div className='w-full flex justify-start mx-4'>
            <button className='pt-3 pr-3' onClick={toggleGuidelines}>
                <AiFillCloseCircle size={"1.5em"} />
            </button>
          </div>
          <div className='flex flex-col items-center'>
            <div className='px-5 md:px-10'>
              <div className='w-full text-center text-4xl'>
                <p className='font-sans'>
                  Guidelines
                </p>
              </div>

              {/* Mapping guideline array */}
              <div className='w-full mt-8 text-justify text-sm'>
                {blogData.guideline.map((item, index) => (
                  <div key={index}>
                    <p className='font-serif'>{item}</p>
                    <br />
                  </div>
                ))}
              </div>
            </div>

            {/* Note Div */}
            <div className='w-full bg-stone-300 px-10 mt-auto py-6'>
              <div className=''>
                  <p className='underline  underline-offset-2 font-serif'>Note:</p>
              </div>
              <div className='w-full mt-6 text-justify text-sm font-serif'>
                {blogData.guideline[0]}                  
              </div>
            </div>
          </div>
        </div>

      </div>
    </>
    )}
    <DraftModal isOpen={isDraftModalOpen} closeModal={closeDraftModal} uid={uid} />

    <TitleModal senData={getTitleData} isOpen={isTitleModalOpen} closeModal={closeTitleModal} uid={uid}/>
    
    </>
  )
}

export default CreateArticle

CreateArticle.requireAuth = true;
