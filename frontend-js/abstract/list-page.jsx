import { useRequest } from '../index';
import { get } from '../api';

const ListPage = ({ title, endpoint, colWidth, children }) => {
  const [, items = []] = useRequest(() => get(endpoint));
  return (
    <div className="list-page" style={{ '--column-width': `${colWidth}px` }}>
      <div className="list-page-title">{title}</div>
      <div className="list-page-items">{items.map(children)}</div>
    </div>
  );
};

export default ListPage;
