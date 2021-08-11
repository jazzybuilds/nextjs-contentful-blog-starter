import ContentfulApi from "@utils/ContentfulApi";
import Post from "@components/Post";
import { Config } from "@utils/Config";
import PageMeta from "@components/PageMeta";
import MainLayout from "@layouts/main";
import ContentWrapper from "@components/ContentWrapper";

export default function PostWrapper(props) {
  const { post, preview, posts } = props;

  return (
    <MainLayout preview={preview}>
      <PageMeta
        title={post.title}
        description={post.excerpt}
        url={`${Config.pageMeta.blogIndex.url}/${post.slug}`}
        canonical={post.externalUrl ? post.externalUrl : false}
      />
      <ContentWrapper>
        <Post post={post} />
      </ContentWrapper>
    </MainLayout>
  );
}

export async function getStaticPaths() {
  // Array<string>
  const blogPostTags = await ContentfulApi.getAllUniquePostTags();

  console.log(blogPostTags);
  console.log(blogPostTags[0].id);

  const paths = blogPostTags.map((id) => {
    return { params: { tag: id.toString() } };
  });

  console.log(paths);

  // Using fallback: "blocking" here enables preview mode for unpublished blog slugs
  // on production
  return {
    paths,
    fallback: "blocking",
  };
}

export async function getStaticProps({ params, preview = false }) {
  const posts = await ContentfulApi.getAllBlogPosts();
  
  console.log(posts);

  posts = posts[0].contentfulMetadata.tags[0].id.filter(params.tag);


  /**
  const post = await ContentfulApi.getPostBySlug(params.id, {
    preview: preview,
  });
  **/
  
  // Add this with fallback: "blocking"
  // So that if we do not have a post on production,
  // the 404 is served
  if (!post) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      preview,
      post,
      posts,
    },
  };
}
