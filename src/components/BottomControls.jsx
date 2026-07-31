import { useState } from 'react';
import {
Hand,
Mic,
MicOff,
Video,
VideoOff,
Monitor,
PhoneOff,
} from 'lucide-react';
import { socket } from '../socket';
import { useRoom } from '../context/RoomContext';
import { useMedia } from '../context/MediaContext';

export default function BottomControls() {
const {
isMuted,
isVideoOff,
isSharing,
toggleMute,
toggleVideo,
shareScreen,
} = useMedia();

const {
roomId,
userName,
isHost,
leaveMeeting,
} = useRoom();

const [handRaised, setHandRaised] = useState(false);

const toggleHand = () => {
const next = !handRaised;
setHandRaised(next);


socket.emit('raise-hand', {
  roomId,
  raised: next,
});


};

const sendReaction = (emoji) => {
socket.emit('send-reaction', {
roomId,
emoji,
name: userName,
});
};

const handleEndMeeting = () => {
if (isHost) {
const confirmEnd = window.confirm(
'End meeting for everyone?'
);


  if (!confirmEnd) return;

  socket.emit('end-meeting', { roomId });
  leaveMeeting();
} else {
  leaveMeeting();
}


};

return ( <div className='h-20 border-t border-[#1E293B] bg-[#0F172A]/95 backdrop-blur-md flex items-center justify-center gap-4 shadow-2xl'>


  <button
    onClick={toggleMute}
    className={`w-12 h-12 rounded-full flex items-center justify-center transition ${
      isMuted
        ? 'bg-red-600'
        : 'bg-[#1E293B] hover:bg-indigo-600'
    }`}
  >
    {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
  </button>

  <button
    onClick={toggleVideo}
    className={`w-12 h-12 rounded-full flex items-center justify-center transition ${
      isVideoOff
        ? 'bg-red-600'
        : 'bg-[#1E293B] hover:bg-indigo-600'
    }`}
  >
    {isVideoOff ? (
      <VideoOff size={20} />
    ) : (
      <Video size={20} />
    )}
  </button>

  <button
    onClick={shareScreen}
    className={`px-4 py-3 rounded-full flex items-center gap-2 transition ${
      isSharing
        ? 'bg-red-600 hover:bg-red-500'
        : 'bg-indigo-600 hover:bg-indigo-500'
    }`}
  >
    <Monitor size={18} />
    {isSharing ? 'Stop Sharing' : 'Share Screen'}
  </button>

  <button
    onClick={toggleHand}
    className={`px-4 py-3 rounded-full flex items-center gap-2 transition ${
      handRaised
        ? 'bg-yellow-500 text-black'
        : 'bg-[#1E293B] text-white hover:bg-[#334155]'
    }`}
  >
    <Hand size={18} />
    {handRaised ? 'Hand Raised' : 'Raise Hand'}
  </button>

  <div className='flex items-center gap-2 bg-[#111827] px-3 py-2 rounded-full'>
    <button onClick={() => sendReaction('👍')}>👍</button>
    <button onClick={() => sendReaction('❤️')}>❤️</button>
    <button onClick={() => sendReaction('😂')}>😂</button>
    <button onClick={() => sendReaction('🎉')}>🎉</button>
  </div>

  <button
    onClick={handleEndMeeting}
    className='px-5 py-3 rounded-full bg-red-600 hover:bg-red-500 transition flex items-center gap-2'
  >
    <PhoneOff size={18} />
    {isHost ? 'End Meeting' : 'Leave Meeting'}
  </button>

</div>


);
}
