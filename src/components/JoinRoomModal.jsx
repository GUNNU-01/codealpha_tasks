import { useState } from 'react';
import { useEffect } from 'react';
import { useRoom } from '../context/RoomContext';
import { Video, PlusCircle } from 'lucide-react';

export default function JoinRoomModal() {
    const { createMeeting, joinMeeting } = useRoom();

    const [room, setRoom] = useState('');
    const [name, setName] = useState('');

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const roomFromUrl = params.get('room');
        if (roomFromUrl) {
            setRoom(roomFromUrl);
        }
    }, []);

    const handleCreate = () => {
        if (!name.trim()) return;


        createMeeting(name.trim());


    };

    const handleJoin = () => {
        if (!room.trim() || !name.trim()) return;
        console.log('Joining room:', room, name);

        joinMeeting(room.trim(), name.trim());


    };

    return (<div className='fixed inset-0 bg-black/70 flex items-center justify-center z-50'> <div className='bg-[#0F172A] border border-[#1E293B] rounded-3xl p-8 w-[430px] text-white shadow-2xl'> <div className='flex items-center gap-3 mb-6'> <Video className='text-indigo-400' size={28} /> <h2 className='text-2xl font-semibold'>CollabSphere Meeting</h2> </div>


        <p className='text-gray-400 mb-6'>
            Create a new meeting instantly or join an existing collaboration room.
        </p>

        <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder='Your name'
            className='w-full mb-4 px-4 py-3 rounded-xl bg-[#111827] border border-[#334155] focus:border-indigo-500 outline-none'
        />

        <button
            onClick={handleCreate}
            className='w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 flex items-center justify-center gap-2 transition mb-6'
        >
            <PlusCircle size={18} />
            Create meeting
        </button>

        <div className='relative mb-6'>
            <div className='absolute inset-0 flex items-center'>
                <div className='w-full border-t border-[#334155]'></div>
            </div>
            <div className='relative flex justify-center'>
                <span className='bg-[#0F172A] px-3 text-gray-400 text-sm'>
                    OR
                </span>
            </div>
        </div>

        <input
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            placeholder='Enter room ID'
            className='w-full mb-4 px-4 py-3 rounded-xl bg-[#111827] border border-[#334155] focus:border-indigo-500 outline-none'
        />

        <button
            onClick={handleJoin}
            className='w-full py-3 rounded-xl bg-[#1E293B] hover:bg-[#334155] transition'
        >
            Join meeting
        </button>
    </div>
    </div>


    );
}
