import React from 'react'
import markdown from './tom-kha-gai.md'
import { useResource } from '../../hooks/useResource'
import MarkdownRecipe from '../../components/MarkdownRecipe'

export default function Index () {
  const content = useResource(markdown)

  return (
    <MarkdownRecipe content={content}/>
  )
}
