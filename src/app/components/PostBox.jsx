import React, { useEffect, useState } from "react";
import globalStore from "@/app/store/globalStore";

import { createNewPost, addComment } from "@/app/api/actions";
import { toast } from "react-toastify";
import { getDateMonthYear, getCurrentDate } from "@/app/utils/functions";

const CreatePostPopup = () => {
    const {
        setIsCreatePostVisible,
        allRecentPosts,
        setAllRecentPosts,

        activePostData,
        setActivePostData,
    } = globalStore();

    if (activePostData?.createdAt) {
        var { day, month, year } = getDateMonthYear(activePostData?.createdAt);
    } else {
        var { year, month, day } = getCurrentDate();
    }

    // *******************************
    const [textMessage, setTextMessage] = useState("");
    const [userName, setUserName] = useState("");
    const [userLocation, setUserLocation] = useState("");

    const handleTogglePopup = () => {
        setIsCreatePostVisible(false);
    };

    const handleAddComment = async (textMessage, userName, postId) => {
        console.log("sending message...", textMessage, userName, postId);

        await addComment(postId, textMessage, userName);

        // updating the active post data
        const newActivePostData = {
            ...activePostData,
            commentsCount: activePostData?.commentsCount + 1,
            comments: [
                ...activePostData?.comments,
                { comment: textMessage, name: userName },
            ],
        };

        setActivePostData(newActivePostData);
        setTextMessage("");
        setUserName("");
    };
    return (
        <div className="bg-gray-800 max-h-[98vh]   overflow-y-scroll   p-1 m-1 rounded-md w-[90vw] sm:w-[75vw] md:w-[50vw]">
            <div className="bg-yellow-200 border px-2 py-2 border-gray-300 rounded-md   mx-auto text-black w-full">
                <p className="text-sm font-semibold w-full bg-yellow-200 flex justify-between items-center border-b-[1px] border-gray-400">
                    <span className="text-sm">{activePostData?.userName}</span>{" "}
                    <span className="text-xs">typing from</span>
                    <span> {activePostData?.userLocation}</span>
                </p>
                {/* <p>{activePostData?.createdAt}</p> */}
                <p className="py-4 pb-6 border-b-[1px] border-gray-400">
                    {" "}
                    {activePostData?.message}
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                    Cupiditate, molestiae perferendis deleniti dolorem esse
                    tempora suscipit voluptates id ab, rem tempore delectus
                    deserunt maxime ad nisi placeat impedit soluta porro
                    repellat fugiat animi nostrum? Consequuntur dolores quo sit,
                    veritatis labore numquam quaerat assumenda architecto
                    commodi, unde adipisci. Porro, officia quis!
                </p>
                <div className="text-xs font-semibold w-full bg-yellow-200 flex justify-between items-center">
                    <p>
                        On &nbsp;{day}-{month}-{year}
                    </p>
                    <div className="flex items-center gap-2">
                        <p>{activePostData?.likes} likes</p>
                        <p>{activePostData?.commentsCount} comments</p>
                    </div>
                </div>
            </div>

            <div className="  px-1 pt-1 rounded-md mb-[1px] border border-gray-400 my-4">
                <div className="  ">
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
                        className="mb-1 p-1 w-full bg-gray-100 rounded-md text-gray-900"
                        onChange={(e) => {
                            setUserName(e.target.value);
                        }}
                    />
                </div>{" "}
                <label htmlFor="textMessage" className="text-sm text-gray-300">
                    Add Comment
                </label>
                <textarea
                    type="text"
                    id="textMessage"
                    name="textMessage"
                    value={textMessage}
                    rows={2}
                    placeholder="Ser Vitamin Protein"
                    className="mb-1 rounded-md p-1 w-full bg-gray-100 text-gray-900"
                    onChange={(e) => {
                        setTextMessage(e.target.value);
                    }}
                />
                <div className="flex justify-end hover:scale-103 hover:text-blue-500 text-green-500 font-semibold transition-all duration-300 hover:border-blue-500 mr-5 my-2">
                    <button
                        className="border-green-500 border-[1px]  rounded-md  px-3"
                        onClick={() => {
                            handleAddComment(
                                textMessage,
                                userName,
                                activePostData?.id
                            );
                        }}
                    >
                        Send
                    </button>
                </div>
            </div>

            <div className="bg-gray-700 p-2 rounded-md my-4">
                {activePostData?.comments?.map((com, index) => (
                    <div key={index} className="border-b border-gray-600 py-2">
                        <p className="text-gray-300 text-sm mb-1">
                            {com?.name}{" "}
                        </p>
                        <p className="text-gray-100">{com?.comment}</p>
                    </div>
                ))}
                {activePostData?.comments?.map((com, index) => (
                    <div key={index} className="border-b border-gray-600 py-2">
                        <p className="text-gray-300 text-sm mb-1">
                            {com?.name}{" "}
                        </p>
                        <p className="text-gray-100">{com?.comment}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CreatePostPopup;
