import client from "../tina/__generated__/client"
import { Post } from "../tina/__generated__/types"
type PostResponse = Awaited<ReturnType<typeof client.queries.post>>
type AllPostResponse = Awaited<ReturnType<typeof client.queries.postConnection>>
type BlogPost = Partial<Post> & {
  slug: string
  relativePath: string
}
type BlogPostPageProps = {
  pageContext: BlogPostPageContext
}

type BlogPostPageContext = {
  relativePath: string
  previousPostPath: string
  nextPostPath: string
}

export {
  AllPostResponse,
  BlogPost,
  BlogPostPageContext,
  BlogPostPageProps,
  PostResponse,
}
