import scrapy


class GdpDeptSpider(scrapy.Spider):
    name = 'gdp_dept'
    allowed_domains = ['www.worldpopulationreview.com/']
    start_urls = ['https://worldpopulationreview.com/countries/countries-by-national-debt/']

    def parse(self, response):
        countries = response.xpath('.//td/a')

        for country in countries:
            name = country.xpath('.//text()').get()
            link = country.xpath('.//@href').get()

            yield {
                'country_name': name,
                'link': link,
                'link2': response.follow(url=link)
            }

        