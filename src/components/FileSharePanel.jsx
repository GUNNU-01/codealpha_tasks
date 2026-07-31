import { socket } from "../socket";
import { useEffect, useState } from "react";

import { UploadCloud, File } from "lucide-react";


export default function FileSharePanel({ roomId }) {

    const [file, setFile] = useState(null);
    const [uploaded, setUploaded] = useState([]);


    // Join the current CollabSphere room
    useEffect(() => {

        if(roomId){

            socket.emit("join-room", roomId);

        }

    }, [roomId]);


    // Receive files from other users
    useEffect(() => {

        socket.on("receive-file", (data) => {

            setUploaded((prev) => [
                ...prev,
                data
            ]);

        });


        return () => {
            socket.off("receive-file");
        };

    }, []);



    const uploadFile = async () => {

        if (!file) return;


        const formData = new FormData();

        formData.append(
            "file",
            file
        );


        const res = await fetch(
            "http://localhost:5000/upload",
            {
                method: "POST",
                body: formData
            }
        );


        const data = await res.json();


        // Show for sender
        setUploaded((prev) => [
            ...prev,
            data
        ]);


        // Send to other users
       socket.emit("file-shared", {

    roomId: roomId,

    name: data.name,

    url: data.url

});


        setFile(null);

    };



    return (

        <div className="
        bg-[#0F172A]
        border
        border-[#1E293B]
        rounded-3xl
        p-5
        text-white
        ">


            <h2 className="
            text-xl
            font-semibold
            mb-4
            ">
                Shared Files
            </h2>


            <div className="
            border-2
            border-dashed
            border-gray-600
            rounded-2xl
            p-6
            text-center
            ">


                <UploadCloud
                    size={40}
                    className="mx-auto mb-3"
                />


                <input

                    type="file"

                    onChange={(e)=>
                        setFile(e.target.files[0])
                    }

                />


                <button

                    onClick={uploadFile}

                    className="
                    mt-4
                    px-5
                    py-2
                    bg-indigo-600
                    rounded-xl
                    hover:bg-indigo-500
                    "

                >
                    Upload
                </button>


            </div>



            <div className="mt-5 space-y-3">

                {
                    uploaded.map((item,index)=>(

                        <div
                        key={index}
                        className="
                        bg-[#111827]
                        p-3
                        rounded-xl
                        flex
                        items-center
                        justify-between
                        "
                        >

                            <div className="flex gap-3 items-center">

                                <File />

                                <span>
                                    {item.name}
                                </span>

                            </div>


                            <a
                            href={item.url}
                            target="_blank"
                            rel="noreferrer"
                            className="
                            text-indigo-400
                            "
                            >
                                Open
                            </a>


                        </div>

                    ))
                }


            </div>


        </div>

    );

}