import twint

c = twint.Config()

c.Search = ['Taylor Swift']       # topic
c.Limit = 500      # number of Tweets to scrape
c.Store_csv = True
c.Output = "tweet.csv"       # store tweets in a csv file
c.Output = "taylor_swift_tweets.csv"     # path to csv file

twint.run.Search(c)
