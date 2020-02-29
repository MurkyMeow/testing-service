import Link from 'next/link';
import { FormEvent } from 'react';
import { canEdit, canCreate } from '../index';
import { Input } from '../components/input';
import { Button } from '../components/button';
import { useNotification } from '../components/notification';
import css from './categories.css';

import {
  Test, GetCategoriesQuery,
  useAddCategoryMutation, useDeleteCategoryMutation,
  useEditCategoryMutation, useGetCategoriesQuery,
} from '../graphql-types';

function Test(props: {
  test: GetCategoriesQuery['getCategories'][0]['tests'][0];
  finished: boolean;
}) {
  return (
    <div className={css.test} data-finished={props.finished}>
      <span className={css.test__name}>{props.test.name}</span>
      <span> {props.finished ? '(Пройден)' : ''}</span>
    </div>
  );
}

function Category(props: {
  category: GetCategoriesQuery['getCategories'][0];
  onEdit?: (name: string) => void;
  onRemove?: () => void;
}) {
  const { category } = props;
  return (
    <div className={css.category}>
      <header className={css.category__header}>
        <Input className={css.category__name}
          initial={category.name}
          disabled={!canEdit(category)}
          onAlter={props.onEdit}
        />
        {canEdit(category) && (
          <button className={css.category__deleteBtn} onClick={props.onRemove}>
            <i>close</i>
          </button>
        )}
      </header>
      <div className={css.category__testList}>
        {category.tests.map(test => (
          <Test test={test} key={test.id} finished={false}/>
        ))}
        {canCreate() && (
          <Link href={`/test_edit?category_id=${category.id}`}>
            <div className={css.test__addBtn}>Добавить тест</div>
          </Link>
        )}
      </div>
      <div className={css.category__summary}>
        <div><i>info</i>6</div>
        <div><i>query_builder</i>60</div>
        {category.creator && (
          <Link href={`/profile?id=${category.creator.id}`}>
            <div className={css.categoryCreator}>
              Создатель: {category.creator.name}
            </div>
          </Link>
        )}
        <Button link={`/category?id=${category.id}`}>Перейти</Button>
      </div>
    </div>
  );
}

export default function Categories() {
  const categories = useGetCategoriesQuery();
  const [add] = useAddCategoryMutation();
  const [edit] = useEditCategoryMutation();
  const [del] = useDeleteCategoryMutation();

  const { notify } = useNotification();

  const handleAdd = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    await add({
      variables: { name: String(data.get('name')) },
    }).catch(() => {
      notify({ type: 'error', text: 'Не удалось создать категорию' });
    });
  };

  const handleEdit = async (id: number, name: string) => {
    await edit({
      variables: { id, name },
    }).catch(() => {
      notify({ type: 'error', text: 'Не удалось отредактировать категорию' });
    });
  };

  const handleDelete = async (id: number) => {
    await del({
      variables: { id },
    }).catch(() => {
      notify({ type: 'error', text: 'Не удалось удалить категорию' });
    });
  };

  return (
    <div className={css.pageCategories}>
      <div className={css.pageTitle}>Категории</div>
      {canCreate() && (
        <form className={css.add} onSubmit={handleAdd}>
          <input className={css.add__input} placeholder="Название категории" required/>
          <Button className={css.add__btn}>+</Button>
        </form>
      )}
      <div className={css.categoryList}>
        {categories.data && categories.data.getCategories.map(x => (
          <Category category={x} key={x.id}
            onRemove={() => handleDelete(x.id)}
            onEdit={name => handleEdit(x.id, name)}
          />
        ))}
      </div>
    </div>
  );
}
