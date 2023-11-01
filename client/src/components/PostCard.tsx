import { format, parseISO } from "date-fns";
import { useNavigate } from "react-router";
import { AiOutlineComment, AiOutlineHeart } from "react-icons/ai";
import numeral from "numeral";

import CategoryTag from "./CategoryTag";
import { displayPost } from "../store/usePostsStore";

type Props = {
	post: displayPost;
};

const PostCard = ({ post }: Props) => {
	const navigate = useNavigate();

	const handleOpenPost = () => {
		const postURL = `/post/${post._id}`;
		navigate(postURL);
	};

	return (
		<div
			className={`m-4 mx-auto shadow-md shadow-foreground/10 border border-foreground/5 bg-foreground/5 overflow-clip rounded-2xl flex flex-col w-full h-[450px] `}
		>
			<img
				src={post.bannerURL}
				alt=""
				className="m-2 rounded-2xl object-cover h-[200px]"
			/>
			<div
				className="p-2 m-2 flex flex-col grow gap-6 justify-between"
				onClick={handleOpenPost}
			>
				<div className="flex flex-col gap-3 text-xs">
					<div className="text-gray-400 flex items-center justify-between">
						<div>{post.authorUsername}</div>
						<div>
							{format(parseISO(post.createdAt), "do MMMM, yyyy")}
						</div>
					</div>

					<div className="items-start flex justify-between text-primary text-2xl font-semibold">
						<h2 className="break-words max-w-[4/5] font-primary-font">
							{post.title.slice(0, 45)} ...
						</h2>
					</div>

					<p className="text-sm text-gray-300 font-secondary-font">
						{post.description.slice(0, 100)} ...
					</p>
				</div>
				<div className="flex">
					<div className="flex flex-wrap gap-2 w-3/4">
						{post.tags.slice(0, 2).map((category, index) => (
							<CategoryTag
								category={category}
								key={index}
								index={index}
							/>
						))}
					</div>
					<div className="flex gap-4 w-1/4 justify-end">
						<div className="flex items-center gap-1">
							<AiOutlineHeart />
							<span>{numeral(post.likesCount).format("0a")}</span>
						</div>{" "}
						<div className="flex items-center gap-1">
							<AiOutlineComment />
							<span>
								{numeral(post.commentsCount).format("0a")}
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default PostCard;
