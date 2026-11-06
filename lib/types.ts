export type Article = {
    url: string;
    title: string;
    summary: string;
    source: string;
    author?: string;
    publishedAt: Date;
    fetchedAt: Date;
    expiresAt: Date;
    tags: string[];
}