import { withRouter } from 'next/router';
import { TestCard } from '../components/test-card';
import { useRequest, get } from '../api';
import Button from '../components/button';

const Category = ({ router }) => {
  const req = () => get(`/test/categories?id=${router.query.id}&include=
    name,
    tests(name,creator(name))
  `);
  const [, category, setCategory] = useRequest(req, { only: true });
  const addTest = () => {
    router.push(`/test_edit?category_id=${router.query.id}`);
  };
  const deleteTest = id => {
    setCategory({
      ...category,
      tests: category.tests.filter(x => x.id !== id)
    });
  };
  if (!category) return <div className="page-title">Загрузка...</div>;
  return (
    <div className="category-page">
      <div className="page-title">{category.name}</div>
      {!category.tests.length && <>
        <div className="page-title">Добавить первый тест в этой категории..?</div>
      </>}
      <div className="category-page__test-list">
        {category.tests.map(test => (
          <TestCard test={test} key={test.id} onDelete={() => deleteTest(test.id)}/>
        ))}
      </div>
      <Button className="category-page__add-btn" onClick={addTest}>+</Button>
    </div>
  );
};

export default withRouter(Category);
