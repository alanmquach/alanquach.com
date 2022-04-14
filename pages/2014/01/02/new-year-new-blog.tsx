import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

import { remark } from 'remark'
import html from 'remark-html'
import Link from 'next/link'

const postsDirectory = path.join(process.cwd(), 'posts')

export async function getStaticProps() {
  const fullPath = path.join(postsDirectory, `2014-01-01-new-year-new-blog.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents)

  // Use remark to convert markdown into HTML string
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content)
  const contentHtml = processedContent.toString()

  // Combine the data with the id and contentHtml
  return {
    props: {
      contentHtml,
      ...matterResult.data
    }
  }
}

function NewYearNewBlog({ contentHtml, title }: { contentHtml: string, title: string }) {
  return (
    <div className="content">
      <div className="post">
        <h1><Link href="/2014/01/02/new-year-new-blog">{title}</Link></h1>
        <div dangerouslySetInnerHTML={{ __html: contentHtml }}></div>
      </div>
    </div>
  )
}

export default NewYearNewBlog