"use client";

import { useState, useRef } from "react";
import globalStore from "../store/globalStore";

const DraggableButton = () => {
    const { isPostBoxVisible, setIsPostBoxVisible } = globalStore();
    return (
        <button
            className="z-99 top-[38.5%] right-[8%] md:right-[27%] bg-red-500 hover:bg-red-700 text-black font-bold py-1 px-3 rounded-full shadow-md fixed "
            onClick={() => {
                setIsPostBoxVisible(false);
            }}
        >
            Close
        </button>
    );
};

export default DraggableButton;
