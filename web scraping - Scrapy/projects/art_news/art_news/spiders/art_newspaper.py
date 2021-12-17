import scrapy


class ArtNewspaperSpider(scrapy.Spider):
    name = 'art_newspaper'
    allowed_domains = ['www.theartnewspaper.com/keywords/nigeria']
    start_urls = ['http://www.theartnewspaper.com/keywords/nigeria/']

    # def parse(self, response):
    #     title = response.xpath('//h4/text()').getall()
    #     body = response.xpath('//p/text()').getall()

    #     title_body = dict(zip(title, body))

    #     yield title_body

        
