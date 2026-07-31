import { useEffect, useRef } from 'react';

export default function VideoPlayer({ stream, muted = false, label = 'User' }) {
const videoRef = useRef(null);

useEffect(() => {
if (videoRef.current && stream) {
videoRef.current.srcObject = stream;
}
}, [stream]);

return ( <div className="relative w-full h-[320px] rounded-3xl overflow-hidden bg-[#111827]">
{stream ? ( <video
       ref={videoRef}
       autoPlay
       playsInline
       muted={muted}
       className="w-full h-full object-cover"
     />
) : ( <div className="w-full h-full flex items-center justify-center text-gray-400">
Camera loading... </div>
)}


  <div className="absolute bottom-3 left-3 bg-black/60 px-3 py-1 rounded-full text-sm text-white">
    {label}
  </div>
</div>


);
}
