import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import './App.css';

function App() {

  const [inputValue, setInputValue] = useState('');
  const [output, setOutput] = useState([]);
  const [files, setFiles] = useState([]);
  const [cards, setCards] = useState([]);
  const [flip, setFlips] = useState([]);
  const [carouselIndex, setCarouselIndex] = useState(0);

  const handleInput = (event) => {
    if (event.key === 'Enter' && inputValue !== '') {
      setOutput((prevOutputs) => [...prevOutputs, inputValue]);

      let data = '';
      files.forEach(file => {
        data += file[1];
      });

      fetch('http://localhost:5000/api/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', 
        },
        body: JSON.stringify({ 
          prompt : inputValue,
          content : data
        })
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

  const handleUpload = (event) => {
    if (event.target.files) {
      const files = Array.from(event.target.files).filter(file => file.type === "application/pdf");

      files.forEach(file => {
        const formData = new FormData();
        formData.append('pdf', file);

        fetch('http://localhost:5000/parse', {
          method: 'POST',
          body: formData
        })
        .then(res => res.json())
        .then(data => {
          const text = data.text.replace(/\n/g, ' ');
          setFiles((prevFiles) => [...prevFiles, [file.name, text]]);
          console.log(text);
        })
        .catch(err => console.error(err));
        });
    };
  };

  const handleRemove = (index) => {
    setFiles(curr => [...curr.slice(0, index), ...curr.slice(index + 1)]);
  }

  const generateCards = () => {
    if (files.length > 0) {

      const prompt = `Read the above text and extract key facts in the format:
      Label | Answer / Label | Answer / Label | Answer / ...
      Example: The primary colors | red, green, blue / Longest side of a right angle triangle | The hypotenuse
      Only output the flashcard pairs. No questions, no explanations, no extra text. Keep labels short.`;

      let data = '';
      files.forEach(file => {
        data += file[1];
      });
      fetch('http://localhost:5000/api/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', 
        },
        body: JSON.stringify({ 
          prompt : prompt,
          content : data
        })
      })
      .then(response => response.json())
      .then(data => {
        const rawData = data.message.content
        console.log("Response from backend:", rawData);
        const cardData = rawData.split("</think>")[1].replace(/^\s+/, '').split(" / ");
        const cardList = cardData.map(card => card.split(" | "));
        setCards(cardList);
        setFlips(Array(cardList.length).fill(false));
      })
      .catch(error => {
        console.error("Error calling backend:", error);
      });
    }
  }

  const handleFlip = (index) => {
    setFlips((prevFlips) => {
      const newFlips = [...prevFlips];
      newFlips[index] = !newFlips[index];
      return newFlips;
    });
  }

  const handleNext = () => setCarouselIndex(index => Math.min(index + 1, cards.length - 1));
  const handleBack = () => setCarouselIndex(index => Math.max(0, index - 1));

  return (
    <div className='flex w-full'>
      <div className='w-[32rem] h-[100vh] bg-[#1f1f1f] poppins'>
        <div className='text-center text-4xl pt-[4rem] pb-[0.2rem] font-medium text-violet-200'>
          Flash Cards
        </div>
        <div className='mx-auto max-w-[12rem] my-[3rem]'>
          <button onClick={generateCards} className='duration-200 hover:shadow-[0px_0px_30px] hover:shadow-violet-500/100 bg-gradient-to-br from-violet-700 to-violet-300 text-xl rounded-[1.5rem] w-full h-[4rem] text-white shadow-[0px_0px_30px] shadow-violet-500/60 ring-1 ring-violet-500'>
            Generate
          </button>
        </div>
        {cards.length === 0 ? null : 
          <div className='columns-3 flex items-center text-white mt-[10rem]'>
            <div onClick={handleBack} className='card-button'>
                <div className='mx-auto'>
                  &lt;
                </div>
              </div>
              {flip[carouselIndex] === false ? 
              <div onClick={() => handleFlip(carouselIndex)} className='card bg-gradient-to-br from-violet-800 to-violet-300 flex items-center'>
                <div className='mx-auto px-[1rem]'>
                  {cards[carouselIndex][0]}
                </div>
              </div>
               : 
               <div onClick={() => handleFlip(carouselIndex)} className='card bg-gradient-to-tl from-cyan-200 to-cyan-700 flex items-center'>
                <div className='mx-auto px-[1rem]'>
                  Answer:<br></br>{cards[carouselIndex][1]}
                </div>
              </div>}
            <div onClick={handleNext} className='card-button'>
              <div className='mx-auto'>
                &gt;
              </div>
            </div>
          </div>
        }
      </div>
      <div className='bg-[#212121] nunito-sans flex-1'>
        <div className="h-[90vh] pt-[1rem] w-full max-w text-[#f7f7f7] overflow-scroll text-lg custom-scroll overflow-x-hidden">
          <div className='mx-auto max-w-[40rem]'>
            {output.map((text, index) => (
              index % 2 === 0 ? 
                (<div key={index} className='max-w-[32rem] w-max shadow-[7px_6px_4px] shadow-violet-500/50 text-left py-[0.5rem] px-[1rem] bg-[#342d40] oveflow-wrap break-words rounded-tl-[1rem] rounded-tr-[1rem] rounded-br-[1rem] my-[2rem]'>{text}</div>)
                :
                <div key={index} className='mb-[6%] max-w-[50rem]'>
                  <ReactMarkdown key={index}>{text}</ReactMarkdown>
                </div>
              ))}
          </div>
        </div>
        <div className='max-w-[40rem] mx-auto max-w'>
          <input placeholder='Ask for some notes' className='shadow-[0_0_20px] shadow-violet-500/50 duration-150 text-lg text-white px-[1rem] outline-none ring-1 ring-violet-500 focus:ring-violet-700 w-full h-[5vh] mb-[3vh] bg-[#342d40] rounded-[1rem]' type="text" value={inputValue} onKeyDown={handleInput} onChange={(e) => setInputValue(e.target.value)}></input>
        </div>
      </div>
      <div className='w-[25rem] bg-[#1f1f1f] inset-shadow-lg inset-shadow-violet-200/50 nunito-sans'>
        <div className='text-center text-4xl pt-[4rem] pb-[0.2rem] poppins font-medium text-violet-200'>
          Upload PDFs
        </div>
        <div className='max-w-[16rem] mx-auto max-w'>
          <input type="file" className='w-full mt-[1.2rem] mb-[4rem] font-[500] bg-[#342d40] p-[1.2rem] rounded-[1.5rem] text-white shadow-[0px_0px_30px] shadow-violet-500/60 ring-1 ring-violet-500' multiple accept="application/pdf" onChange={handleUpload}/>
        </div>
        {files.map((file, index) => (
          <div key={file[0] + index} className='font-medium rounded-[1.2rem] flex h-max w-max max-w-[20rem] mx-[2rem] my-[1.5rem] text-[#dddddd] text-lg px-[1rem] py-[0.6rem] bg-[#342d40] hover:shadow-[0_0_10px] hover:shadow-violet-400/50 ring-1 ring-violet-500 duration-200'>
            <div className='inline-block oveflow-wrap w-max max-w-[90%] break-words'>{file[0]} </div>
            <button onClick={() => handleRemove(index)} className='inline-block pl-[1rem] pr-[0.5rem] font-mono text-xl font-bold align-middle text-violet-400 hover:text-red-300 duration-500'>x</button>
          </div>
        ))}
      </div>
    </div>
      
  );
}

export default App;
