# AI Study Tool

## Features

- Has a regular AI Chat function
- Allows users to upload PDF documents in which the AI will consider in their conversations
- Creates flashcards for the user from the data read via the uploaded documents

## Tech Stack
- Javascript
- Tailwind CSS
- React
- OpenAI API
- Node.js + Express (backend)

## Installation

1. Clone the repository
2. Go into the frontend and backend folders and run `npm install` in each
```
cd ../frontend
npm install

cd ../backend
npm install
```
3. You'll need a Hugging Face Token (Read Token) to use the AI model, paste it into the .env file
```
backend/.env

HF_TOKEN = Paste it here
PORT = 5000
```
4. Go into the backend folder and run `node index.js`
```
cd ../backend
node index.js
```
5. Go into the frontend folder and run `npm start` (In a separate terminal/console)
```
cd ../frontend
npm start
```
## Usage

Upload any PDF(s) with text in it. Feel free to use the sample document which consists of an AI generated summary of WW1.

Talk to the AI, ask for it to make you some notes, or ask it some questions about the document.

Click the **Generate** button for flash cards.

### Please note: The conversations and flash card creation will take moderate time to process as I am using a free model from Hugging Face
<img width="1919" height="937" alt="image" src="https://github.com/user-attachments/assets/5d0146a1-3c7c-429c-84a1-ae08f826fc20" />

## Licenses
This project uses the **DeepSeek‑R1** model from [Hugging Face](https://huggingface.co/deepseek-ai/DeepSeek-R1), which is licensed under the **MIT License**.
