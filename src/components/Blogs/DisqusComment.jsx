"use client"

// import React,{ useState, useEffect } from 'react'
// import { DiscussionEmbed } from 'disqus-react';

// const DisqusComment = ({ note_type,note_id }) => {

//     const [typeOfNote, setTypeOfNote] = useState("NewsDetailStock");

   


//   return (
//     <div className='bg-white p-2 rounded-lg'>
//      <DiscussionEmbed
//         shortname='example'
//         config={
//             {
//                 url: `http://goindiastocks.com/GIA/${typeOfNote}/${note_id}`,
//                 identifier: `/${typeOfNote}/${note_id}`,
//             }
//         }
//         /> 
//     </div>
//   )
// }

// export default DisqusComment

// Article/150

// Article/147

import React, { useEffect,useState } from 'react';

const DisqusComment = ({ note_type,note_id }) => {

    const [typeOfNote, setTypeOfNote] = useState("NewsDetailStock");

    useEffect(() => {
        if(note_type === "Article")
        {
            setTypeOfNote("GeneralNotesDetail")
        }
        else if(note_type === "Blog")
        {
            setTypeOfNote("Blog")
        }
        else
        {
            setTypeOfNote('NewsDetailStock')
        }
    },[note_type])

    
    useEffect(() => {
        const script = document.createElement('script');
        script.innerHTML = `
        var disqus_config = function () {
            this.page.url = 'http://goindiastocks.com/GIA/${typeOfNote}/'+${note_id};  // Replace PAGE_URL with your page's canonical URL variable
            this.page.identifier = '/${typeOfNote}/'+${note_id}; // Replace PAGE_IDENTIFIER with your page's unique identifier variable
        };
        
        (function() { // DON'T EDIT BELOW THIS LINE
            var d = document, s = d.createElement('script');
            s.src = 'https://goindiastocks-com.disqus.com/embed.js';
            s.setAttribute('data-timestamp', +new Date());
            (d.head || d.body).appendChild(s);
        })();
        `;
        document.body.appendChild(script);

        return () => {
        document.body.removeChild(script);
        };
    }, [note_type]);

    return (
        <div className='bg-stone-100 md:bg-white p-4 md:p-8'>
        <div id="disqus_thread"></div>
        </div>
    );
};

export default DisqusComment;

