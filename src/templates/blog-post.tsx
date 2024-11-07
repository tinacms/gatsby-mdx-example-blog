import dateFormat from "dateformat"
import { graphql, Link } from "gatsby"
import * as React from "react"
import { tinaField, useTina } from "tinacms/dist/react"
import { TinaMarkdown } from "tinacms/dist/rich-text"
import client from "../../tina/__generated__/client"
import Bio from "../components/bio"
import Layout from "../components/layout"
import Seo from "../components/seo"

import { BlogPost, PostResponse } from "../types"

const BlogPostTemplate = ({ serverData, data: { site }, location }) => {
  console.log("serverData", serverData)

  const { query, variables, nextPageData, previousPageData } = serverData
  const { data: tinaData } = useTina({
    data: serverData.data,
    query,
    variables,
  })
  console.log("tinaData", tinaData)
  const siteTitle = site.siteMetadata?.title || `Title`
  const [formattedDate, setFormattedDate] = React.useState(
    dateFormat(tinaData.post.date, "mmmm dd, yyyy")
  )
  React.useEffect(() => {
    console.log("tinaData.post.date", tinaData.post.date)
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
          <TinaMarkdown content={tinaData.post.body} />
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
  console.log("serverData", serverData)

  const { title, description } = serverData.data
  return <Seo title={title} description={description} />
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

type BlogPostPageProps = {
  pageContext: BlogPostPageContext
}

type BlogPostPageContext = {
  relativePath: string
  previousPostPath: string
  nextPostPath: string
}

const mapToPostLinkData = (
  response: PostResponse
): Partial<BlogPost> & { slug: string; title: string } => {
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
