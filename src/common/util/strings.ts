// This is a helper for creating strings files. For example, see App.strings.ts.
// Usage:
//
// First create a map:
// const map = {
//   hello: 'Hello',
//   helloName: (name: string) => 'Hello, ' + name
// }
//
// Then feed that into strings and return the result
//
// export default strings(map)
//
// Then after importing it from another module,
//
// strings('hello')
// strings('helloName', 'Jessica')

const strings = <TMap extends { [key: string]: Function | string }>(map: TMap) => (key: keyof TMap, ...args: any[]): string => {
  if (args.length) return (map[key] as Function).apply(null, args)
  else return map[key] as string
}

export default strings
