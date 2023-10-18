import axios from 'axios'
import fm from 'frontmatter-js'
import { useEffect, useState } from 'react'

export function useResource (url: string) {
  const [markdown, setMarkdown] = useState(null)
  debugger
  useEffect(() => {
    axios.get(url).then(response => {
      const parsedContent = fm({ content: response.data })
      setMarkdown(parsedContent)
    })
  }, [url])

  return markdown
}
