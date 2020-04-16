const withoutPropagation = (fn: Function) => (e: React.SyntheticEvent) => {
  e.preventDefault()
  e.stopPropagation()
  fn()
}

export default withoutPropagation
