import { TestCard } from '../components/test-card';
import { canCreate } from '../index';
import { Button } from '../components/button';
import { useNotification } from '../components/notification';
import css from './category.css';

import {
  useGetCategoryQuery,
  useDeleteTestMutation,
} from '../graphql-types';

export default function Category() {
  const categoryQuery = useGetCategoryQuery();
  const [deleteTest] = useDeleteTestMutation();
  
  const { notify } = useNotification();

  const handleDelete = async (id: number) => {
    await deleteTest({
      variables: { id },
    }).catch(() => {
      notify({ type: 'error', text: 'Не удалось удалить тест' });
    });
  };

  if (categoryQuery.loading) {
    return <div className={css.pageTitle}>Загрузка...</div>;
  }

  if (!categoryQuery.data) {
    return <div className={css.pageTitle}>Не удалось загрузить категорию</div>;
  }

  const { getCategory } = categoryQuery.data;

  return (
    <div className="category-page">
      <div className="page-title">{getCategory.name}</div>
      {!getCategory.tests.length && canCreate() && (
        <div className="page-title">Добавить первый тест в этой категории..?</div>
      )}
      <div className="category-page__tests">
        {getCategory.tests.map(test => (
          <TestCard className="category-page__test" key={test.id}
            test={test}
            onDelete={() => handleDelete(test.id)}
          />
        ))}
      </div>
      {canCreate() && (
        <Button className="category-page__add-btn" link={`/test_edit?category_id=${getCategory.id}`}>
          +
        </Button>
      )}
    </div>
  );
}
