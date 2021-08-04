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
import FuzzySearch from "@components/FuzzySearch";

export default function BlogSearch(props) {
  const { posts, pageContent, preview } = props;

  // Internal State to track the search results of the fuzzy search.
  const [results, setResults] = React.useState(posts);

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
        <FuzzySearch onChange={setResults} posts={results} />
        {pageContent.body && (
          <PageContentWrapper>
            <RichTextPageContent richTextBodyField={pageContent.body} />
          </PageContentWrapper>
        )}
        {/* // When the user deletes the value from the input "posts" will evaluate
          // to length = 0 by falling back to the original list of posts in "postSummaries"
          // we prevent the user from having no list of posts in the UI. */}
        <PostList posts={results.length > 0 ? results : posts} />
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
