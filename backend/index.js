const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');
const dotenv = require('dotenv');
const pdfParser = require('pdf-parse');
const fileUpload = require('express-fileupload');

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(fileUpload());

const openai = new OpenAI({
	baseURL: "https://router.huggingface.co/novita/v3/openai",
	apiKey: process.env.HF_TOKEN,
});

app.post("/api/ask", async (req, res) => {
    const { prompt, content } = req.body;

    try {
        const chatCompletion = await openai.chat.completions.create({
            model: "deepseek/deepseek-r1-turbo",
            messages: [
                {
                    role: "user",
                    content: content},
                {
                    role: "user",
                    content: prompt,
                },
            ],
        });
        res.json({message: chatCompletion.choices[0].message});
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong" });
    }
    
});

app.post('/parse', async (req, res) => {
    try {
        const pdfBuffer = req.files.pdf.data;
        const data = await pdfParser(pdfBuffer);
        res.send({ text: data.text})
    } catch (error) {
        console.error(error);
    }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});