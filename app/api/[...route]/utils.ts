import { format } from "sharp"
import { DEFAULT_OPTIONS } from "./constants"

const isValidKey = (key: string) => {
  return Object.keys(DEFAULT_OPTIONS).includes(key)
}

export const stringToFormat = (formatString: string) => {
  switch (formatString) {
    case 'jpg':
      return format.jpg

    case 'png':
      return format.png;

    case 'avif':
      return format.avif;

    case 'webp':
      return format.webp

    default:
      return format.jpeg
  }
}

export const parseOptions = (optionsString: string) => {
  const options = DEFAULT_OPTIONS

  if (optionsString === "") return options;

  const optArr = optionsString.split(',')
  if (optArr.length > 10) return DEFAULT_OPTIONS;

  for (const opt of optArr) {
    const [key, value, ..._] = opt.split('=')

    if (key === "format") {
      options["format"] = stringToFormat(value)
      continue
    }
    
    if (isValidKey(key)) {
      // @ts-expect-error any
      options[key] = value
    }
  }

  return options
}