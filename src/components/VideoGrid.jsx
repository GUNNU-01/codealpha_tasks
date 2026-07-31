import { useEffect, useRef } from 'react';
import { useMedia } from '../context/MediaContext';
import { useRoom } from '../context/RoomContext';
import { useWebRTC } from '../hooks/useWebRTC';

export default function VideoGrid() {
const { stream } = useMedia();
const { roomId, participants } = useRoom();

const localVideoRef = useRef(null);
const remoteVideoRef = useRef(null);

const { remoteStream } = useWebRTC(stream, roomId);

useEffect(() => {
if (localVideoRef.current && stream) {
localVideoRef.current.srcObject = stream;
}
}, [stream]);

useEffect(() => {
if (remoteVideoRef.current && remoteStream) {
remoteVideoRef.current.srcObject = remoteStream;
}
}, [remoteStream]);



return ( <div className='bg-[#0F172A] border border-[#1E293B] rounded-3xl p-5'> <div className='flex items-center justify-between mb-5'> <div> <h2 className='text-2xl font-semibold text-white'>
Live meeting </h2> <p className='text-sm text-gray-400'>
{participants.length} participants </p> </div> </div>


  <div className='grid grid-cols-2 gap-4'>
    <div className='relative rounded-3xl overflow-hidden bg-black aspect-video'>
      <video
        ref={localVideoRef}
        autoPlay
        playsInline
        muted
        className='w-full h-full object-cover'
      />

      <div className='absolute bottom-3 left-3 bg-black/70 px-3 py-1 rounded-full text-sm'>
        You
      </div>
    </div>

    <div className='relative rounded-3xl overflow-hidden bg-black aspect-video'>
      <video
        ref={remoteVideoRef}
        autoPlay
        playsInline
        className='w-full h-full object-cover'
      />

      {!remoteStream && (
        <div className='absolute inset-0 flex items-center justify-center text-gray-400'>
          Waiting for participant
        </div>
      )}

      {remoteStream && (
        <div className='absolute bottom-3 left-3 bg-black/70 px-3 py-1 rounded-full text-sm'>
          Participant
        </div>
      )}
    </div>
  </div>
</div>


);
}
