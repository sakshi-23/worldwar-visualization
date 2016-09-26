# Exploring media’s coverage of Germany during the World War 1 period

## What you are trying to do?
The idea behind my analysis is to see how various events during the World War 1 were
being covered in USA. USA’s initial neutrality changed towards April 1917. So I wanted
to explore the media’s amount of coverage, sentiments, reaction to major events and
interpretation of the role of Germany in the war before and after the period. I have
used the coverage of Germany because of its critical role in the war and primarily to
focus on understanding how supportive/ non supportive was USA of its actions and to
understand how a nation as a whole was being projected by the media.

## What data you are using, why you chose it?
I used 5000 documents that appeared on the front page of the newspapers that had
the word Germany in them and between 1915-1918. The time played an important
aspect in the war. And the idea was to see how the coverage changed before 1917
and after it. I started with the top 2000 documents but extended my analysis to get a
better coverage.



## What analytic techniques you are using and why?
I used clustering, topic modelling, sentiment analysis and summarization. After
computing each of these, I have formatted and stored them into csv files to use for
the visualizations.

## Preprocessing:

As the data does not have demarcation between articles, for each of
the articles the ocr has run on. For each line, I added it only if it contains the word
Germany/ German or associated or is within 5 lines maximum distance between a line
that contains the words. While some data might be lost, it helps prevent erroneous
irrelevant data from being added to the analysis.
### Clustering: To categorize and try to separate the documents under relevant topics to
enable further exploration
### Topic modelling: The idea was an added understanding of the flow of topics
throughout the timeframe, further to understanding the clustered documents
### Sentiment analysis: To understand how the media felt about each of the events and
how this is associated with each category/topic
### Summarization: To explore the documents, it might be useful to get a jist of the
articles, just to see what it contains. For each, I have used a 5 line summary.

## Links to all relevant sources, including software libraries
1. http://brandonrose.org/clustering
2. http://joshbohde.com/blog/document-summarization
3. https://code.google.com/archive/p/topic-modeling-tool/
4. https://d3js.org/
5. https://jquery.com/
6. https://www.mongodb.org/
7. Python - nltk, sklearn, numpy
