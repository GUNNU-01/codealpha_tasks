import { Copy, Users, CheckCircle } from 'lucide-react';
import { useRoom } from '../context/RoomContext';
import { useState } from 'react';

export default function Topbar() {
const { roomId, participants, isHost } = useRoom();
const [copied, setCopied] = useState(false);

const inviteLink = `${window.location.origin}/?room=${roomId}`;

const copyInvite = async () => {
try {
await navigator.clipboard.writeText(inviteLink);
setCopied(true);

  setTimeout(() => {
    setCopied(false);
  }, 2000);
} catch (err) {
  console.error(err);
}


};

return ( <div className='h-16 border-b border-[#1E293B] bg-[#0F172A] px-6 flex items-center justify-between'>


  <div className='flex items-center gap-4'>
    <div>
      <div className='text-sm text-gray-400'>Meeting ID</div>
      <div className='font-semibold text-white'>
        {roomId || 'Not connected'}
      </div>
    </div>

    <div className='h-8 w-px bg-[#334155]'></div>

    <div className='flex items-center gap-2 text-green-400'>
      <CheckCircle size={18} />
      <span className='font-medium'>Live meeting</span>
    </div>
  </div>

  <div className='flex items-center gap-3'>

    <div className='flex items-center gap-2 bg-[#111827] px-3 py-2 rounded-xl'>
      <Users size={18} />
      <span>{participants.length} participants</span>
    </div>

    <button
      onClick={copyInvite}
      className='px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 transition flex items-center gap-2'
    >
      <Copy size={16} />
      {copied ? 'Copied!' : 'Copy invite link'}
    </button>

    {isHost && (
      <button
        onClick={copyInvite}
        className='px-4 py-2 rounded-xl bg-[#1E293B] hover:bg-[#334155] transition'
      >
        Invite
      </button>
    )}

  </div>
</div>


);
}
