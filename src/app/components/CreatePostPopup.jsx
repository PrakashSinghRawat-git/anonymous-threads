import React, { useState } from "react";
import globalStore from "@/app/store/globalStore";

import { createNewPost } from "@/app/api/actions";
import { serverTimestamp } from "firebase/firestore";

import { toast } from "react-toastify";

const CreatePostPopup = () => {
    const {
        isCreatePostVisible,
        setIsCreatePostVisible,
        allRecentPosts,
        setAllRecentPosts,
    } = globalStore();
    const [textMessage, setTextMessage] = useState("");
    const [userName, setUserName] = useState("");
    const [userLocation, setUserLocation] = useState("");

    const handleTogglePopup = () => {
        setIsCreatePostVisible(false);
    };
    const handleSendMessage = async () => {
        console.log("sending message...", textMessage, userName, userLocation);

        const postObj = {
            userName: userName,
            userLocation: userLocation,
            message: textMessage,
            comments: [],
            commentsCount: 0,
            likes: 0,
        };

        createNewPost(postObj)
            .then((res) => {
                toast.success("Message added successfully...");
                const updatedPosts = [postObj, ...allRecentPosts];
                setAllRecentPosts(updatedPosts);
            })
            .catch((err) => {
                toast.error("Error adding message...");
            });

        setIsCreatePostVisible(false);
        setTextMessage("");
        setUserName("");
        setUserLocation("");
    };
    return (
        <div className="bg-gray-800  p-1 m-1 rounded-md">
            <div>
                <div className="flex w-full justify-between">
                    <h1>create post</h1>
                    <span
                        onClick={handleTogglePopup}
                        className="text-red-500 text-2xl hover:scale-105"
                    >
                        X
                    </span>
                </div>
                <div className="  px-1 pt-1 rounded-md mb-1">
                    {" "}
                    <label htmlFor="userName" className="text-sm text-gray-300">
                        dummy name (optional)
                    </label>
                    <input
                        type="text"
                        id="userName"
                        name="userName"
                        value={userName}
                        placeholder="Ser Vitamin Protein"
                        className="mb-1 p-1 w-full bg-gray-100 text-gray-900"
                        onChange={(e) => {
                            setUserName(e.target.value);
                        }}
                    />
                </div>
                <div className=" px-1 pt-1   rounded-md">
                    {" "}
                    <label htmlFor="userName" className="text-sm text-gray-300">
                        dummy location (optional)
                    </label>
                    <input
                        type="text"
                        id="location"
                        name="location"
                        value={userLocation}
                        placeholder="Hogwarts"
                        className="mb-1 p-1 w-full bg-gray-100 text-gray-900"
                        onChange={(e) => {
                            setUserLocation(e.target.value);
                        }}
                    />
                </div>

                <div className="px-1 pt-3  flex flex-col rounded-md">
                    <label
                        htmlFor="textMessage"
                        className="text-sm text-gray-300"
                    >
                        your message (optional)
                    </label>
                    <textarea
                        name="message"
                        id="message"
                        value={textMessage}
                        rows="5"
                        onChange={(e) => {
                            setTextMessage(e.target.value);
                        }}
                        className="text-gray-900 bg-gray-100 p-1"
                        placeholder="write something..."
                    ></textarea>
                </div>
                <div className="flex justify-end hover:scale-103 hover:text-blue-500 text-green-500 font-semibold transition-all duration-300 hover:border-blue-500 mr-5 my-2">
                    <button
                        className="border-green-500 border-[1px]  rounded-md  px-3"
                        onClick={handleSendMessage}
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreatePostPopup;
