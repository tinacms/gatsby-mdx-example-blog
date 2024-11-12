type AllPageData = {
  allMdx: {
    nodes: PageData[]
  }
}

type PageData = {
  id: string
  internal: {
    contentFilePath: string
  }
  fields: {
    slug: string
  }
}

export { AllPageData, PageData }
