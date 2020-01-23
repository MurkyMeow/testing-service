import { TestCard } from '../components/test-card';
import { canCreate, notify } from '../index';
import { Button } from '../components/button';
import css from './category.css';

import {
  useGetCategoryQuery,
  useDeleteTestMutation,
} from '../graphql-types';

export default function Category() {
  const categoryQuery = useGetCategoryQuery();
  const [deleteTest] = useDeleteTestMutation();

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
    <div className={css.categoryPage}>
      <div className={css.pageTitle}>{getCategory.name}</div>
      {!getCategory.tests.length && canCreate() && (
        <div className={css.pageTitle}>Добавить первый тест в этой категории..?</div>
      )}
      <div className={css.testList}>
        {getCategory.tests.map(test => (
          <TestCard test={test} key={test.id} onDelete={() => handleDelete(test.id)}/>
        ))}
      </div>
      {canCreate() && (
        <Button className={css.addBtn} link={`/test_edit?category_id=${getCategory.id}`}>
          +
        </Button>
      )}
    </div>
  );
}
