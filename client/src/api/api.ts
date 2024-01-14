import axios from "axios"

const api = axios.create({
	baseURL: "http://localhost:4000/",
	timeout: 8000,
})

const refreshAccessToken = async () => {
	try {
		const response = await api.get("/auth/refresh", {
			withCredentials: true,
		})

		if (response.status === 200) {
			const token = `Bearer ${response.data.token}`
			api.defaults.headers.common.Authorization = token
			localStorage.setItem("token", token)
		}
	} catch (err) {
		console.error("Error refreshing access token:", err)
		localStorage.clear()
	}
}

api.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config
		console.log(originalRequest)
		if (error.response.status === 401) {
			if (
				!originalRequest._retry &&
				error.response.data.error === "Invalid access token"
			) {
				originalRequest._retry = true
				await refreshAccessToken()

				originalRequest.headers.Authorization =
					api.defaults.headers.common.Authorization
				return api(originalRequest)
			}
		}

		return Promise.reject(error)
	}
)

export default api
