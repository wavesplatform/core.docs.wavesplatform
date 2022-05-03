const Fuse = require('fuse.js');
const options = {
  keys: ['value'],
  tokenize: /*true*/true,
  matchAllTokens: true,
  shouldSort: true,
  findAllMatches: true,
  includeScore: true,
  includeMatches: true,
  maxPatternLength: 32,
  useExtendedSearch: true,
}

module.exports = (text, indices, searchQueryString = null) => {
  const arrayWithSplitText = [];

  if (Array.isArray(indices) && searchQueryString) {
    const words = []
    indices.forEach((index) => words.push({value: text.substring(index[0], index[1]), indices: index}))
    const fuse = new Fuse(words, options)
    const result = fuse.search(searchQueryString)
    console.log(result)
    indices = [result[0].item.indices]
  }

  indices.forEach((index, indexNumber) => {
    if(indexNumber === 0) {
      const start = index[0];
      const end = index[1];
      arrayWithSplitText.push(
        text.substring(0, start),
        [text.substring(start, end + 1)],
        text.substring(end + 1, text.length)
      )
    }
    // const textLength = text.length;
    // const lastIndex = text.length - 1;
    // const previousIndex = indices[indexNumber - 1] || [0, 0];
    // const previousIndexEnd = previousIndex[1];
    // const start = index[0];
    // const end = index[1];
    //
    // if(previousIndexEnd + start > 0) {
    //     arrayWithSplitText.push(
    //         text.substring(previousIndexEnd + (indexNumber === 0 ? 0 : 1), start),
    //     )
    // }
    // arrayWithSplitText.push(
    //     [text.substring(start, end + 1)]
    // )
    // if(indexNumber === indices.length - 1 && end < lastIndex) {
    //     arrayWithSplitText.push(
    //         text.substring(end + 1, textLength)
    //     )
    // }
  });
  return arrayWithSplitText;
}
