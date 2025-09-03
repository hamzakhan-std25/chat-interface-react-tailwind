import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic,
  Square,
  Play,
  Pause,
  Send,
  X
} from "lucide-react"; // icons

import useSpeechSynthesis from "./useSpeechSynthesis";
import { FiSquare } from "react-icons/fi";


export default function VoiceRecorderModal({ isOpen, mode = "record", onClose, onSend, textToSpeech }) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);


  // use speechSynthesis with controls like stop start etc.
  const {
    speakText,
    pauseSpeaking,
    resumeSpeaking,
    stopSpeaking,
    isSpeaking,
    isPaused
  } = useSpeechSynthesis();



  // Start recording
  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    setMediaRecorder(recorder);
    setAudioChunks([]);

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        setAudioChunks((prev) => [...prev, e.data]);
      }
    };

    recorder.onstop = () => {
      const blob = new Blob(audioChunks, { type: "audio/webm" });
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
    };

    recorder.start();
    setIsRecording(true);
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  // Play/Pause audio
  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
  };

  // Handle playback end
  const handleEnded = () => setIsPlaying(false);

  // Send audio
  const sendAudio = () => {
    if (!audioChunks.length) return;
    const blob = new Blob(audioChunks, { type: "audio/webm" });
    onSend(blob); // pass blob back to parent
    handleClose();
  };

  // Close modal
  const handleClose = () => {
    setIsRecording(false);
    setAudioUrl(null);
    setAudioChunks([]);
    onClose();
  };

  // start text to speech 
  const startSpeech = () => {
    speakText(textToSpeech);
  }



  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 w-full max-w-md relative"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 15 }}
          >
            {/* Close button */}
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
              onClick={handleClose}
            >
              <X size={24} />
            </button>

            <h2 className="text-xl font-semibold text-center mb-4 text-gray-800 dark:text-gray-200">
              {mode === "record" ? "Record Voice" : "Speak Text"}
            </h2>

            <div className="flex flex-col items-center space-y-6">




              {/* SPEECH MODE */}
              {mode === "speech" && textToSpeech && (


                <div className="flex justify-center flex-col items-center">

                  {<>
                    <button
                      onClick={!isSpeaking ? startSpeech : (isPaused ? resumeSpeaking : pauseSpeaking)}
                      className={`w-20 h-20 rounded-full  flex items-center justify-center shadow-lg transition ${!isPaused ? "bg-green-500 hover:bg-green-600":"bg-blue-500 hover:bg-blue-600"} `}
                    >
                      {isPaused ? <Pause size={36} color="white" /> : <Play size={36} color="white" />}
                    </button>

                    <button
                      onClick={stopSpeaking}
                      className=" border rounded-2xl font-bold p-2 mt-2 bg-red-500 hover:bg-red-600 " >
                     Stop
                    </button> </>
                  }


                </div>
              )}




              {/* Recording / Play Controls */}

              {mode !== 'speech' &&
                <>
                  {(!audioUrl) ? (
                    <button
                      onClick={isRecording ? stopRecording : startRecording}
                      className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition ${isRecording
                        ? "bg-red-500 hover:bg-red-600 animate-pulse"
                        : "bg-blue-500 hover:bg-blue-600"
                        }`}
                    >
                      {isRecording ? <Square size={36} color="white" /> : <Mic size={36} color="white" />}
                    </button>
                  )
                    : (
                      <button
                        onClick={togglePlay}
                        className="w-20 h-20 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center shadow-lg transition"
                      >
                        {isPlaying ? <Pause size={36} color="white" /> : <Play size={36} color="white" />}
                      </button>

                    )}</>}

              {/* Audio Element */}
              {audioUrl && (
                <audio
                  ref={audioRef}
                  src={audioUrl}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onEnded={handleEnded}
                  hidden
                />
              )}

              {/* Action buttons */}
              {audioUrl && (
                <div className="flex space-x-4">
                  <button
                    onClick={() => setAudioUrl(null)}
                    className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 shadow"
                  >
                    Re-record
                  </button>
                  <button
                    onClick={sendAudio}
                    className="px-4 py-2 rounded-xl flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white shadow"
                  >
                    <Send size={18} />
                    <span>Send</span>
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

