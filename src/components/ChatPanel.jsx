import { useEffect, useRef, useState } from 'react';
import { socket } from '../socket';
import { useRoom } from '../context/RoomContext';

export default function ChatPanel() {
const { roomId, userName } = useRoom();

const [messages, setMessages] = useState([]);
const [input, setInput] = useState('');

const messagesEndRef = useRef(null);

useEffect(() => {
const handleMessage = (msg) => {
setMessages((prev) => [...prev, msg]);
};


socket.on('chat-message', handleMessage);

return () => {
  socket.off('chat-message', handleMessage);
};


}, []);

useEffect(() => {
messagesEndRef.current?.scrollIntoView({
behavior: 'smooth',
});
}, [messages]);

const sendMessage = () => {
if (!input.trim()) return;
if (!roomId) return;


socket.emit('chat-message', {
  roomId,
  message: input,
  name: userName,
});

setInput('');


};

return ( <div className='bg-[#0F172A] border border-[#1E293B] rounded-3xl p-5 text-white h-full flex flex-col'> <div className='flex items-center justify-between mb-4'> <h2 className='text-xl font-semibold'>Team Chat</h2> <span className='text-green-400 text-sm'>Live</span> </div>


  <div className='flex-1 overflow-y-auto space-y-3 mb-4'>
    {messages.length === 0 && (
      <div className='text-gray-400 text-sm'>
        No messages yet
      </div>
    )}

    {messages.map((msg) => (
      <div
        key={msg.id}
        className={`p-3 rounded-2xl ${
          msg.name === userName
            ? 'bg-indigo-600 ml-8'
            : 'bg-[#111827] mr-8'
        }`}
      >
        <div className='flex items-center justify-between mb-1'>
          <span className='font-semibold text-sm'>
            {msg.name}
          </span>

          <span className='text-xs text-gray-300'>
            {msg.time}
          </span>
        </div>

        <div className='text-sm'>
          {msg.message}
        </div>
      </div>
    ))}

    <div ref={messagesEndRef} />
  </div>

  <div className='flex gap-2'>
    <input
      value={input}
      onChange={(e) => setInput(e.target.value)}
      onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
      placeholder='Type a message...'
      className='flex-1 bg-[#111827] border border-[#1E293B] rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500'
    />

    <button
      onClick={sendMessage}
      className='bg-indigo-600 hover:bg-indigo-500 px-5 rounded-xl font-medium transition'
    >
      Send
    </button>
  </div>
</div>


);
}
