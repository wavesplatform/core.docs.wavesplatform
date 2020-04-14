const processEnv = process.env;
const envIsDev = processEnv.isDev;
const fs = require('fs');
const Fuse = require('fuse.js');
const GetParsePagesQueue = require('./getParsePagesQueue');
const textHighlightMarkup = require('./textHighlightMarkup');
const formattedAndGroupSearchResults = require('./formattedAndGroupSearchResults');
const vuepressPagesInParsedQueueCount = 20;
const fuseOptions = {
    // include: ['score', 'matches'],
    // keys: [{
    //     name: 'title',
    //     weight: 0.1
    // }, {
    //     name: '_content',
    //     weight: 0.1
    // }],
    // keys: [
    //     "title",
    //     "author.firstName"
    // ]
    // id: 'ISBN'
    keys: ['title', 'content'],
    tokenize: /*true*/true,
    matchAllTokens: true,
    shouldSort: true,
    findAllMatches: true,
    includeScore: true,
    includeMatches: true,
    threshold: 0.01,
    location: 0,
    distance: 100000,
    maxPatternLength: 32,
    minMatchCharLength: 4,
    // caseSensitive: true,
    useExtendedSearch: true,
};
const findItemForSendingLimit = 40;


module.exports = async function(vuepressDestPath) {
    const getParsePagesQueue = GetParsePagesQueue(vuepressDestPath);

    const vuepressPagesParamsListString = fs.readFileSync(`${vuepressDestPath}/documentation-files-map.json`).toString();

    let vuepressPagesParamsList = null;

    try {
        vuepressPagesParamsList = JSON.parse(vuepressPagesParamsListString);
    } catch (error) {
        console.error(error);
    }

    if(!vuepressPagesParamsList) {
        console.error('Vuepress pages list with paths not found');
        return;
    }
    const vuepressPages = {};

    const vuepressPagesParamsListLength = vuepressPagesParamsList.length;


    for(let vuepressPageParamsIndex = 0; vuepressPageParamsIndex < vuepressPagesParamsListLength;) {
        let end = vuepressPageParamsIndex + vuepressPagesInParsedQueueCount;
        if(end > vuepressPagesParamsListLength) {
            end = vuepressPagesParamsListLength
        }
        await Promise.all(
          getParsePagesQueue(vuepressPages, vuepressPagesParamsList, vuepressPageParamsIndex, end)
        );
        if(end === vuepressPagesParamsListLength) {
            break;
        }
        vuepressPageParamsIndex = end;
    }
    // let sortedPagesContentByLocalePath = vuepressPages.reduce((accumulator, page) => {
    //     const pageLocalePath = page.localePath;
    //     const accumulatorLocalePath = accumulator[pageLocalePath];
    //     if(!accumulatorLocalePath) {
    //         accumulator[pageLocalePath] = [];
    //     }
    //     accumulator[pageLocalePath].push(page);
    //     return accumulator;
    // }, {});

    const fuses = Object.entries(vuepressPages).reduce((accumulator, vuepressPagesEntry) => {
        const vuepressPagesKey = vuepressPagesEntry[0];
        const vuepressPagesValue = vuepressPagesEntry[1];
        accumulator[vuepressPagesKey] = new Fuse(Object.values(vuepressPagesValue), fuseOptions);
        return accumulator;
    }, {});

    console.log('fuses:', fuses);

    return (searchQueryString, searchLocale) => {
        const fuse = fuses[searchLocale];
        if(!fuse) {
            return {
                error: '!searchLocale',
            }
        }
        const fuseSearchResult = fuse.search(searchQueryString);

        const dataPreparedForSending = fuseSearchResult.map(page => {
                const matches = page.matches;

                const titleMatches = matches.find(item => item.key === 'title');
                const contentMatches = matches.find(item => item.key === 'content');

                let titleMatchesFormattedString = '';
                if(titleMatches) {
                    titleMatchesFormattedString = textHighlightMarkup(titleMatches.value, titleMatches.indices);

                }

                let contentMatchesFormattedString = '';
                if(contentMatches) {
                    contentMatchesFormattedString = textHighlightMarkup(contentMatches.value, contentMatches.indices);
                    contentMatchesFormattedString = formattedAndGroupSearchResults(
                        contentMatchesFormattedString
                    );
                }

                const contentMatchesFormattedStringLimited = contentMatchesFormattedString.slice(0, 1);

                return {
                    path: page.item.path,
                    localePath: page.localePath,
                    allMatchesLength: fuseSearchResult.length,
                    matches: {
                        title: titleMatchesFormattedString || [page.item.title],
                        content: /*contentMatchesFormattedString*/contentMatchesFormattedStringLimited,
                    },


                }
            })
                .slice(0, findItemForSendingLimit)
        ;

        return dataPreparedForSending;
    }


};
