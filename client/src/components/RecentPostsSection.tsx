import { useEffect } from "react";
import Pagination from "./Pagination";
import PostCard from "./PostCard";
import { ClipLoader } from "react-spinners";
import usePostsStore from "../store/usePostsStore";

const RecentPostsSection = () => {
	const {
		posts,
		fetchPosts,
		searchQuery,
		loading,
		page,
		totalPosts,
		setPage,
	} = usePostsStore();

	const handlePageChange = (page: number) => {
		setPage(page);
	};

	useEffect(() => {
		fetchPosts();
	}, [fetchPosts, page, searchQuery]);

	return (
		<section className="py-4">
			{loading ? (
				<ClipLoader />
			) : (
				<div className="px-8 flex flex-col ">
					<div className=" mb-4 grid grid-cols-1 sm:grid-cols-2 sm:gap-8 md:grid-cols-3 ">
						{posts.map((post) => (
							<PostCard post={post} key={post._id} />
						))}
					</div>
					<Pagination
						currentPage={page}
						totalItems={totalPosts}
						handlePageChange={handlePageChange}
					/>
				</div>
			)}
		</section>
	);
};

export default RecentPostsSection;
