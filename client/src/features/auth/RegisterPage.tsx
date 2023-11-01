import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/api";
import { isAxiosError } from "axios";
import { ClipLoader } from "react-spinners";

const RegisterPage = () => {
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [passFormat, setPassFormat] = useState<"password" | "text">("password");
	const [confirmPassFormat, setConfirmPassFormat] = useState<
		"password" | "text"
	>("password");

	const [error, setError] = useState<string | null>(null);

	const [usernameError, setUsernameError] = useState("");
	const [emailError, setEmailError] = useState("");
	const [passwordError, setPasswordError] = useState("");
	const [confirmPasswordError, setConfirmPasswordError] = useState("");

	const [loading, setLoading] = useState(false);

	const navigate = useNavigate();

	const registerUser = async () => {
		setLoading(true);

		const reqBody = {
			username,
			email,
			password,
		};

		try {
			await api.post("/auth/register", reqBody);
			setError(null);
			navigate("/login");
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
	const handleConfirmPassFormatChange = () => {
		setConfirmPassFormat((prev) => (prev === "password" ? "text" : "password"));
	};

	const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setUsername(value);

		if (value.length > 0 && value.length < 4) {
			setUsernameError("Username must be at least 4 characters");
		} else {
			setUsernameError("");
		}
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

	const handleConfirmPasswordChange = (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		const value = e.target.value;
		setConfirmPassword(value);

		if (value.length > 0 && value !== password) {
			setConfirmPasswordError("Password does not match");
		} else {
			setConfirmPasswordError("");
		}
	};

	const registerDisabled =
		usernameError ||
		emailError ||
		passwordError ||
		confirmPasswordError ||
		username.length < 1 ||
		email.length < 1 ||
		password.length < 8 ||
		confirmPassword.length < 8 ||
		loading
			? true
			: false;

	return (
		<div className="w-full h-full grid place-content-center">
			<div className="max-w-[600px] w-[70vw] flex flex-col">
				<h1 className="text-6xl mb-8 font-bold">Register</h1>
				<div className="flex flex-col">
					<input
						type="text"
						placeholder="Username"
						value={username}
						onChange={handleUsernameChange}
						className="bg-transparent p-2 text-[#999999] border-b-2 border-b-white my-2 focus:border-b-0 "
						required
						minLength={4}
						title="Please enter a valid username"
					/>
					{usernameError && (
						<span className="text-red-500 text-sm">{usernameError}</span>
					)}
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
					<div className="relative">
						<input
							type={confirmPassFormat}
							value={confirmPassword}
							onChange={handleConfirmPasswordChange}
							placeholder="Confirm Password"
							className="bg-transparent w-full p-2 text-[#999999] border-b-2 border-b-white my-2 focus:border-b-0"
							required
							minLength={8}
							title="Password must be at least 8 characters"
						/>
						{confirmPasswordError && (
							<span className="text-red-500 text-sm">
								{confirmPasswordError}
							</span>
						)}

						<button
							className="absolute top-4 right-2 text-2xl"
							onClick={handleConfirmPassFormatChange}
						>
							{confirmPassFormat === "password" ? (
								<AiOutlineEye />
							) : (
								<AiOutlineEyeInvisible />
							)}
						</button>
					</div>
				</div>

				<button
					className={`mt-6 p-2 ${
						registerDisabled
							? "bg-[#333333]"
							: "bg-[#FFFFFF] hover:bg-opacity-20 hover:text-white transition-all"
					} text-primary-background rounded-md font-medium `}
					onClick={registerUser}
					disabled={registerDisabled}
				>
					{loading ? <ClipLoader size={20} /> : "Register"}
				</button>
				<div className="flex justify-center my-4 text-base">
					<p>
						Already have account?{" "}
						<Link to="/login" className="underline">
							Login here
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

export default RegisterPage;
