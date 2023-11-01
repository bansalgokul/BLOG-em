import { create } from "zustand";
import api from "../api/api";

export type Post = {
	_id: string;
	title: string;
	description: string;
	content: string;
	banner: string; // TODO : what to do
	bannerURL: string;
	updatedAt: string;
	createdAt: string;
	authorUsername: string;
	authorID: string;
	tags: string[];
	likesCount: number;
	likedByUser: boolean;
};

const emptyPost = {
	_id: "",
	title: "",
	description: "",
	content: "",
	banner: "", // TODO : what to do
	bannerURL: "",
	updatedAt: "",
	createdAt: "",
	authorUsername: "",
	authorID: "",
	tags: [],
	likesCount: 0,
	likedByUser: false,
};

export type usePostsStoreType = {
	post: Post;
	fetchPost: (id: string) => Promise<void>;
	editPost: (editedPost: Post) => Promise<void>;
	createPost: (createPostPayload: FormData) => Promise<void>;
	likePost: () => Promise<void>; // TODO: correct the type
	deletePost: (deletePostID: string) => Promise<void>;
	loading: boolean;
};

const usePostStore = create<usePostsStoreType>()((set, get) => ({
	post: emptyPost,
	fetchPost: async (id: string) => {
		try {
			set({ loading: true });
			const response = await api.get(`/post?target=${id}`);
			set({ post: response.data.post });
		} catch (err) {
			console.log(err);
		} finally {
			set({ loading: false });
		}
	},
	editPost: async (editPostPayload) => {
		try {
			set({ loading: true });
			const response = await api.put("/post", editPostPayload);
			set({ post: response.data.post });
		} catch (err) {
			console.log(err);
		} finally {
			set({ loading: false });
		}
	},
	likePost: async () => {
		try {
			set({ loading: true });
			await api.post(`/post/like?target=${get().post._id}`);
			set({
				post: {
					...get().post,
					likedByUser: !get().post.likedByUser,
					likesCount: get().post.likedByUser
						? get().post.likesCount--
						: get().post.likesCount++,
				},
			});
		} catch (err) {
			console.log(err);
		} finally {
			set({ loading: false });
		}
	},
	deletePost: async (deletePostID) => {
		try {
			set({ loading: true });
			const response = await api.delete(`/post?target=${deletePostID}`);
			set({ post: response.data.posts });
		} catch (err) {
			console.log(err);
		} finally {
			set({ loading: false });
		}
	},
	createPost: async (createPostPayload) => {
		try {
			set({ loading: true });
			const response = await api.post("/post", createPostPayload);
			set({ post: response.data.post });
		} catch (err) {
			console.log(err);
		} finally {
			set({ loading: false });
		}
	},
	loading: true,
}));

export default usePostStore;
