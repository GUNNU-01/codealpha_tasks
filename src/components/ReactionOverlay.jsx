import { useEffect, useState } from 'react';
import { socket } from '../socket';

export default function ReactionOverlay() {
const [reactions, setReactions] = useState([]);

useEffect(() => {
const handleReaction = (data) => {
const reaction = {
...data,
id: Date.now() + Math.random(),
left: Math.random() * 60 + 20,
};


  setReactions((prev) => [...prev, reaction]);

  setTimeout(() => {
    setReactions((prev) =>
      prev.filter((r) => r.id !== reaction.id)
    );
  }, 3000);
};

socket.on('receive-reaction', handleReaction);

return () => {
  socket.off('receive-reaction', handleReaction);
};


}, []);

return ( <div className='fixed inset-0 pointer-events-none z-[9999] overflow-hidden'>
{reactions.map((reaction) => (
<div
key={reaction.id}
className='absolute text-6xl'
style={{
left: `${reaction.left}%`,
bottom: '10%',
animation: 'floatUp 3s ease-out forwards',
}}
>
{reaction.emoji} </div>
))}


  <style>{`
    @keyframes floatUp {
      0% {
        transform: translateY(0) scale(0.8);
        opacity: 0;
      }
      20% {
        opacity: 1;
        transform: translateY(-20px) scale(1);
      }
      100% {
        transform: translateY(-250px) scale(1.2);
        opacity: 0;
      }
    }
  `}</style>
</div>


);
}
