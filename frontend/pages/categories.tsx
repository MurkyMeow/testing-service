import { FormEvent } from 'react';
import { canCreate } from '../index';
import { Button } from '../components/button';
import { Category }  from '../components/category';
import { useNotification } from '../components/notification';
import './categories.css';

import {
  useAddCategoryMutation, useDeleteCategoryMutation,
  useEditCategoryMutation, useGetCategoriesQuery,
} from '../graphql-types';

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
    <div className="categories">
      <div className="page-title">Категории</div>
      {canCreate() && (
        <form className="categories__form" onSubmit={handleAdd}>
          <input className="categories__input" placeholder="Название категории" required/>
          <Button className="categories__btn">+</Button>
        </form>
      )}
      <div className="categories__list">
        {categories.data && categories.data.getCategories.map(x => (
          <Category className="categories__category" key={x.id}
            category={x}
            onRemove={() => handleDelete(x.id)}
            onEdit={name => handleEdit(x.id, name)}
          />
        ))}
      </div>
    </div>
  );
}
