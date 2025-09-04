export const speak = (text) => {
  if ("speechSynthesis" in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 1; // speed
    utterance.pitch = 1; // tone
    window.speechSynthesis.speak(utterance);
  }
};
