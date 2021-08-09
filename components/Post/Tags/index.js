import TagsStyles from "@styles/Tags.module.css";

export default function Tags(props) {
  const { tags } = props;
  console.log(props);

  return (
    <ul className={TagsStyles.tags}>
      {tags.map((tag) => (
        <li className={TagsStyles.tags__tag} key={tag.id}>
          {tag.id}
        </li>
      ))}
    </ul>
  );
}
