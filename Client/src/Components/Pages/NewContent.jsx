
import React, { useState } from 'react';
import '../Design/NewContent.css';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid'; 
import  Alert from '../Pages/Alert';


const NewContent = () => {
  const [writeTopic, setWriteTopic] = useState('');
  const [streamingContent, setStreamingContent] = useState([]);
  const [targetedWords, setTargetedWords] = useState('');
  const [contentType, setContentType] = useState('');
  const [numberOfWords, setNumberOfWords] = useState('');
  const [creativity, setCreativity] = useState('');
  const [language, setLanguage] = useState('');
  const [variants, setVariants] = useState('');
  const [model, setModel] = useState('');
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  // //show alerts 
  // const [showAlert, setShowAlert] = useState(false); // State for showing the alert
  // const [alertMessage, setAlertMessage] = useState(''); // State for the alert message

  
  
  
  let newContent='';

  const handleGenerate = async (event) => {
    event.preventDefault();
    console.log("inside handle generate");

    try {
      const response = await fetch('http://localhost:9000/generate-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          writeTopic: writeTopic,
          targetedWords: targetedWords ? targetedWords.split(',').map(word => word.trim()) : [],
          contentType: contentType,
          numberOfWords: numberOfWords,
          creativity: creativity,
          language: language,
          variants: variants,
          model: model
        })
      });

      // Handle response


      const reader = response.body.getReader();
      let content = "";
      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          console.log('Stream finished');
          break;
        }

        content += new TextDecoder().decode(value);

       
        setStreamingContent(content);
        
      newContent= newContent + content;
    










      }

      setStreamingContent(newContent);

      console.log("after while loop");
       
     

     console.log("after new content");


    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };


  const handleSave = async () => {
    try {
      const uniqueId = uuidv4();
      const response = await axios.post('http://localhost:9000/save-content', {
        writeTopic,
        uniqueId,
        streamingContent: streamingContent
      });
      if (response.data.success) {
        // Show a success message or perform any other action
        console.log('Content saved successfully');

        // Your code to save data to the database

            // Show the success animation
            setShowSuccessAnimation(true);

            // Reset animation after a certain duration
            setTimeout(() => {
                setShowSuccessAnimation(false);
                const alertDiv = document.getElementById('alertDiv');
                if (alertDiv) {
                  alertDiv.scrollTop = alertDiv.scrollHeight;
                }
            }, 5000); 

            console.log("animation done")
      }


      //  // Show the alert
      //  setShowAlert(true);
      //  setAlertMessage('Content saved successfully'); // Set the alert message
 
      //  // Hide the alert after 3 seconds
      //  setTimeout(() => {
      //    setShowAlert(false);
      //  }, 10000);
    } catch (error) {
      console.error('Error saving content:', error);
      // Handle error, e.g., show an error message to the user
    }
  };

  const handleContentTypeChange = (value) => {
    setContentType(value);
    // Set default number of words based on content type
    switch (value) {
      case 'titles':
        setNumberOfWords('10');
        break;
      case 'outline':
        setNumberOfWords('20');
        break;
      case 'introduction':
        setNumberOfWords('20');
        break;
      case 'paragraph':
        setNumberOfWords('300');
        break;
      case 'conclusion':
        setNumberOfWords('500');
        break;
      default:
        setNumberOfWords('');
    }
  };

  return (
    <div className='new-content'>
      <section className='left-side'>
        <form onSubmit={handleGenerate}>
          <table className='form-table'>
            <tbody>
              <tr>
                <td style={{ color: 'red', fontFamily: 'verdana', fontWeight: 'bolder', border: '2px solid transparent' }}>Write Topic</td>
              </tr>
              <tr>
                <td>
                  <textarea
                    id='write-topic'
                    name='write-topic'
                    className='write-topic'
                    value={writeTopic}
                    onChange={(e) => setWriteTopic(e.target.value)}
                    placeholder='Write something'
                    cols={20}
                    rows={3}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <textarea
                    id='targeted-words'
                    value={targetedWords}
                    onChange={(e) => setTargetedWords(e.target.value)}
                    placeholder='targeted-words (comma separated)'
                    cols={50}
                    rows={2}
                    wrap='true'
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <select value={contentType} onChange={(e) => handleContentTypeChange(e.target.value)}>
                    <option value="content-type">Content-type</option>
                    <option value="titles">Titles</option>
                    <option value="outline">Outline (Subheadings)</option>
                    <option value="introduction">Introduction</option>
                    <option value="paragraph">Paragraph</option>
                    <option value="conclusion">Conclusion</option>
                  </select>
                </td>
              </tr>
              <tr>
                <td>
                  <input
                    id='no-of-words-lines'
                    value={numberOfWords}
                    onChange={(e) => setNumberOfWords(e.target.value)}
                    placeholder='No of Words'
                    type='number'
                    style={{ height: '45px', width: '70%' }}
                  // Disable input for number of words
                  />
                  <span>words</span>
                </td>
              </tr>
              <tr>
                <td>
                  <select name="creativity" value={creativity} onChange={(e) => setCreativity(e.target.value)}>
                    <option value="creativity">Creativity</option>
                    <option value="regular">Regular</option>
                    <option value="high">High</option>
                  </select>
                </td>
              </tr>
              <tr>
                <td>
                  <select name='language' value={language} onChange={(e) => setLanguage(e.target.value)}>
                    <option value="language">Language</option>
                    <option value="hindi">Hindi</option>
                    <option value="english">English</option>
                    <option value="french">French</option>
                  </select>
                </td>
              </tr>
              <tr>
                <td>
                  <input
                    type="number"
                    value={variants}
                    onChange={(e) => setVariants(parseInt(e.target.value))}
                    style={{ width: 'calc(100% - 50px)' }}
                    placeholder='Variants(number output default 1)'
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <button type='submit'>Generate</button>
                </td>
              </tr>
            </tbody>
          </table>
        </form>
      </section>

      <section className='right-side-section'>
      <div id='alertDiv'>
            {/* Your other content */}
            {showSuccessAnimation && <div className="success-animation">Data Saved Successfully!</div>}
        </div>
        <div className='model'>
          <select name="model" value={model} onChange={(e) => setModel(e.target.value)}>
            <option value="model">Model</option>
            <option value="gpt-4-turbo">gpt-4-turbo</option>
            <option value="gpt-4-turbo 2024-04-09">gpt-4-turbo 2024-04-09</option>
            <option value="gpt-4-0125-preview">gpt-4-0125-preview</option>
            <option value="gpt-4-1106-preview">gpt-4-1106-preview</option>
            <option value="gpt-4-0613">gpt-4-0613</option>
            <option value="gpt-4-32k-0613">gpt-4-32k-0613</option>
            <option value="gpt-3.5-turbo-0125">gpt-3.5-turbo-0125</option>
            <option value="gpt-3.5-turbo-1106">gpt-3.5-turbo-1106</option>
            <option value="gpt-3.5-turbo-instruct">gpt-3.5-turbo-instruct</option>
          </select>
        </div>
        <div 
          id='outputdiv'
          contentEditable="true"
          dangerouslySetInnerHTML={{ __html: streamingContent }}
        />
        
         
       
        <br />
        <div className="button-container">
          <button className='save' onClick={handleSave}>Save</button>
        </div>
        
      </section>

     
    </div>
  );
};

export default NewContent;
