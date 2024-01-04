"use client";
import React, { useState } from "react";
import Image from "next/image";
import globalStore from "@/app/store/globalStore";

const Navbar = () => {
    const { isCreatePostVisible, setIsCreatePostVisible } = globalStore();

    const handleCreatePost = () => {
        setIsCreatePostVisible(!isCreatePostVisible);
    };
    return (
        <section className="flex  ">
            <div className="flex w-full justify-end ">
                <Image
                    src="/icons/plus-1.png"
                    width={50}
                    height={50}
                    alt="create-post"
                    className="hover:scale-105"
                    onClick={handleCreatePost}
                ></Image>
            </div>
        </section>
    );
};

export default Navbar;
