type Props = {
	category: string;
	index: number;
};

const CategoryTag = ({ category }: Props) => {
	return (
		<div className={`px-5 text-xs py-2 rounded-full bg-foreground/20`}>
			{category}
		</div>
	);
};

export default CategoryTag;
