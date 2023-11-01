import { BsFillPersonFill, BsPencilSquare } from "react-icons/bs";
import { BiSolidDashboard } from "react-icons/bi";
import { IoMdSettings } from "react-icons/io";
import profile from "../../assets/profile/profilePlaceholder.jpg";
import { useRef } from "react";

const Dashboard = () => {
	const fileInputRef = useRef<HTMLInputElement>(null);

	return (
		<div className="flex">
			{/* Sidebar Menu */}
			<div className="pl-16 flex flex-col border-r  m-2 rounded-md">
				<div className="w-[200px] flex pl-8 justify-start items-center gap-3 py-2 active:bg-[#e91e63] hover:bg-[#606876b3] mt-2 mx-2 rounded-md">
					<BsFillPersonFill />
					Profile
				</div>
				<div className="w-[200px] flex pl-8 justify-start items-center gap-3 py-2 hover:bg-[#606876b3] mt-2 mx-2 rounded-md">
					<BsPencilSquare />
					New Post
				</div>
				<div className="w-[200px] flex pl-8 justify-start items-center gap-3 py-2 hover:bg-[#606876b3] mt-2 mx-2 rounded-md">
					<BiSolidDashboard />
					Dashboard
				</div>
				<div className="w-[200px] flex pl-8 justify-start items-center gap-3 py-2 hover:bg-[#606876b3] mt-2 mx-2 rounded-md">
					<IoMdSettings />
					Settings
				</div>
			</div>

			{/* Main Settings */}
			<div className="flex flex-col bg-[#00000065]  m-2 mr-4 rounded-md grow">
				<div className="p-8 flex flex-col gap-4">
					<h2 className="font-primary-font text-2xl font-semibold tracking-wider">
						Profile
					</h2>
					<div className="flex gap-4 items-center">
						<div>
							<img
								src={profile}
								alt=""
								className="w-[70px] h-[70px] rounded-full "
							/>
						</div>
						<div className="flex flex-col gap-2">
							<button
								onClick={() => fileInputRef.current?.click()}
								className="px-4 py-1 bg-transparent border border-[#e91e63] text-white hover:bg-[#e91e63] rounded-md"
							>
								Change Profile Image
							</button>
							{fileInputRef.current?.files?.[0] && (
								<span className="text-xs">
									{fileInputRef.current?.files?.[0].name}
								</span>
							)}
							<input
								ref={fileInputRef}
								type="file"
								id="profile-image"
								placeholder="Change Profile Image"
								className="hidden"
							/>
						</div>
					</div>
					<div>
						Profile Data
						<div>Full Name</div>
						<div>Email Address</div>
						<div>About You</div>
						<div>Save Changes</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
