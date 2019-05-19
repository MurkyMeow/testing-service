import { withRouter } from 'next/router';
import { useDocument } from '../index';
import Button from '../components/button';

const Category = ({ router }) => {
  const { items, removeItem } = useDocument(`/test/tests?category_id=${router.query.id}`);
  const addTest = () => router.push(`/test_edit?category_id=${router.query.id}`);
  return (
    <div className="category-page">
      {!items.length && <>
        <div className="page-title">Добавить первый тест в этой категории..?</div>
      </>}
      <div className="category-page__test-list">
        {items.map(test => (
          <div className="category-page__test" key={test.id}>
            <i className="category-page__test__delete-btn" onClick={() => removeItem(test.id)}>close</i>
            <div className="category-page__test__name">{test.name}</div>
            <div className="category-page__test__description">Описание</div>
            <Button className="category-page__link" link={`#/questions/${test.id}/`}>
              Пройти тест
            </Button>
          </div>
        ))}
      </div>
      <Button className="category-page__add-btn" onClick={addTest}>+</Button>
    </div>
  );
};

export default withRouter(Category);
