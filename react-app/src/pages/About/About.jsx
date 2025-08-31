import { useRef, useState } from "react";

export default function About() {


  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [audios, setAudios] = useState([]);

  let mediaRef;


  async function handleRecording() {


    if ( isRecording && mediaRef) {

      alert('recoding stop')
      setIsRecording(false)
      mediaRef.stop();
      return

    }

    // if (isRecording) {
    //   setIsRecording(false);
    //   mediaRecorder.stop();
    //   return;
    // }

    // Get audio stream
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    if (!window.MediaRecorder) {
      alert("MediaRecorder not supported on this browser");
      return;
    }

    // Create recorder
    const mimeType = MediaRecorder.isTypeSupported("audio/mp4")
      ? "audio/mp4"
      : "audio/webm";

    mediaRef = new MediaRecorder(stream, { mimeType });
    const chunks = [];

    // Collect data
    mediaRef.ondataavailable = e => chunks.push(e.data);

    mediaRef.onstop = () => {
      const audioBlob = new Blob(chunks, { type: 'audio/webm' });
      const url = URL.createObjectURL(audioBlob);
      console.log("Recording stopped. File ready:", url);

      setAudioUrl(url);
      setAudios(prev => [...prev, { id: new Date().toISOString(), url: url }]);

      // TODO: upload to server or store in IndexedDB
    };

    alert('Recording started...');
    setIsRecording(true);
    mediaRef.start();

  }




  // function handleRecording() {

  //   if (isRecording) {
  //     setIsRecording(false)
  //     mediaRecorder.stop();
  //     return
  //   }

  //   const MediaStream = navigator.mediaDevices.getUserMedia({ audio: true })
  //   const mediaRecorder = MediaRecorder(MediaStream);
  //   const chunks = [];


  //   mediaRecorder.ondataavailabel = e => chunks.push(e.data);
  //   mediaRecorder.onstop = () => {
  //     const audioBlob = new Blob(chunks, { type: 'audio/webm' })
  //     const url = URL.createObjectURL(audioBlob);
  //     setAudionUrl(url);
  //     console.log("recoding is stoped ");

  //     // todo: uplaod to server or store on indexDB
  //   }



  //   console.log('recording is start...');
  //   setIsRecording(true);
  //   mediaRecorder.start()

  // }



  // function handleRecording() {
  //   navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
  //     const mediaRecorder = new MediaRecorder(stream);
  //     const chunks = [];

  //   console.log('recording is started ..');

  //     mediaRecorder.ondataavailable = e => chunks.push(e.data);
  //     mediaRecorder.onstop = () => {
  //       const audioBlob = new Blob(chunks, { type: 'audio/webm' });
  //       const url= URL.createObjectURL(audioBlob);
  //       setAudionUrl(url);
  //       // Save to IndexedDB or upload to server
  //     };

  //     setIsRecording(true);
  //     mediaRecorder.start();


  //     setTimeout(() => {
  //       setIsRecording(false)
  //       mediaRecorder.stop()
  //       console.log('media rec is stop ')
  //     }, 5000); // record 5 sec
  //   });
  // }




  return (
    <div className="p-20 bg-green-300 h-full flex justify-center items-center">
      <div className="border rounded-2xl p-4 ">
        <div>
          <ul>
            {
              audios.map((audio) => {
                return <li className="mb-2"><audio key={audio.id} src={audio.url} controls></audio></li>
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
