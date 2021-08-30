import ContentfulApi from "@utils/ContentfulApi";
import Post from "@components/Post";
import PostTagEntry from "@components/PostTagEntry";
import { Config } from "@utils/Config";
import PageMeta from "@components/PageMeta";
import MainLayout from "@layouts/main";
import ContentWrapper from "@components/ContentWrapper";
import ContentListStyles from "@styles/ContentList.module.css";
import PublishedDate from "@components/Post/PublishedDate";
import Link from "next/link";
import ReactMarkdownRenderers from "@utils/ReactMarkdownRenderers";
import ReactMarkdown from "react-markdown";
import Image from "next/image";
import Tags from "@components/Post/Tags";


export default function PostWrapper(props) {
  const { preview, posts } = props;

  return (
    <MainLayout preview={preview}>
      <PageMeta title={"Tag"} description={""} url={""} canonical={false} />
      <ContentWrapper>
      <ol className={ContentListStyles.contentList}>
        {posts.map((post) => (
          <li key={post.sys.id}>
            <article className={ContentListStyles.contentList__post}>
              <PublishedDate date={post.date} />
              <Link href={`/blog/${post.slug}`}>
                <a className={ContentListStyles.contentList__titleLink}>
                  <h2 className={ContentListStyles.contentList__title}>
                    {post.title}
                  </h2>
                </a>
              </Link>

              <div className={ContentListStyles.contentList__excerpt}>
                <ReactMarkdown
                  children={post.excerpt}
                  renderers={ReactMarkdownRenderers(post.excerpt)}
                />
              </div>

              <div>
                <Image
                  src={post.image.url}
                  width="1200"
                  height="400"
                  layout="responsive"
                />
              </div>
              {post.contentfulMetadata.tags !== null && (
                <Tags tags={post.contentfulMetadata.tags} />
              )}
            </article>
          </li>
        ))}
      </ol>
      </ContentWrapper>
    </MainLayout>
  );
}

export async function getStaticPaths() {
  const blogPostTags = await ContentfulApi.getAllUniquePostTags();

  const paths = blogPostTags.map(({ id }) => {
    return { params: { tag: id } };
  });

  // Using fallback: "blocking" here enables preview mode for unpublished blog slugs
  // on production
  return {
    paths,
    fallback: "blocking",
  };
}

export async function getStaticProps({ params, preview = false }) {
  const posts = await ContentfulApi.getAllBlogPosts();

  const relatedPosts = posts.reduce((acc, post) => {
    if (
      post.contentfulMetadata &&
      post.contentfulMetadata.tags &&
      post.contentfulMetadata.tags.find(({ id }) => id === params.tag)
    ) {
      acc.push(post);
      return acc;
    }
    return acc;
  }, []);

  // Add this with fallback: "blocking"
  // So that if we do not have a post on production,
  // the 404 is served
  if (relatedPosts.length === 0) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      preview,
      posts: relatedPosts,
    },
  };
}
