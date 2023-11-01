import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/api";
import { isAxiosError } from "axios";
import { ClipLoader } from "react-spinners";
// import { AuthContext } from "../../components/Context/AuthContext";
import useUserStore from "../../store/useUserStore";

const LoginPage = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [passFormat, setPassFormat] = useState<"password" | "text">("password");
	const [error, setError] = useState<string | null>(null);

	const [emailError, setEmailError] = useState("");
	const [passwordError, setPasswordError] = useState("");

	const [loading, setLoading] = useState(false);
	const { setUser } = useUserStore();

	const navigate = useNavigate();

	const loginUser = async () => {
		setLoading(true);

		const reqBody = {
			email,
			password,
		};

		try {
			const response = await api.post("/auth/login", reqBody, {
				withCredentials: true,
			});

			setError(null);
			setUser(response.data.data);
			const token = `Bearer ${response.data.token}`;
			localStorage.setItem("token", token);
			api.defaults.headers.common.Authorization = token;
			navigate("/");
		} catch (err) {
			if (isAxiosError(err)) {
				setError(err.response?.data.error);
			}
		} finally {
			setLoading(false);
		}
	};

	const handlePassFormatChange = () => {
		setPassFormat((prev) => (prev === "password" ? "text" : "password"));
	};

	const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setEmail(value);

		if (
			value.length > 0 &&
			!value.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}/)
		) {
			setEmailError("Please enter a valid email address");
		} else {
			setEmailError("");
		}
	};

	const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setPassword(value);

		if (value.length > 0 && value.length < 8) {
			setPasswordError("Password must be at least 8 characters");
		} else {
			setPasswordError("");
		}
	};

	const loginDisabled =
		emailError ||
		passwordError ||
		email.length < 1 ||
		password.length < 8 ||
		loading
			? true
			: false;

	return (
		<div className="w-full h-full grid place-content-center">
			<div className="max-w-[600px] w-[70vw] flex flex-col">
				<h1 className="text-6xl mb-8 font-bold">Login</h1>
				<div className="flex flex-col">
					<input
						type="text"
						placeholder="Email"
						value={email}
						onChange={handleEmailChange}
						className="bg-transparent p-2 text-[#999999] border-b-2 border-b-white my-2 focus:border-b-0 "
						required
						pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}"
						title="Please enter a valid email address"
					/>
					{emailError && (
						<span className="text-red-500 text-sm">{emailError}</span>
					)}

					<div className="relative">
						<input
							type={passFormat}
							value={password}
							onChange={handlePasswordChange}
							placeholder="Password"
							className="bg-transparent w-full p-2 text-[#999999] border-b-2 border-b-white my-2 focus:border-b-0"
							required
							minLength={8}
							title="Password must be at least 8 characters"
						/>
						{passwordError && (
							<span className="text-red-500 text-sm">{passwordError}</span>
						)}

						<button
							className="absolute top-4 right-2 text-2xl"
							onClick={handlePassFormatChange}
						>
							{passFormat === "password" ? (
								<AiOutlineEye />
							) : (
								<AiOutlineEyeInvisible />
							)}
						</button>
					</div>
				</div>
				<div className="flex justify-end">
					<Link to={"/forgot"} className="my-2 underline text-sm">
						Forgot Password ?
					</Link>
				</div>
				<button
					className={`mt-2 p-2 ${
						loginDisabled
							? "bg-[#333333]"
							: "bg-[#FFFFFF] hover:bg-opacity-20 hover:text-white transition-all"
					} text-primary-background rounded-md font-medium `}
					onClick={loginUser}
					disabled={loginDisabled}
				>
					{loading ? <ClipLoader size={20} /> : "Login"}
				</button>
				<div className="flex justify-center my-4 text-base">
					<p>
						Don't have account?{" "}
						<Link to="/register" className="underline">
							Create an account
						</Link>
					</p>
				</div>
				{error && (
					<div className="bg-[#FFD1D1] text-[#333333] p-2 rounded-md text-base text-center">
						{error}
					</div>
				)}
			</div>
		</div>
	);
};

export default LoginPage;
