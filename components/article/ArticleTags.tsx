import styled from "styled-components";
import { Tag } from "antd";

const StyledTag = styled(Tag)`
  background-color: white;
  border: none;
  margin-top: 2em;
  font-size: 1em;
`;

const ArticleTags = (props) => {
    return (<ul className="tag-list">
        {props.article.tagList.map((tag) => (
            <li key={(tag as any).tagname}>
                <StyledTag>
                    #{(tag as any).tagname}
                </StyledTag>
            </li>
        ))}
    </ul>
    )
}

export default ArticleTags;