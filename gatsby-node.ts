/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-node/
 */
import express from "express"
import { GatsbyNode } from "gatsby"
import path from "path"
import client from "./tina/__generated__/client"
import { Post } from "./tina/__generated__/types"

// Define the template for blog post
const blogPost = path.resolve(`./src/templates/blog-post.tsx`)

type BlogPost = Post & {
  slug: string
  relativePath: string
}

const mapResponse = (postResponse: any): BlogPost[] => {
  const mappedResponse = postResponse.data.postConnection.edges.map(edge => {
    console.log(edge.node)
    const {
      title,
      body,
      _sys: { breadcrumbs, relativePath },
    } = edge.node
    return {
      relativePath,
      title,
      body,
      slug: breadcrumbs[0],
    }
  })
  return mappedResponse
}

export const createPages: GatsbyNode["createPages"] = async ({
  graphql,
  actions,
  reporter,
}) => {
  const { createPage } = actions

  const result = await client.queries.postConnection()
  const posts: BlogPost[] = mapResponse(result)

  // Get all markdown blog posts sorted by date

  // const result = await graphql<mdxResponse>(`
  //   {
  //     allMdx(sort: { frontmatter: { date: ASC } }, limit: 1000) {
  //       nodes {
  //         id
  //         internal {
  //           contentFilePath
  //         }
  //         fields {
  //           slug
  //         }
  //       }
  //     }
  //   }
  // `)

  // if (result.errors) {
  //   reporter.panicOnBuild(
  //     `There was an error loading your blog posts`,
  //     result.errors
  //   )
  //   return
  // }

  // const posts = result!.data!.allMdx.nodes

  // Create blog posts pages
  // But only if there's at least one markdown file found at "content/blog" (defined in gatsby-config.js)
  // `context` is available in the template as a prop and as a variable in GraphQL

  // if (posts.length > 0) {
  //   posts.forEach((post, index) => {
  //     const previousPostId = index === 0 ? null : posts[index - 1].id
  //     const nextPostId = index === posts.length - 1 ? null : posts[index + 1].id

  //     createPage({
  //       path: post.fields.slug,
  //       component: `${blogPost}?__contentFilePath=${post.internal.contentFilePath}`,
  //       context: {
  //         id: post.id,
  //         previousPostId,
  //         nextPostId,
  //       },
  //     })
  //   })
  // }

  posts.map((post, index) => {
    if (posts.length > 0) {
      const previousPostPath =
        index === 0 ? null : posts[index - 1].relativePath
      const nextPostPath =
        index === posts.length - 1 ? null : posts[index + 1].id
      createPage({
        path: post.slug,
        component: blogPost,
        context: {
          relativePath: post.relativePath,
          previousPostPath,
          nextPostPath,
        },
      })
    }
  })
}

// export const onCreateNode = ({ node, actions, getNode }) => {
//   const { createNodeField } = actions

//   if (node.internal.type === `Mdx`) {
//     const value = createFilePath({ node, getNode })

//     createNodeField({
//       name: `slug`,
//       node,
//       value,
//     })
//   }
// }

export const onCreateDevServer = ({ app }) => {
  app.use("/admin", express.static("public/admin"))
}

/**
 * @type {import('gatsby').GatsbyNode['createSchemaCustomization']}
 */
// export const createSchemaCustomization = ({ actions }) => {
//   const { createTypes } = actions

//   // Explicitly define the siteMetadata {} object
//   // This way those will always be defined even if removed from gatsby-config.js

//   // Also explicitly define the Markdown frontmatter
//   // This way the "MarkdownRemark" queries will return `null` even when no
//   // blog posts are stored inside "content/blog" instead of returning an error
//   createTypes(`
//     type SiteSiteMetadata {
//       author: Author
//       siteUrl: String
//       social: Social
//     }

//     type Author {
//       name: String
//       summary: String
//     }

//     type Social {
//       twitter: String
//     }

//     type Mdx implements Node {
//       frontmatter: Frontmatter
//       fields: Fields
//     }

//     type Frontmatter {
//       title: String
//       description: String
//       date: Date @dateformat
//     }

//     type Fields {
//       slug: String
//     }
//   `)
// }
