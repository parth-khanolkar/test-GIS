import React from 'react'
import ReactModal from 'react-modal';
import axios from 'axios';


const ConfirmationModal = ({ isOpen, closeModal,articleId,toggleReload }) => {

    const modalStyle = {
        content: {
            height: '25%',
            maxHeight: '50%', 
            width: '50%', 
            maxWidth: '50%', 
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
    
    const blogDelete = async () => {
        try {
            const response = await axios.post('https://transcriptanalyser.com/gislanding/blog-delete', {
                article_id: articleId,
            });
            closeModal();
            toggleReload();
          } catch (error) {
            console.error(error);
          }
      }

  return (
    <>
        <ReactModal
            isOpen={isOpen}
            onRequestClose={closeModal}
            style={modalStyle}
        >
            <div className='flex flex-col mt-5 md:m-5 items-center'>
                {/* <h1>Are you sure you want to delete this article?</h1> */}
                <div >
                    <h1 className='text-justify'>Are you sure you want to delete this article?</h1>
                </div>
                <div className='flex flex-row my-3 mt-5 justify-center'>
                    {/* <div className='mx-5 rounded text-white px-4 py-1 bg-red-700 hover:bg-red-900 cursor-pointer'> */}
                        <button
                            onClick={blogDelete}
                            className='mx-5 rounded text-white px-4 py-1 bg-red-700 hover:bg-red-900 cursor-pointer'
                        >Yes</button>
                    {/* </div> */}
                    {/* <div className='mx-5 rounded text-white px-4 py-1 bg-blue-900 hover:bg-blue-950 cursor-pointer'> */}
                        <button
                            onClick={closeModal}
                            className='mx-5 rounded text-white px-4 py-1 bg-blue-900 hover:bg-blue-950 cursor-pointer'
                        >No</button>
                    {/* </div> */}
                </div>
            </div>
          

        </ReactModal>
      
    </>
  )
}

export default ConfirmationModal
