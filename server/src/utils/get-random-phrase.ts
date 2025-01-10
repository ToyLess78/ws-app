

const commonChatPhrases = [
  "Hi, how are you?",
  "What's up?",
  "Got it!",
  "No problem.",
  "Take care!",
  "See you later.",
  "Thanks a lot!",
  "You're welcome.",
  "Good morning!",
  "Good night!",
  "Sounds good.",
  "What do you think?",
  "Let me know.",
  "Talk to you soon.",
  "Absolutely!",
  "I agree.",
  "How's it going?",
  "I'm on my way.",
  "Can you help me?",
  "Let's do it!"
];
export const getRandomPhrase = () => {
  const randomIndex = Math.floor(Math.random() * commonChatPhrases.length);
  return commonChatPhrases[randomIndex];
};

