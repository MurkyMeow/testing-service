import { withRouter } from 'next/router';
import { TestCard } from '../components/test-card';
import { useRequest, get } from '../api';
import Button from '../components/button';

const Category = ({ router }) => {
  const [, items, setItems] = useRequest(() => get(`/test/tests?category_id=${router.query.id}`));
  const addTest = () => {
    router.push(`/test_edit?category_id=${router.query.id}`);
  };
  const deleteTest = id => {
    setItems(items.filter(x => x.id !== id));
  };
  if (!items) return <div className="page-title">Загрузка...</div>;
  return (
    <div className="category-page">
      {!items.length && <>
        <div className="page-title">Добавить первый тест в этой категории..?</div>
      </>}
      <div className="category-page__test-list">
        {items.map(test => (
          <TestCard test={test} key={test.id} onDelete={() => deleteTest(test.id)}/>
        ))}
      </div>
      <Button className="category-page__add-btn" onClick={addTest}>+</Button>
    </div>
  );
};

export default withRouter(Category);
