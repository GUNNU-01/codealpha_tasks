import { createContext, useContext, useEffect, useRef, useState } from 'react';

const MediaContext = createContext();

export function MediaProvider({ children }) {
const [stream, setStream] = useState(null);
const [isMuted, setIsMuted] = useState(false);
const [isVideoOff, setIsVideoOff] = useState(false);
const [isSharing, setIsSharing] = useState(false);
const [isRecording, setIsRecording] = useState(false);

const mediaRecorderRef = useRef(null);
const recordedChunksRef = useRef([]);

useEffect(() => {
startCamera();
}, []);

const startCamera = async () => {
try {
const mediaStream = await navigator.mediaDevices.getUserMedia({
video: true,
audio: true,
});


  setStream(mediaStream);
} catch (err) {
  console.error(err);
}


};

const toggleMute = () => {
if (!stream) return;


stream.getAudioTracks().forEach((track) => {
  track.enabled = !track.enabled;
});

setIsMuted(!isMuted);


};

const toggleVideo = () => {
if (!stream) return;


stream.getVideoTracks().forEach((track) => {
  track.enabled = !track.enabled;
});

setIsVideoOff(!isVideoOff);


};

const shareScreen = async () => {
if (isSharing && stream) {
stream.getTracks().forEach((track) => track.stop());
setIsSharing(false);
await startCamera();
return;
}


try {
  const screenStream = await navigator.mediaDevices.getDisplayMedia({
    video: true,
    audio: true,
  });

  setStream(screenStream);
  setIsSharing(true);

  screenStream.getVideoTracks()[0].onended = async () => {
    setIsSharing(false);
    await startCamera();
  };
} catch (err) {
  console.error(err);
}


};

const startRecording = async () => {
try {
const recordStream = stream || await navigator.mediaDevices.getDisplayMedia({
video: true,
audio: true,
});


  recordedChunksRef.current = [];

  const recorder = new MediaRecorder(recordStream);

  recorder.ondataavailable = (event) => {
    if (event.data.size > 0) {
      recordedChunksRef.current.push(event.data);
    }
  };

  recorder.onstop = () => {
    const blob = new Blob(recordedChunksRef.current, {
      type: 'video/webm',
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `CollabSphere-${Date.now()}.webm`;
    a.click();

    URL.revokeObjectURL(url);
  };

  recorder.start();

  mediaRecorderRef.current = recorder;
  setIsRecording(true);

  console.log('Recording started');
} catch (err) {
  console.error(err);
}


};

const stopRecording = () => {
if (mediaRecorderRef.current) {
mediaRecorderRef.current.stop();
setIsRecording(false);
console.log('Recording stopped');
}
};

return (
<MediaContext.Provider
value={{
stream,
isMuted,
isVideoOff,
isSharing,
isRecording,
toggleMute,
toggleVideo,
shareScreen,
startRecording,
stopRecording,
}}
>
{children}
</MediaContext.Provider>
);
}

export function useMedia() {
return useContext(MediaContext);
}
