export type RssArticle = {
  title: string;
  link: string;
  pub_date: string;
};

export type RssLatestData = {
  feed_title: string;
  articles: RssArticle[];
};

export type RssSummaryData = {
  title: string;
  description: string;
  article_count: number;
};

export function feedDomain(feedUrl: string): string {
  try {
    return new URL(feedUrl).hostname;
  } catch {
    return feedUrl;
  }
}
