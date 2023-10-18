import React from 'react'
import ReactMarkdown from 'react-markdown'

interface Props {
  content?: {
    frontmatter?: Record<string, string>
    body: string,
  }
}

export default function MarkdownRecipe (props: Props) {
  const { content } = props

  if (content) {
    return (
      <>
        <div>
          <div>{ JSON.stringify(content.frontmatter, null, 2) }</div>
          <ReactMarkdown>{content.body}</ReactMarkdown>
        </div>
      </>
    )
  } else {
    return null
  }
}
