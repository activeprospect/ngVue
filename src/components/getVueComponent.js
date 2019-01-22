export default function getVueComponent (name, $injector) {
  if (typeof name === 'string') {
    return $injector.get(name)
  } else {
    return name
  }
}
