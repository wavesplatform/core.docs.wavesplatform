const textLeftRightRangeLength = 150;
const cutStringForSide = (side, string, textSubstringLength) => {
  const textLength = string.length;
  if(side === 'left') {
    // if(textSubstringLength * 2 > textLength) {
    //     textSubstringLength = Math.floor(textLength / 2)
    // }
    string = string.substr(-textSubstringLength);
  } else {
    // if(textSubstringLength * 2 > textLength) {
    //     textSubstringLength = Math.ceil(textLength / 2)
    // }
    string = string.substring(0, textSubstringLength)
  }
  return string;
};
module.exports = (array) => {
  let group = [];
  let lastElementFromLatestGroup = '';

  // const leftPart = array[0];
  // const leftPartLength = leftPart.length;
  // let leftPartCutLength = textLeftRightRangeLength;
  // const matchedPart = array[1];
  // const rightPart = array[2];
  // const rightPartLength = rightPart.length;
  // let rightPartCutLength = textLeftRightRangeLength;
  //
  // if(leftPartLength < leftPartCutLength) {
  //     rightPartCutLength += leftPartCutLength - leftPartLength;
  // }
  //
  // if(rightPartLength < rightPartCutLength) {
  //     leftPartCutLength += rightPartCutLength - rightPartLength;
  // }
  // console.log('leftPart:', leftPart, matchedPart, rightPart, rightPartCutLength, leftPartCutLength);
  //
  // console.log(`cutStringForSide('left', leftPart, leftPartCutLength):`, cutStringForSide('left', leftPart, leftPartCutLength))
  // return [
  //     cutStringForSide('left', leftPart, leftPartCutLength),
  //     matchedPart,
  //     cutStringForSide('right', rightPart, rightPartCutLength),
  // ]
  // let additionSubstringLength

  return array.reduce((accumulator, element, elementIndex) => {

    const isElementArray = Array.isArray(element);

    if(elementIndex === 0 && isElementArray) {
      group.push('');
    }

    let textSubstring = element;

    if(isElementArray) {
      group.push(element);
    } else {
      let side = '';

      /*left side*/
      if(group.length <= 1) {
        side = 'left';
        /*ride side*/
      } else {
        side = 'right';

      }
      textSubstring = cutStringForSide(side, textSubstring, textLeftRightRangeLength);

      const substringTextLength = textSubstring.length;

      if(substringTextLength < textLeftRightRangeLength) {
        textSubstring = cutStringForSide(side, textSubstring, textLeftRightRangeLength);
      }
      group.push(textSubstring)
    }

    if(group.length > 2) {
      accumulator.push(group);

      lastElementFromLatestGroup = element;

      if(!isElementArray) {
        element = cutStringForSide('left', element);
      }

      group = [
        element
      ];
    }
    return accumulator;
  }, []);
}
