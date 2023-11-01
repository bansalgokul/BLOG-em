import { useState, memo } from "react";
import { Input } from "../@/components/ui/input";
import { Button } from "../@/components/ui/button";
import { UseFormReturn } from "react-hook-form";

const TagsInput = memo(
	({
		form,
	}: {
		form: UseFormReturn<{
			title: string;
			description: string;
			content: string;
			tags: string[];
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			banner?: any;
		}>;
	}) => {
		const [tagInput, setTagInput] = useState("");

		const addTag = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
			if (tagInput.trim() === "") return; // Do not add empty tags
			e.preventDefault(); // Prevent the form from submitting
			form.setValue("tags", [...form.getValues("tags"), tagInput]);
			setTagInput("");
		};

		const removeTag = (
			e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
			index: number
		) => {
			const newTags = [...form.getValues("tags")];
			e.preventDefault(); // Prevent the form from submitting
			newTags.splice(index, 1);
			form.setValue("tags", newTags);
		};

		return (
			<div className="space-y-4">
				<div className="flex items-center space-x-2">
					<Input
						type="text"
						placeholder="Add a tag"
						value={tagInput}
						onChange={(e) => setTagInput(e.target.value)}
					/>
					<Button onClick={(e) => addTag(e)}>Add Tag</Button>
				</div>
				<div className="space-x-2">
					{form.getValues("tags").map((tag, index) => (
						<span
							key={index}
							className="px-2 py-1 bg-gray-300 text-gray-700 rounded-full"
						>
							{tag}
							<button
								className="ml-2 text-red-600"
								onClick={(e) => removeTag(e, index)}
							>
								Remove
							</button>
						</span>
					))}
				</div>
			</div>
		);
	}
);

export default TagsInput;
