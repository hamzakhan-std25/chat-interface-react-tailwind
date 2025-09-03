import { useRef, useState } from "react";
import formateTime from "../../utils/formateTime"

export default function About() {


  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [audios, setAudios] = useState([]);
  let chunks = [];

  const mediaRef = useRef(null);










  const funCheck = async () => {
    try {

      console.log('vice stop and ploadiing......')

      const blob = new Blob(chunks, { type: 'audio/webm' });
      // const file = new File([blob], "voice.webm", { type: "audio/webm" });



      const url = URL.createObjectURL(blob);
      setAudios(prev => [...prev, { id: new Date().toISOString(), url: url }]);






      // const res = await fetch("http://localhost:8080/upload/transcribe", {
      //   method: "POST",
      //   body: formData,
      // });



      const arrayBuffer = await blob.arrayBuffer();

      console.log('arrayBuffer :', arrayBuffer);


      await fetch("http://localhost:8080/upload/transcribe", {
        method: "POST",
        body: arrayBuffer,
        headers: {
          "Content-Type": "application/octet-stream"
        }
      })
        .then(res => res.json())
        .then(data => {
          console.log("Transcript:", data.text);
        });
    }
    catch (error) {
      console.log('error: ', error)
    }

    // const formData = new FormData();
    // formData.append("audio", audioBlob, "voice.webm");

    // Upload to backend
    // const res = await fetch("http://localhost:8080/upload", {
    //   method: "POST",
    //   body: formData
    // });

    // const data = await res.json();
    // console.log("Cloudinary URL:", data.url)
    // setAudios( prev => [...prev, {id :  new Date().toISOString(), url: data.url}])

    // console.log("Recording stopped. File ready:", url);

    // setAudioUrl(url);
    // console.log("Audions : ",audios)

    // // TODO: upload to server or store in IndexedDB
  };





  //  const uploadAudio = async (chunks) => {
  //   const audioBlob = new Blob(chunks, { type: "audio/webm" });
  //   const formData = new FormData();
  //   formData.append("audio", audioBlob, "voice.webm");

  //   // Upload to backend
  //   const res = await fetch("http://localhost:4000/upload", {
  //     method: "POST",
  //     body: formData
  //   });

  //   const data = await res.json();
  //   console.log("Cloudinary URL:", data.url);

  //   // Play uploaded audio
  //   document.getElementById("player").src = data.url;

  //   // Download link
  //   const link = document.createElement("a");
  //   link.href = data.url;
  //   link.download = "voice.webm";
  //   link.textContent = "⬇ Download Audio";
  //   document.body.appendChild(link);
  // };



  async function handleRecording() {
    if (isRecording) {
      setIsRecording(false);
      if (mediaRef.current && mediaRef.current.state !== "inactive") {
        mediaRef.current.stop();
      }
      return;
    }


    // Get audio stream
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    // Create recorder
    const mimeType = MediaRecorder.isTypeSupported("audio/mp4")
      ? "audio/mp4"
      : "audio/webm";

    mediaRef.current = new MediaRecorder(stream, { mimeType });

    // Collect data
    mediaRef.current.ondataavailable = e => chunks.push(e.data);

    mediaRef.current.onstop = funCheck;

    console.log('Recording started...');
    setIsRecording(true);
    mediaRef.current.start();

  }


  return (
    <div className="p-20 bg-green-300 h-full flex justify-center items-center">
      <div className="border rounded-2xl p-4 ">
        <div>
          <ul>
            {
              audios.map((audio) => {
                return <li className="mb-2"><div>
                  <span>{formateTime(audio.id)}</span>
                  <audio key={audio.id} src={audio.url} controls></audio>
                </div></li>
              })
            }
          </ul>
        </div>
        <button onClick={handleRecording}
          className="p-4 border rounded-2xl mt-4 bg-amber-200 cursor-pointer hover:bg-amber-500 ">{!isRecording ? 'start' : 'stop'}</button>
      </div>
    </div>
  )


}



