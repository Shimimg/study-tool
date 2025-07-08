import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import './App.css';


function App() {

  const [inputValue, setInputValue] = useState('');
  const [output, setOutput] = useState([]);

  const handleInput = (event) => {
    if (event.key === 'Enter' && inputValue !== '') {
      setOutput((prevOutputs) => [...prevOutputs, inputValue]);
      fetch('http://localhost:5000/api/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', 
        },
        body: JSON.stringify({ prompt : inputValue }),
      })
      .then(response => response.json())
      .then(data => {
        const rawData = data.message.content
        setOutput((prevOutputs) => [...prevOutputs, rawData.split("</think>")[1]]);
        console.log("Response from backend:", data);
      })
      .catch(error => {
        console.error("Error calling backend:", error);
      });
      setInputValue('');
    }
  };

  return (
    <div>
      <div className="h-[80vh] overflow-scroll">
        {output.map((text, index) => (
          index % 2 === 0 ? 
            (<p key={index} className='text-left'>{text}</p>)
            :
            (<ReactMarkdown key={index}>{text}</ReactMarkdown>)
          ))}
      </div>
      <input type="text" value={inputValue} onKeyDown={handleInput} onChange={(e) => setInputValue(e.target.value)}></input>
    </div>
  );
}

export default App;
