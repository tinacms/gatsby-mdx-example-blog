import { Link, graphql } from "gatsby"
import * as React from "react"

import formatDate from "dateformat"
import client from "../../tina/__generated__/client"
import Bio from "../components/bio"
import Layout from "../components/layout"
import Seo from "../components/seo"

const BlogIndex = ({ data, location, serverData }) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`
  const posts = serverData.posts

  if (posts.length === 0) {
    return (
      <Layout location={location} title={siteTitle}>
        <Bio />
        <p>
          No blog posts found. Add markdown posts to "content/blog" (or the
          directory you specified for the "gatsby-source-filesystem" plugin in
          gatsby-config.js).
        </p>
      </Layout>
    )
  }

  return (
    <Layout location={location} title={siteTitle}>
      <Bio />
      <ol style={{ listStyle: `none` }}>
        {posts.map(post => {
          const title = post.title || post.slug
          const formattedDate = formatDate(post.date, "mmmm mm, yyyy")

          return (
            <li key={post.slug}>
              <article
                className="post-list-item"
                itemScope
                itemType="http://schema.org/Article"
              >
                <header>
                  <h2>
                    <Link to={post.slug} itemProp="url">
                      <span itemProp="headline">{title}</span>
                    </Link>
                  </h2>
                  <small>{formattedDate}</small>
                </header>
                <section>
                  <p
                    dangerouslySetInnerHTML={{
                      __html: post.description,
                    }}
                    itemProp="description"
                  />
                </section>
              </article>
            </li>
          )
        })}
      </ol>
    </Layout>
  )
}

export default BlogIndex

/**
 * Head export to define metadata for the page
 *
 * See: https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-head/
 */
export const Head = () => <Seo title="All posts" />

export const pageQuery = graphql`
  {
    site {
      siteMetadata {
        title
      }
    }
  }
`

export async function getServerData() {
  const posts = await client.queries.postConnection()
  return {
    props: {
      posts: posts.data.postConnection.edges.map(edge => {
        const {
          title,
          body,
          date,
          _sys: { breadcrumbs },
          description,
        } = edge.node
        return { title, body, date, slug: breadcrumbs[0], description }
      }),
    },
  }
}
