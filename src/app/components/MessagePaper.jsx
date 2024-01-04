import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { fetchOnePost } from "@/app/api/actions";
import { getDateMonthYear, getCurrentDate } from "@/app/utils/functions";
import globalStore from "@/app/store/globalStore";
const MessagePaper = ({ post }) => {
    const {
        isCreatePostVisible,
        setIsCreatePostVisible,
        allRecentPosts,
        setAllRecentPosts,
        isPostBoxVisible,
        setIsPostBoxVisible,
        activePostId,
        setActivePostId,
        activePostData,
        setActivePostData,
    } = globalStore();

    const paperStyle = {
        width: `${post?.message?.length * 10}px `, // Adjust the factor as needed
    };
    if (post?.createdAt) {
        var { day, month, year } = getDateMonthYear(post?.createdAt);
    } else {
        var { year, month, day } = getCurrentDate();
    }

    const handleOpenPostBox = (id) => {
        setIsPostBoxVisible(true);
        setActivePostId(id);

        fetchOnePost(id)
            .then((res) => {
                console.log("post data is", res);
                setActivePostData(res);
            })
            .catch((err) => {
                console.log("error fetching post data", err);
            });
    };
    return (
        <div
            className="bg-yellow-200 border px-1  border-gray-300 rounded-md  max-w-max mx-auto text-black min-w-[350px]"
            style={paperStyle}
        >
            <p className="text-sm font-semibold w-full bg-yellow-200 flex justify-between items-center border-b-[1px] border-gray-400">
                <span className="text-sm">{post?.userName}</span>{" "}
                <span className="text-xs">typing from</span>
                <span> {post?.userLocation}</span>
            </p>
            {/* <p>{post?.createdAt}</p> */}

            <p className="py-2 border-b-[1px] border-gray-400">
                {" "}
                {post?.message}
            </p>

            <div className="text-xs font-semibold w-full bg-yellow-200 flex justify-between items-center">
                <p>
                    On &nbsp;{day}-{month}-{year}
                </p>
                <div className="flex items-center gap-2">
                    <p>{post?.likes} likes</p>
                    <p>{post?.commentsCount} comments</p>
                    <button
                        className="hover-scale-105"
                        onClick={() => {
                            handleOpenPostBox(post?.id);
                        }}
                    >
                        <FontAwesomeIcon
                            icon={faArrowRight}
                            className="text-[20px]"
                        />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MessagePaper;
