import { create } from "zustand";
import api from "../api/api";

export type User = {
	_id: string;
	username: string;
	email: string;
};

export type userStoreType = {
	user: User | null;
	loading: boolean;
	setUser: (payload: User) => void;
	checkAuth: () => Promise<void>;
	logout: () => Promise<void>;
};

// TODO : if refresh token gets error , change the login state,
// TODO : place all the auth functions in the user store

const useUserStore = create<userStoreType>()((set, get) => ({
	user: null,
	loading: true,
	setUser: (payload) => {
		set({ user: payload });
	},
	checkAuth: async () => {
		try {
			set({ loading: true });
			const token = localStorage.getItem("token");
			api.defaults.headers.common.Authorization = token;
			const response = await api.get("auth/private");
			const { _id, username, email } = response.data.data;
			if (_id !== get().user?._id) {
				set({ user: { _id, username, email } });
				console.log(get().user);
			}
		} catch (err) {
			console.error(err);
			api.defaults.headers.common.Authorization = undefined;
			localStorage.removeItem("token");
			set({ user: null });
		} finally {
			set({ loading: false });
		}
	},
	logout: async () => {
		try {
			set({ loading: true });
			await api.post("auth/logout", undefined, {
				withCredentials: true,
			});
			set({ user: null });
			api.defaults.headers.common.Authorization = undefined;
			localStorage.removeItem("token");
		} catch (err) {
			console.error(err);
			api.defaults.headers.common.Authorization = undefined;
			localStorage.removeItem("token");
			set({ user: null });
		} finally {
			set({ loading: false });
		}
	},
}));

export default useUserStore;
