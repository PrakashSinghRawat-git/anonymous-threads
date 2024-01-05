"use client";
import React, { useEffect, useState } from "react";
import globalStore from "@/app/store/globalStore";
import CreatePostPopup from "./components/CreatePostPopup";
import PostBox from "@/app/components/PostBox";
import MessagePaper from "./components/MessagePaper";
import DragableClosePostButton from "./components/DragableClosePostButton";

import Navbar from "@/app/components/Navbar";
import { fetchMostRecentPosts } from "@/app/api/actions";
import { generateUsername } from "unique-username-generator";

export default function Home() {
    const {
        isCreatePostVisible,
        setIsCreatePostVisible,
        allRecentPosts,
        setAllRecentPosts,
        isPostBoxVisible,
        setIsPostBoxVisible,
        randomUserName,
        setRandomUserName,
    } = globalStore();
    const message =
        "Hello World! lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";
    const paperStyle = {
        width: `${message.length * 10}px`, // Adjust the factor as needed
    };

    useEffect(() => {
        fetchMostRecentPosts()
            .then((res) => {
                console.log("client: posts are: ", res);
                setAllRecentPosts(res);
            })
            .catch((err) => {
                console.log("client: error fetching posts: ", err);
            });
    }, []);

    useEffect(() => {
        if (!randomUserName) {
            const username = generateUsername("-");
            setRandomUserName(username);
        }
    }, []);
    // useEffect(() => {
    //     setInterval(() => {
    //         console.log("client: randomUserName: ", generateUsername());
    //     }, 1500);
    // }, []);

    return (
        <section>
            <Navbar />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {allRecentPosts.map((post) => (
                    <div key={post.id} className="col-span-1">
                        <MessagePaper post={post} />
                    </div>
                ))}
            </div>

            {isCreatePostVisible && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-50 backdrop-blur-lg flex justify-center items-center">
                    {/* Background overlay with blur effect */}
                    <div className="absolute z-50">
                        {/* Centered popup */}
                        <CreatePostPopup />
                    </div>
                </div>
            )}

            {isPostBoxVisible && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-50 backdrop-blur-lg flex justify-center items-center">
                    {/* Background overlay with blur effect */}
                    <div className="absolute z-50">
                        {/* Centered popup */}
                        <PostBox />
                    </div>
                </div>
            )}
        </section>
    );
}
