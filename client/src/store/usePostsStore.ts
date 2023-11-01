import { create } from "zustand";
import api from "../api/api";

export type displayPost = {
	_id: string;
	title: string;
	description: string;
	banner: string;
	bannerURL: string;
	updatedAt: string;
	createdAt: string;
	authorUsername: string;
	tags: string[];
	commentsCount: number;
	likesCount: number;
};

export type usePostsStoreType = {
	posts: displayPost[];
	fetchPosts: () => Promise<void>;
	loading: boolean;
	searchQuery: string;
	setSearchQuery: (searchQuery: string) => void;
	limit: number;
	setLimit: (limit: number) => void;
	page: number;
	setPage: (page: number) => void;
	totalPosts: number;
};

const usePostsStore = create<usePostsStoreType>()((set, get) => ({
	posts: [],
	fetchPosts: async () => {
		try {
			set({ loading: true });
			const response = await api.get(
				`/post?search=${get().searchQuery}&limit=${get().limit}&page=${
					get().page
				}`
			);
			set({ posts: response.data.posts });
			set({ totalPosts: response.data.totalPosts });
		} catch (err) {
			console.log(err);
		} finally {
			set({ loading: false });
		}
	},
	loading: true,
	searchQuery: "",
	setSearchQuery: (searchQuery: string) => {
		set({ searchQuery: searchQuery });
	},
	limit: 10,
	setLimit: (limit: number) => {
		set({ limit: limit });
	},
	page: 1,
	setPage: (page: number) => {
		set({ page: page });
	},
	totalPosts: 0,
}));

export default usePostsStore;
