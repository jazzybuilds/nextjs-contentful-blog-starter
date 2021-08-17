import * as React from "react";

import ContentfulApi from "@utils/ContentfulApi";
import { Config } from "@utils/Config";
import PageMeta from "@components/PageMeta";
import PostList from "@components/PostList";
import RichTextPageContent from "@components/RichTextPageContent";
import MainLayout from "@layouts/main";
import ContentWrapper from "@components/ContentWrapper";
import PageContentWrapper from "@components/PageContentWrapper";
import HeroBanner from "@components/HeroBanner";
import { useFuzzySearch } from "@hooks/useFuzzySearch";

export default function BlogSearch(props) {
  const { posts, pageContent, preview } = props;

  const { onReset, onSearch, results, searchValue } = useFuzzySearch(posts);

  /**
   * This provides some fallback values to PageMeta so that a pageContent
   * entry is not required for /blog
   */
  const pageTitle = pageContent ? pageContent.title : "Blog Search";
  const pageDescription = pageContent
    ? pageContent.description
    : "Search | Next.js Contentful blog starter";

  return (
    <MainLayout preview={preview}>
      <PageMeta
        title={pageTitle}
        description={pageDescription}
        url={Config.pageMeta.blogIndex.url}
      />

      {pageContent.heroBanner !== null && (
        <HeroBanner data={pageContent.heroBanner} />
      )}

      <ContentWrapper>
        <input
          onChange={onSearch}
          placeholder="Search"
          type="text"
          value={searchValue}
        />
        <a href="https://angry-shockley-04ec06.netlify.app/clone">
        clone link
        </a>
        {pageContent.body && (
          <PageContentWrapper>
            <RichTextPageContent richTextBodyField={pageContent.body} />
          </PageContentWrapper>
        )}
        {results.length > 0 ? (
          <PostList posts={results} />
        ) : (
          <div>
            <h1>No posts found for search: {searchValue}</h1>
            <button onClick={onReset}>Clear Search</button>
          </div>
        )}
      </ContentWrapper>
    </MainLayout>
  );
}

export async function getStaticProps({ preview = false }) {
  const posts = await ContentfulApi.getAllBlogPosts();
  const pageContent = await ContentfulApi.getPageContentBySlug(
    Config.pageMeta.blogIndex.slug,
    {
      preview: preview,
    },
  );

  return {
    props: {
      preview,
      posts,
      pageContent: pageContent || null,
    },
  };
}
