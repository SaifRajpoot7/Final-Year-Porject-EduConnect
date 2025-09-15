import React from "react";
import { Mic, Video, Monitor, PhoneOff } from "lucide-react";

const LiveLecturePage = () => {
  const mentor = {
    name: "Saif ur Rehman",
    img: "/saif.JPG", // Professional male
  };

  const students = [
    { id: 1, name: "Alice", img: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&w=500&q=80" },
    { id: 2, name: "Bob", img: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=500&q=80" },
    { id: 3, name: "Charlie", img: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=500&q=80" },
    { id: 4, name: "Diana", img: "https://images.unsplash.com/photo-1502767089025-6572583495b4?auto=format&fit=crop&w=500&q=80" },
    { id: 5, name: "Eve", img: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=500&q=80" },
    { id: 6, name: "Frank", img: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=500&q=80" },
  ];

  return (
    <div className="w-screen h-screen bg-gray-900 text-white flex flex-col overflow-hidden">
      {/* Main area */}
      <div className="flex flex-1 flex-col lg:flex-row overflow-hidden">
        {/* Mentor section */}
        <div className="flex-1 flex items-center justify-center p-2">
          <div className="relative w-full h-full max-h-full rounded-xl overflow-hidden">
            <img
              src={mentor.img}
              alt={mentor.name}
              className="w-full h-full object-cover object-top"
            />
            <div className="absolute bottom-2 left-2 bg-black/60 px-3 py-1 text-sm rounded">
              {mentor.name}
            </div>
          </div>
        </div>

        {/* Students grid */}
        <div className="w-full lg:w-1/3 grid grid-cols-2 gap-2 p-2 overflow-y-auto">
          {students.map((s) => (
            <div
              key={s.id}
              className="relative bg-black aspect-video rounded-xl overflow-hidden"
            >
              <img
                src={s.img}
                alt={s.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-1 left-1 bg-black/60 px-2 py-0.5 text-xs rounded">
                {s.name}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom control bar */}
      <div className="flex items-center justify-center gap-6 bg-black/50 py-4">
        <button className="p-3 bg-gray-800 hover:bg-gray-700 rounded-full">
          <Mic size={20} />
        </button>
        <button className="p-3 bg-gray-800 hover:bg-gray-700 rounded-full">
          <Video size={20} />
        </button>
        <button className="p-3 bg-gray-800 hover:bg-gray-700 rounded-full">
          <Monitor size={20} />
        </button>
        <button className="p-3 bg-red-600 hover:bg-red-700 rounded-full">
          <PhoneOff size={20} />
        </button>
      </div>
    </div>
  );
};

export default LiveLecturePage;
