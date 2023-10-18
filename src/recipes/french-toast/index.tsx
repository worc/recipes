import React from 'react'
import markdown from './french-toast.md'
import { useResource } from '../../hooks/useResource'
import MarkdownRecipe from '../../components/MarkdownRecipe'

export default function Index () {
  const content = useResource(markdown)

  return (
    <MarkdownRecipe content={content}/>
  )
}
