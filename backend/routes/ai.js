const express = require('express');
const OpenAI = require('openai');

const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a message',
      });
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are EduMate AI, a friendly and helpful study assistant for college students. Explain concepts clearly and simply, help with studying, summarize notes, generate quizzes, and provide study advice.',
        },
        {
          role: 'user',
          content: message,
        },
      ],
    });

    res.json({
      success: true,
      reply: response.choices[0].message.content,
    });
  } catch (error) {
    console.error('AI Error:', error.message);

    res.status(500).json({
      success: false,
      message: 'Sorry, EduMate AI could not respond. Please try again.',
    });
  }
});

module.exports = router;