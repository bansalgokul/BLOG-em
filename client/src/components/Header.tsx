// import { HiOutlineMenu } from "react-icons/hi";
import { useEffect, useState } from "react";
import postImage from "../assets/postImage.png";
import { Link } from "react-router-dom";
import { useDebounce } from "use-debounce";
import usePostsStore from "../store/usePostsStore";
import useUserStore from "../store/useUserStore";
import { ArrowRight, FilePlus2, LogOut, User } from "lucide-react";
import { Button, buttonVariants } from "../@/components/ui/button.tsx";
import { cn } from "../@/lib/utils.ts";
import { Input } from "../@/components/ui/input.tsx";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
} from "../@/components/ui/dropdown-menu.tsx";
import { DropdownMenuTrigger } from "../@/components/ui/dropdown-menu.tsx";

const Header = () => {
	const { searchQuery, setSearchQuery } = usePostsStore();
	const { user, logout } = useUserStore();

	const [search, setSearch] = useState(searchQuery);
	const [debounceSearch] = useDebounce(search, 1000);

	useEffect(() => {
		setSearchQuery(debounceSearch);
	}, [debounceSearch, setSearchQuery]);

	return (
		<header className="z-20 h-20 fixed top-0 w-full bg-background">
			<div className="max-w-6xl py-4 px-4 lg:px-8 xl:px-12 2xl:px-16 flex items-center justify-between mx-auto">
				<div className="flex w-1/4 justify-between gap-12 ">
					<Link to={"/"}>
						<h1 className="text-2xl  font-semibold">BLOG'EM</h1>
					</Link>
					{/* <div className="hidden sm:flex gap-12 text-xl items-center">
						<Link to={"/"}>
							<h3 className="text-lg text-gray-300 font-semibold">
								Home
							</h3>
						</Link>
						<Link to={"/recent"}>
							<h3 className="text-lg text-gray-300 font-semibold">
								Recent
							</h3>
						</Link>
						<Link to={"/top"} className="pointer-events-none">
							<h3 className="text-lg font-semibold text-gray-300">
								Top
							</h3>
						</Link>
						<Link className="pointer-events-none" to={"/about"}>
							<h3 className="text-lg font-semibold  text-gray-300">
								About
							</h3>
						</Link>
					</div> */}
				</div>
				<div className="flex gap-8">
					<Input
						type="text"
						placeholder="Search"
						className={cn("hidden sm:flex rounded-xl w-[400px] ")}
						value={search}
						onChange={(e) => setSearch(e.target.value)}
					/>
					{user != null ? (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="default"
									className="rounded-full p-1 bg-background"
								>
									<img
										src={postImage}
										alt=""
										className="w-8 h-8 rounded-full border-gray-300 border-1"
									/>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent className="w-32 rounded-lg">
								<DropdownMenuItem>
									<Link
										to={"/profile"}
										className={cn(
											buttonVariants({
												variant: "ghost",
											}),
											"rounded-xl p-0 m-0 h-fit font-normal"
										)}
									>
										<User className="mr-2 h-4 w-4" />{" "}
										<span>Profile</span>
									</Link>
								</DropdownMenuItem>
								<DropdownMenuItem>
									<Link
										to={"/post/new"}
										className={cn(
											buttonVariants({
												variant: "ghost",
											}),
											"rounded-xl p-0 m-0 h-fit font-normal"
										)}
									>
										<FilePlus2 className="mr-2 h-4 w-4" />{" "}
										<span>New Post</span>
									</Link>
								</DropdownMenuItem>
								<DropdownMenuItem>
									<Button
										variant={"ghost"}
										className={cn(
											"rounded-xl p-0 m-0 h-fit font-normal"
										)}
										onClick={logout}
									>
										<LogOut className="mr-2 h-4 w-4" />{" "}
										Logout
									</Button>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					) : (
						// <div
						// 	className="relative"
						// 	onClick={toggleMenu}
						// 	ref={menuRef}
						// >

						// 	{isMenuOpen && (
						// 		<div className="absolute z-10 w-[180px] -left-[120px] rounded-xl overflow-clip top-12 bg-background font-semibold">
						// 			<div className="bg-foreground/10 flex flex-col p-2 py-4 space-y-1">
						// 				{/* <Link
						// 					to="/profile"
						// 					className="hover:bg-foreground/20 py-2 px-4 rounded-xl transition-all flex gap-3"
						// 				>
						// 					<User />
						// 					Profile
						// 				</Link> */}
						// 				<Link
						// 					to="/post/new"
						// 					className="hover:bg-foreground/20 py-2 px-4 rounded-xl  flex gap-3"
						// 				>
						// 					<FilePlus2 />
						// 					New Post
						// 				</Link>
						// 				<button
						// 					onClick={logout}
						// 					className="hover:bg-foreground/20 py-2 px-4 rounded-xl text-left  flex  gap-3"
						// 				>
						// 					<LogOut />
						// 					Logout
						// 				</button>
						// 			</div>
						// 		</div>
						// 	)}
						// </div>
						<Link
							to={"/register"}
							className={cn(
								buttonVariants({ variant: "default" }),
								"rounded-xl"
							)}
						>
							Sign Up
							<ArrowRight className="ml-2 h-5 w-5" />
						</Link>
					)}
				</div>
			</div>
		</header>
	);
};

export default Header;
