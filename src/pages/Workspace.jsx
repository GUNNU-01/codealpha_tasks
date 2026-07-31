import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import VideoGrid from '../components/VideoGrid';
import WhiteboardPanel from '../components/WhiteboardPanel';
import ChatPanel from '../components/ChatPanel';
import ParticipantPanel from '../components/ParticipantPanel';
import BottomControls from '../components/BottomControls';
import JoinRoomModal from '../components/JoinRoomModal';
import { useRoom } from '../context/RoomContext';
import FileSharePanel from '../components/FileSharePanel';
import ReactionOverlay from '../components/ReactionOverlay';

export default function Workspace() {
const { roomId } = useRoom();

return (
<>
{!roomId && <JoinRoomModal />}


  <div className='h-screen bg-[#070B14] text-white flex overflow-hidden'>
    {/* Sidebar */}
    <Sidebar />

    {/* Main content */}
    <div className='flex-1 flex flex-col'>
      {/* Fixed topbar */}
      <Topbar />

      {/* Scrollable content */}
      <div className='flex-1 overflow-y-auto p-6 pb-28'>
        <div className='grid grid-cols-12 gap-6'>
          {/* Left side */}
          <div className='col-span-9 flex flex-col gap-6'>
            <VideoGrid />
            <WhiteboardPanel />
            <FileSharePanel roomId={roomId} />
            <ReactionOverlay />
          </div>

          {/* Right side */}
          <div className='col-span-3'>
            <div className='sticky top-6 flex flex-col gap-6'>
              <ParticipantPanel />
              <ChatPanel />
            </div>
          </div>
        </div>
      </div>

      {/* Fixed bottom controls */}
      <div className='fixed bottom-0 left-20 right-0 z-50'>
        <BottomControls />
      </div>
    </div>
  </div>
</>


);
}
