import ContentfulApi from "@utils/ContentfulApi";
import Post from "@components/Post";
import { Config } from "@utils/Config";
import PageMeta from "@components/PageMeta";
import MainLayout from "@layouts/main";
import ContentWrapper from "@components/ContentWrapper";

export default function PostWrapper(props) {
  const { preview, posts } = props;

  return (
    <MainLayout preview={preview}>
      <PageMeta title={"Tag"} description={""} url={""} canonical={false} />
      <ContentWrapper>
        {posts.map((post) => (
          <Post key={post.id} post={post} />
        ))}
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
