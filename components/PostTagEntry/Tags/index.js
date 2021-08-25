import TagsStyles from "@styles/Tags.module.css";
import { Config } from "@utils/Config";

export default function Tags(props) {
  const { tags } = props;

  return (
    <ul className={TagsStyles.tags}>
      {tags.map((tag) => (
        <a href={`/blog/tag/${tag.id}`}>
        <li className={TagsStyles.tags__tag} key={tag.id}>
          {tag.id}
        </li>
        </a>
      ))}
    </ul>
  );
}




