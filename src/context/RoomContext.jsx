import { createContext, useContext, useEffect, useState } from 'react';
import { socket } from '../socket';

const RoomContext = createContext();

export function RoomProvider({ children }) {
const [roomId, setRoomId] = useState('');
const [userName, setUserName] = useState('');
const [participants, setParticipants] = useState([]);
const [isHost, setIsHost] = useState(false);

const generateRoomId = () => {
return Math.random().toString(36).substring(2, 8);
};

const createMeeting = (name) => {
const id = generateRoomId();


setRoomId(id);
setUserName(name);
setIsHost(true);

socket.emit('join-room', {
  roomId: id,
  name,
});

return id;


};

const joinMeeting = (id, name) => {
setRoomId(id);
setUserName(name);
setIsHost(false);


socket.emit('join-room', {
  roomId: id,
  name,
});


};

const leaveMeeting = () => {
if (roomId) {
socket.emit('leave-room', { roomId });
}


setRoomId('');
setUserName('');
setParticipants([]);
setIsHost(false);


};

useEffect(() => {
socket.on('participants-update', ({ participants }) => {
setParticipants(participants);
});


socket.on('meeting-ended', () => {
  alert('Meeting ended by host');
  leaveMeeting();
});

return () => {
  socket.off('participants-update');
  socket.off('meeting-ended');
};


}, [roomId]);

return (
<RoomContext.Provider
value={{
roomId,
userName,
participants,
isHost,
createMeeting,
joinMeeting,
leaveMeeting,
}}
>
{children}
</RoomContext.Provider>
);
}

export function useRoom() {
return useContext(RoomContext);
}
