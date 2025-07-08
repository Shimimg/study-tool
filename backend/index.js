import express from 'express';
import cors from 'cors';
import { OpenAI } from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
	baseURL: "https://router.huggingface.co/novita/v3/openai",
	apiKey: process.env.HF_TOKEN,
});

app.post("/api/ask", async (req, res) => {
    const { prompt } = req.body;

    try {
        const chatCompletion = await openai.chat.completions.create({
            model: "deepseek/deepseek-r1-turbo",
            messages: [
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

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});