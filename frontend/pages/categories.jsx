import Link from 'next/link';
import gql from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { canEdit, notify, canCreate } from '../index';
import { Editable } from '../components/editable';
import Button from '../components/button';
import css from './categories.css';

const GET_CATEGORIES = gql`
  query GetCategories {
    getCategories {
      id
      name
      tests {
        id
        name
        creator {
          id
          name
        }
      }
    }
  }
`;
const ADD_CATEGORY = gql`
  mutation AddCategory($name: String!) {
    addCategory(name: $name) {
      id
      name
    }
  }
`;
const EDIT_CATEGORY = gql`
  mutation EditCategory($id: Int!, $name: String!) {
    editCategory(id: $id, name: $name) {
      id
      name
    }
  }
`;
const DELETE_CATEGORY = gql`
  mutation DeleteCategory($id: Int!) {
    deleteCategory(id: $id)
  }
`;

const Test = ({ test, finished }) => (
  <div className={css.test} data-finished={finished}>
    <span className={css.test__name}>{test.name}</span>
    <span> {finished ? '(Пройден)' : ''}</span>
  </div>
);

const Category = ({ category, onEdit, onRemove }) => {
  return (
    <div className={css.category}>
      <header className={css.category__header}>
        <Editable className={css.category__name}
          initial={category.name}
          disabled={!canEdit(category)}
          onAlter={onEdit}
        />
        {canEdit(category) && (
          <i className={css.category__deleteBtn} onClick={onRemove}>close</i>
        )}
      </header>
      <div className={css.category__testList}>
        {category.tests.map(test => (
          <Test test={test} key={test.id}
            finished={false}
          />
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
              Создатель: {category.creator && category.creator.name}
            </div>
          </Link>
        )}
        <Button link={`/category?id=${category.id}`}>Перейти</Button>
      </div>
    </div>
  );
};

export default function Categories() {
  const categories = useQuery(GET_CATEGORIES);

  const [add] = useMutation(ADD_CATEGORY);
  const [edit] = useMutation(EDIT_CATEGORY);
  const [del] = useMutation(DELETE_CATEGORY);

  const handleAdd = async e => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    try {
      await add({
        variables: { name: String(data.get('name')) },
      });
    } catch (err) {
      notify({ type: 'error', text: 'Не удалось создать категорию' });
    }
  };

  const handleEdit = async variables => {
    try {
      await edit({ variables });
    } catch (err) {
      notify({ type: 'error', text: 'Не удалось отредактировать категорию' });
    }
  };

  const handleRemove = async variables => {
    try {
      await del({ variables })
    } catch (err) {
      notify({ type: 'error', text: 'Не удалось удалить категорию' });
    }
  }

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
          <Category category={category} key={category.id}
            onRemove={() => handleRemove({ id: category.id })}
            onEdit={name => handleEdit({ id: category.id, name })}
          />
        ))}
      </div>
    </div>
  );
}
