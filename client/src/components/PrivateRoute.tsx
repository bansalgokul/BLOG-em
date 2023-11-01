import { useNavigate } from "react-router";
import { Outlet } from "react-router";
import useUserStore from "../store/useUserStore";

const PrivateRoute = () => {
	const { user, loading } = useUserStore();
	const navigate = useNavigate();

	if (!loading && user === null) {
		console.log("routing to home page");
		navigate("/");
	}

	return (
		<>
			<Outlet />
		</>
	);
};

export default PrivateRoute;
