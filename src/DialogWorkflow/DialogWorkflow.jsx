import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './DialogWorkflow.css';

const ASKING_FOR_MESSAGE = 'Please type your message...';

const DialogWorkflow = () => {
  const [text, setText] = useState('');
  const [sendLoader, setSendLoader] = useState(false);
  const [receiveLoader, setReceiveLoader] = useState(false);
  const [getMessages, setGetMessages] = useState([]);
  const [history, setHistory] = useState([]);
  const dialogContainerRef = useRef(null);

  const generateAnswer = async () => {
    setReceiveLoader(true);
    try {
      const response = await axios({
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${
          import.meta.env.VITE_API_GENERATIVE_LANGUAGE_CLIENT
        }`,
        method: 'post',
        data: {
          contents: [{ parts: [{ text }] }],
        },
      });

      const generatedMessage = response.data.candidates[0].content.parts[0].text;
      setGetMessages((prevMessages) => [
        ...prevMessages,
        { type: 'receive', message: generatedMessage },
      ]);
    } catch (error) {
      console.error(error);
      setGetMessages((prevMessages) => [
        ...prevMessages,
        { type: 'receive', message: 'Error generating answer.' },
      ]);
    } finally {
      setReceiveLoader(false);
    }
  };

  const sendButtonPressed = async () => {
    try {
      setSendLoader(true);
      // Save sent message
      setGetMessages((prevMessages) => [
        ...prevMessages,
        { type: 'send', message: text },
      ]);
      // Clear input
      setText('');
      // Get the generated response from the Google API
      await generateAnswer();
    } catch (error) {
      console.error('Error in sendButtonPressed:', error);
    } finally {
      setSendLoader(false);
    }
  };

  const handleChange = (event) => {
    const textarea = event.target;
    setText(textarea.value);
    adjustTextareaHeight(textarea);
  };

  const adjustTextareaHeight = (textarea) => {
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight - 30}px`;
  };

  useEffect(() => {
    if (dialogContainerRef.current) {
      dialogContainerRef.current.scrollTop = dialogContainerRef.current.scrollHeight;
    }
  }, [getMessages]);

  return (
    <div id='dialog-workflow'>
      <h1>Echo AI</h1>
      <div className='chat-container'>
        <div className='dialog-container' ref={dialogContainerRef}>
          <div className='circlez-container'>
            {history.map((result, index) => (
              <p key={index}>{result.message}</p>
            ))}
          </div>
          <div className='user-container'>
            {getMessages.map((result, index) => (
              <p key={index}>
                <strong>{result.type === 'send' ? 'You' : 'AI'}:</strong> {result.message}
              </p>
            ))}
            {sendLoader && <p>Sending message...</p>}
            {receiveLoader && <p>Receiving response...</p>}
          </div>
        </div>
        <div className='prompt-container'>
          <textarea
            id='text-input'
            placeholder={ASKING_FOR_MESSAGE}
            value={text}
            onChange={handleChange}
            rows={1}
          />
          <button id='send-btn' onClick={sendButtonPressed} disabled={sendLoader || receiveLoader}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default DialogWorkflow;
