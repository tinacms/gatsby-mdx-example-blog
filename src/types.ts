import client from "../tina/__generated__/client"
import { Post } from "../tina/__generated__/types"

type PostResponse = Awaited<ReturnType<typeof client.queries.post>>
type AllPostResponse = Awaited<ReturnType<typeof client.queries.postConnection>>
type BlogPost = Post & {
  slug: string
  relativePath: string
}

export { AllPostResponse, BlogPost, PostResponse }
