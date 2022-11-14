const request = require("request");
const cheerio = require("cheerio");
const iconv = require("iconv-lite");

const getNews = () => {
    request(
    {
        url: "https://weather.naver.com/news/",
        method: "GET",
        encoding: null,
    },
    (error, response, body) => {
    if (error) {
        console.error(error);
        return;
    }
    if (response.statusCode === 200) {
        console.log("response ok");
        const bodyDecoded = iconv.decode(body, "utf-8");
        const $ = cheerio.load(bodyDecoded);
        
        img_class = 'thumb'
        title_class = 'tit_news'
        document_class = 'dsc_news'

        // get top 5 news
        news = []
        for (let i = 1; i < 6; i++) {
            img = $('.' + img_class).eq(i).attr('src')
            title = $('.' + title_class).eq(i).text()
            document = $('.' + document_class).eq(i).text()
            news.push({
                img: img,
                title: title,
                document: document
            })
        }
        console.log(news)
    }
  });
};

getNews();
