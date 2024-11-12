import dateFormat from "dateformat"
import { Link, graphql } from "gatsby"
import * as React from "react"
import { tinaField, useTina } from "tinacms/dist/react"
import { TinaMarkdown } from "tinacms/dist/rich-text"
import client from "../../tina/__generated__/client"
import { Post } from "../../tina/__generated__/types"
import Bio from "../components/bio"
import Layout from "../components/layout"
import Seo from "../components/seo"
import { BlogPostPageProps, PostResponse } from "../types"

const BlogPostTemplate = ({ serverData, data: { site }, location }) => {
  const { query, variables, nextPageData, previousPageData } = serverData
  const { data: tinaData } = useTina({
    data: serverData.data,
    query,
    variables,
  })
  const siteTitle = site.siteMetadata?.title || `Title`

  const [formattedDate, setFormattedDate] = React.useState(
    dateFormat(tinaData.post.date, "mmmm dd, yyyy")
  )
  React.useEffect(() => {
    setFormattedDate(dateFormat(tinaData.post.date, "mmmm dd, yyyy"))
  }, [tinaData.post.date])

  return (
    <Layout location={location} title={siteTitle}>
      <article
        className="blog-post"
        itemScope
        itemType="http://schema.org/Article"
      >
        <header>
          <h1
            data-tina-field={tinaField(tinaData.post, "title")}
            itemProp="headline"
          >
            {tinaData.post.title}
          </h1>
          <p data-tina-field={tinaField(tinaData.post, "date")}>
            {formattedDate}
          </p>
        </header>
        <main data-tina-field={tinaField(tinaData.post, "body")}>
          <TinaMarkdown content={tinaData.post.body} components={components} />
        </main>
        <hr />
        <footer>
          <Bio />
        </footer>
      </article>
      <nav className="blog-post-nav">
        <ul
          style={{
            display: `flex`,
            flexWrap: `wrap`,
            justifyContent: `space-between`,
            listStyle: `none`,
            padding: 0,
          }}
        >
          <li>
            {previousPageData && (
              <Link to={previousPageData.slug} rel="prev">
                ← {previousPageData.title}
              </Link>
            )}
          </li>
          <li>
            {nextPageData && (
              <Link to={nextPageData.slug} rel="next">
                {nextPageData.title} →
              </Link>
            )}
          </li>
        </ul>
      </nav>
    </Layout>
  )
}

export const Head = ({ serverData }) => {
  return (
    <Seo
      title={serverData.data.post.title}
      description={serverData.data.description}
    />
  )
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`

const mapToPostLinkData = (
  response: PostResponse
): Partial<Post> & { slug: string; title: string } => {
  return {
    title: response.data.post.title,
    slug: response.data.post._sys.breadcrumbs[0],
  }
}

const getPostLinkData = async (path: string) => {
  if (!path) return null
  const post = await client.queries.post({
    relativePath: path,
  })
  return mapToPostLinkData(post)
}

export async function getServerData({ pageContext }: BlogPostPageProps) {
  const { relativePath, nextPostPath, previousPostPath } = pageContext
  const { data, query, variables }: PostResponse = await client.queries.post({
    relativePath: relativePath,
  })
  const nextPageData = await getPostLinkData(nextPostPath)
  const previousPageData = await getPostLinkData(previousPostPath)
  return {
    props: {
      query,
      data,
      variables,
      nextPageData,
      previousPageData,
    },
  }
}
const components = {
  RichBlockQuote: props => {
    return (
      <blockquote>
        <TinaMarkdown content={props.children} />
      </blockquote>
    )
  },
}
