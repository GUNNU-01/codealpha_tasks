import { useRoom } from "../context/RoomContext";

export default function ParticipantsPanel() {
    const { participants } = useRoom();

    return (
        <div className="bg-[#0F172A] border border-[#1E293B] rounded-3xl p-5 text-white">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Participants</h2>
                <span className="text-indigo-400 font-bold">
                    {participants.length}
                </span>
            </div>

            <div className="space-y-3">
                {participants.map((user) => (
                    <div
                        key={user.id}
                        className="flex items-center gap-3 p-3 rounded-xl bg-[#111827]"
                    >
                        <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center font-bold">
                            {user.name?.charAt(0)?.toUpperCase()}
                        </div>

                        <div className="flex-1">
                            <div className="font-medium flex items-center gap-2">
                                {user.name}
                                {user.raised && (
                                    <span className="text-yellow-400 text-lg">✋</span>
                                )}
                            </div>
                            <div className="text-xs text-gray-400">
                                {user.raised ? "Hand raised" : "Online"}
                            </div>
                        </div>
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    </div>
                ))}

                {participants.length === 0 && (
                    <div className="text-gray-400 text-sm">
                        No participants yet
                    </div>
                )}
            </div>
        </div>
    );
}