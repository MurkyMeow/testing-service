import Button from '../components/button';
import ListPage from '../abstract/list-page';

const Category = ({ query }) => (
  <ListPage title="Выберете тест:" endpoint={`/test/tests?category_id=${query.id}`} colWidth={300}>
    {test => (
      <div className="test" key={test.id}>
        <div className="test-name">{test.name}</div>
        <p>Описание</p>
        <Button link={`#/questions/${test.id}/`}>Пройти тест</Button>
      </div>
    )}
  </ListPage>
);

export default Category;
