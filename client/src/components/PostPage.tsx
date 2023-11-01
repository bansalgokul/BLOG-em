import { format, parseISO } from "date-fns";
import CategoryTag from "./CategoryTag";
import { useEffect } from "react";
import { ClipLoader } from "react-spinners";
import { useParams } from "react-router-dom";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import usePostStore from "../store/usePostStore";

const PostPage = () => {
	const { post, fetchPost, likePost, loading } = usePostStore();
	const id = useParams().id || "";

	useEffect(() => {
		fetchPost(id);
	}, [fetchPost, id]);

	const handleLikePost = () => {
		likePost();
	};

	return (
		<section className="p-4 sm:px-8">
			{loading ? (
				<ClipLoader />
			) : (
				post && (
					<div className="max-w-3xl m-auto flex flex-col gap-6">
						<h1 className="text-4xl font-medium">{post.title}</h1>
						<div className="bg-[#2a2a2a] px-4 py-2 rounded-xl text-purple-text text-lg font-semibold flex items-center gap-8">
							<span>
								{format(
									parseISO(post.createdAt),
									"do MMMM,yyyy"
								)}
							</span>
							<span>{post.authorUsername}</span>
							{post.likedByUser ? (
								<button onClick={handleLikePost}>
									<AiFillHeart />
								</button>
							) : (
								<button onClick={handleLikePost}>
									<AiOutlineHeart />
								</button>
							)}
						</div>
						<img
							src={post.bannerURL}
							alt={post.title}
							className="max-h-[300px] w-full rounded-xl brightness-75"
						/>
						<div
							className="content-container"
							dangerouslySetInnerHTML={{ __html: post.content }}
						></div>
						<div className="flex flex-wrap gap-2">
							{post.tags.map((category, index) => (
								<CategoryTag
									category={category}
									key={index}
									index={index}
								/>
							))}
						</div>
					</div>
				)
			)}
		</section>
	);
};

export default PostPage;
