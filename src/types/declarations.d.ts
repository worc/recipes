// esbuild's `file` loader: importing one of these gives back its hashed URL under /public/
declare module '*.md' {
  const url: string
  export default url
}

declare module '*.jpg' {
  const url: string
  export default url
}

declare module '*.jpeg' {
  const url: string
  export default url
}

declare module '*.png' {
  const url: string
  export default url
}

declare module '*.webp' {
  const url: string
  export default url
}
