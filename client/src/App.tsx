import { Outlet, Route, Routes } from "react-router";
import Header from "./components/Header";
import PostPage from "./components/PostPage";

import HomeScreen from "./components/Screens/HomeScreen";
import RegisterPage from "./features/auth/RegisterPage";
import LoginPage from "./features/auth/LoginPage";
import { useEffect } from "react";
import { ClipLoader } from "react-spinners";
import PostEditor from "./components/PostEditor";
import PrivateRoute from "./components/PrivateRoute";
import RecentPostsScreen from "./components/Screens/RecentPostsScreen";
import useUserStore from "./store/useUserStore";
import Dashboard from "./components/Dashboard/Dashboard";

function App() {
	const { checkAuth, loading } = useUserStore();

	useEffect(() => {
		checkAuth();
	}, [checkAuth]);

	return (
		<>
			{loading ? (
				<ClipLoader />
			) : (
				<Routes>
					<Route path="/" element={<MainLayout />}>
						<Route path="/" element={<HomeScreen />} />
						<Route path="/recent" element={<RecentPostsScreen />} />
						{/* <Route path="/top" element={<TopPostsScreen />} />
						<Route path="/about" element={<AboutScreen />} /> */}
						<Route path="/login" element={<LoginPage />} />
						<Route path="/register" element={<RegisterPage />} />
						<Route path="post/:id" element={<PostPage />} />
						<Route path="post/new" element={<PrivateRoute />}>
							<Route index element={<PostEditor />} />
						</Route>
						<Route path="post/edit/:id" element={<PrivateRoute />}>
							<Route index element={<PostEditor />} />
						</Route>
						<Route path="/dash" element={<PrivateRoute />}>
							<Route index element={<Dashboard />} />
						</Route>
						{/* 
							<Route path="profile" element={<PrivateRoute />}>
								<Route path="/" element={<Profile />} />
							</Route>
						 */}
					</Route>
				</Routes>
			)}
		</>
	);
}

const MainLayout = () => {
	return (
		<div>
			<div className="leading-6 text-primary bg-background flex-col flex h-screen min-w-full">
				<Header />
				<div className="flex flex-col grow mt-20">
					<main className="grow w-full max-w-6xl mx-auto">
						<Outlet />
					</main>
					{/* <footer className="p-4 w-full">
						<p className="text-center">by Gokul Bansal</p>
					</footer> */}
				</div>
			</div>
		</div>
	);
};

export default App;
