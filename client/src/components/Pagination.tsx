import {
	MdOutlineArrowBackIos,
	MdOutlineArrowForwardIos,
} from "react-icons/md";

type Props = {
	totalItems: number;
	currentPage: number;
	handlePageChange: (page: number) => void;
};

const Pagination = ({ totalItems, currentPage, handlePageChange }: Props) => {
	// to get array of page numbers to display
	const paginationRange = createPageNumbers(totalItems, currentPage);

	// handle click on next page button
	const nextPage = () => {
		handlePageChange(currentPage + 1);
	};

	// handle click on prev page button
	const prevPage = () => {
		handlePageChange(currentPage - 1);
	};

	const currentPageNumberStyle =
		"bg-[#F9F5FF] text-black w-[2rem] h-[2rem] rounded-full";
	const PageNumberStyle = "text-white w-[2rem] h-[2rem] rounded-md";

	return (
		<div className="flex flex-wrap  items-center justify-center gap-2">
			{/* Prev Page Button */}
			{currentPage == 1 || (
				<button onClick={prevPage}>
					<MdOutlineArrowBackIos />
				</button>
			)}
			<div className="flex items-center">
				{paginationRange.map((pageNo, index) => {
					// Print ... to show the range
					if (pageNo === -1) {
						return (
							<button className={PageNumberStyle} disabled>
								...
							</button>
						);
					} else {
						return (
							<div
								key={index}
								onClick={() => {
									handlePageChange(pageNo);
								}}
							>
								<button
									className={
										currentPage === pageNo
											? currentPageNumberStyle
											: PageNumberStyle
									}
								>
									{pageNo.toString()}
								</button>
							</div>
						);
					}
				})}
			</div>

			{currentPage === paginationRange[paginationRange.length - 1] || (
				<button className={PageNumberStyle} onClick={nextPage}>
					<MdOutlineArrowForwardIos />
				</button>
			)}
		</div>
	);
};

export default Pagination;

// function to create a array with values from start to end
const range = (start: number, end: number): number[] => {
	const length = end - start + 1;
	return Array.from({ length }, (_, idx) => idx + start);
};

// function to determine where to skip value and display ...
const createPageNumbers = (
	totalItems: number,
	currentPage: number
): number[] => {
	const totalPages = Math.ceil(totalItems / 10);

	if (totalPages <= 5) {
		return range(1, totalPages);
	}

	const leftSiblingIndex = Math.max(
		Math.min(totalPages - 3, currentPage - 1),
		1
	);
	const rightSiblingIndex = Math.min(
		Math.max(4, currentPage + 1),
		totalPages
	);

	const showLeftDots = leftSiblingIndex >= 3;
	const showRightDots = rightSiblingIndex < totalPages - 1;

	console.log(leftSiblingIndex, showLeftDots);

	if (showLeftDots && showRightDots) {
		const middleRange = range(leftSiblingIndex, rightSiblingIndex);
		return [1, -1, ...middleRange, -1, totalPages];
	} else if (!showLeftDots && showRightDots) {
		const middleRange = range(1, rightSiblingIndex);
		return [...middleRange, -1, totalPages - 1, totalPages];
	} else if (showLeftDots && !showRightDots) {
		const middleRange = range(leftSiblingIndex, totalPages);
		return [1, 2, -1, ...middleRange];
	}

	return range(1, totalPages);
};
