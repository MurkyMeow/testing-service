import { withRouter } from 'next/router';
import { TestCard } from '../components/test-card';
import { useRequest, get } from '../api';
import { canCreate } from '../index';
import Button from '../components/button';
import css from './category.css';

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
  if (!category) return <div className={css.pageTitle}>Загрузка...</div>;
  return (
    <div className={css.categoryPage}>
      <div className={css.pageTitle}>{category.name}</div>
      {canCreate() && !category.tests.length && <>
        <div className={css.pageTitle}>Добавить первый тест в этой категории..?</div>
      </>}
      <div className={css.testList}>
        {category.tests.map(test => (
          <TestCard test={test} key={test.id} onDelete={() => deleteTest(test.id)}/>
        ))}
      </div>
      {canCreate() && (
        <Button className={css.addBtn} onClick={addTest}>+</Button>
      )}
    </div>
  );
};

export default withRouter(Category);
