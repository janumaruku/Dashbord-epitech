export type GithubProfileData = {
  username: string;
  name: string;
  avatar_url: string;
  bio: string;
  followers: number;
  public_repos: number;
};

export type GithubRepo = {
  name: string;
  description: string;
  language: string;
  stars: number;
  url: string;
  updated_at: string;
};

export type GithubReposData = {
  username: string;
  repos: GithubRepo[];
};

export type GithubCommit = {
  sha: string;
  message: string;
  author: string;
  date: string;
  url: string;
};

export type GithubCommitsData = {
  owner: string;
  repo: string;
  commits: GithubCommit[];
};
