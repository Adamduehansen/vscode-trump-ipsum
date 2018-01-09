/**
 * Removes element tags and whitespace from the passed string.
 * 
 * @param paragraphs  The string value to clean.
 */
export function removeTagsAndWhitespace(paragraphs: string) {
  paragraphs = paragraphs.replace(/<\/?[^>]+(>|$)/g, "")
  paragraphs = paragraphs.replace(/ +(?= )/g,"")
  return paragraphs
}