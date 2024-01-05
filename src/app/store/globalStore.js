import { create } from "zustand";

// Create your store
const globalStore = create((set) => ({
    // Define your state variables and their initial values
    isCreatePostVisible: false,
    setIsCreatePostVisible: (value) => set({ isCreatePostVisible: value }),

    isPostBoxVisible: false,
    setIsPostBoxVisible: (value) => set({ isPostBoxVisible: value }),

    likedPosts: [],
    setLikedPosts: (value) => set({ likedPosts: value }),

    activePostId: "",
    setActivePostId: (value) => set({ activePostId: value }),

    activePostData: "",
    setActivePostData: (value) => set({ activePostData: value }),

    allRecentPosts: [],
    setAllRecentPosts: (value) => set({ allRecentPosts: value }),

    randomUserName: [],
    setRandomUserName: (value) => set({ randomUserName: value }),
}));

export default globalStore;
