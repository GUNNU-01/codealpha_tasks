import { Video, PenTool, Folder, MessageCircle } from 'lucide-react';

export default function Sidebar() {
  return (
    <div className="w-20 bg-[#0F172A] border-r border-[#1E293B] flex flex-col items-center py-5 gap-5">
      <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-white">
        C
      </div>

      <button className="p-3 rounded-xl bg-[#1E293B]">
        <Video size={20} />
      </button>

      <button className="p-3 rounded-xl hover:bg-[#1E293B]">
        <PenTool size={20} />
      </button>

      <button className="p-3 rounded-xl hover:bg-[#1E293B]">
        <Folder size={20} />
      </button>

      <button className="p-3 rounded-xl hover:bg-[#1E293B]">
        <MessageCircle size={20} />
      </button>
    </div>
  );
}