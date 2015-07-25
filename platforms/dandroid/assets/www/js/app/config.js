/*global module, require*/

module.exports = {
    fs: void 0
    , appName: 'Carnegie.ru'
    , track: true
    , trackId: 'UA-31877-32'
    , folder: 'com.ceip.carnegieru'
    , storyFontSize: 1.0
    , connectionMessage: 'No network connection detected'
    , menuMessage: 'Not yet downloaded'
    , missingImage: 'http://carnegieendowment.org/app-img-not-avail.png'
    , missingImageRef: void 0
    , menu: [{
        title: 'Now from Carnegie.ru'
        , sub: 'Read Offline'
        , feeds: [{
            url: 'http://carnegieendowment.org/rss/solr/?fa=AppCarnegieRu'
            , name: 'Latest Analysis'
            , filename: 'carnegieru-latest.json'
            , type: 'json'
            , required: true
        }, {
            url: 'http://carnegieendowment.org/rss/feeds/mobile-carnegie-moscow-russian-top5.json.txt'
            , name: 'Test'
            , filename: 'carnegieru-popular.json'
            , type: 'json'
        }, {
            url: 'http://carnegieendowment.org/rss/solr/?fa=AppCarnegieRu&channel=short'
            , name: 'Commentary'
            , filename: 'carnegieru-commentary.json'
            , type: 'json'
        }, {
            url: 'http://carnegieendowment.org/rss/solr/?fa=AppCarnegieRu&channel=long'
            , name: 'Research'
            , filename: 'carnegieru-research.json'
            , type: 'json'
        }]
    }, {
        title: 'Now from Carnegie.ru'
        , sub: 'Read Offline'
        , v: 'R'
        , feeds: [{
            url: 'http://carnegieendowment.org/rss/solr/?fa=AppCarnegieRu&lang=ru'
            , name: 'Недавние публикации'
            , filename: 'carnegieru-latest-ru.json'
            , type: 'json'
        }, /*{
         url: 'http://carnegieendowment.org/rss/solr/?fa=AppCarnegieRu'
         , name: 'Самое популярное)'
         , filename: 'carnegieru-popular-ru.json'
         , type: 'json'
         }, */{
            url: 'http://carnegieendowment.org/rss/solr/?fa=AppCarnegieRu&channel=short&lang=ru'
            , name: 'Статьи и интервью'
            , filename: 'carnegieru-commentary-ru.json'
            , type: 'json'
        }, {
            url: 'http://carnegieendowment.org/rss/solr/?fa=AppCarnegieRu&channel=long&lang=ru'
            , name: 'Исследования'
            , filename: 'carnegieru-research-ru.json'
            , type: 'json'
        }]
    }, {
        title: 'Browse Topics'
        , links: [{
            url: 'http://carnegie.ru/about/?lang=en'
            , name: 'About the Carnegie Moscow Center'
        }, {
            url: 'http://carnegie.ru/experts/?lang=en'
            , name: 'About our Experts'
        }]
    }, {
        title: 'Просмотр темы'
        , v: 'R'
        , links: [{
            url: ' http://carnegie.ru/about/'
            , name: 'О Московском Центре Карнеги'
        }, {
            url: 'http://carnegie.ru/experts/'
            , name: 'Эксперты Московского Центра'
        }]
    }]
};