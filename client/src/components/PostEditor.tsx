import ReactQuill from "react-quill"
import "react-quill/dist/quill.snow.css"
import usePostStore from "../store/usePostStore"
import z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "../@/components/ui/button"
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "../@/components/ui/form"
import { Input } from "../@/components/ui/input"
import TagsInput from "./TagsInput"

const modules = {
	toolbar: [
		[{ font: [] }],
		[{ header: [1, 2, 3, 4, 5, 6, false] }],
		["bold", "italic", "underline", "strike"],
		[{ color: [] }, { background: [] }],
		[{ script: "sub" }, { script: "super" }],
		["blockquote", "code-block"],
		[{ list: "ordered" }, { list: "bullet" }],
		[{ indent: "-1" }, { indent: "+1" }, { align: [] }],
		["link", "image"],
		["clean"],
	],
}

const formSchema = z.object({
	title: z.string().min(2).max(50),
	banner: z.any(),
	description: z.string().min(2).max(50),
	content: z.string(),
	tags: z.array(z.string()).max(2),
})

const PostEditor = () => {
	const { createPost } = usePostStore()

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: "",
			banner: undefined,
			description: "",
			content: "Enter  your blog content",
			tags: [],
		},
	})

	function onSubmit(values: z.infer<typeof formSchema>) {
		const formData = new FormData()
		formData.append("title", values.title)
		if (values.banner) {
			formData.append("banner", values.banner)
		}
		formData.append("description", values.description)
		formData.append("content", values.content)
		formData.append("tags", JSON.stringify(values.tags))
		createPost(formData)
		for (const pair of formData.entries()) {
			console.log(`${pair[0]}, ${pair[1]}`)
		}
	}

	return (
		<Form {...form}>
			<form
				id="post"
				onSubmit={form.handleSubmit(onSubmit)}
				className="space-y-8 text-foreground"
			>
				<FormField
					control={form.control}
					name="title"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="hidden">Title</FormLabel>
							<FormControl>
								<Input
									className="text-2xl h-12"
									placeholder="Title"
									{...field}
								/>
							</FormControl>
							<FormDescription className="hidden">
								Blog Title.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="description"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="hidden">
								Description
							</FormLabel>
							<FormControl>
								<Input
									// className="text-2xl h-12"
									placeholder="Description"
									{...field}
								/>
							</FormControl>
							<FormDescription className="hidden">
								Blog Description.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="banner"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="hidden">Banner</FormLabel>
							<FormControl>
								<Input
									type="file"
									placeholder="Banner"
									{...field}
									value={
										form.getValues("banner")?.originalName
									}
									onChange={(e) => {
										form.setValue(
											"banner",
											e.target.files?.[0]
										)
									}}
								/>
							</FormControl>
							<FormDescription className="hidden">
								Blog Banner.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="content"
					render={() => (
						<FormItem>
							<FormLabel className="hidden">Content</FormLabel>
							<FormControl>
								<ReactQuill
									className="text-white"
									theme="snow"
									placeholder="Content"
									modules={modules}
									value={form.getValues("content")}
									onChange={(value) =>
										form.setValue("content", value)
									}
								/>
							</FormControl>
							<FormDescription className="hidden">
								Blog Content.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<TagsInput form={form} />

				<Button type="submit" form="post">
					Submit
				</Button>
			</form>
		</Form>
	)
}

export default PostEditor
