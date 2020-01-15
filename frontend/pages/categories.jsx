import { useRef } from 'react';
import Link from 'next/link';
import { useDocument, canEdit, notify, canCreate } from '../index';
import { useRequest, get, post } from '../api';
import { Editable } from '../components/editable';
import Button from '../components/button';
import css from './categories.css';

const Test = ({ test, finished }) => (
  <div className={css.test} data-finished={finished}>
    <span className={css.test__name}>{test.name}</span>
    <span> {finished ? '(Пройден)' : ''}</span>
  </div>
);

const Category = ({ category, stats, onRemove }) => {
  const changeName = name => {
    post('/test/categories', { id: category.id, name })
      .catch(() => notify('error', 'Не удалось поменять название'));
  };
  return (
    <div className={css.category}>
      <header className={css.category__header}>
        <Editable className={css.category__name}
          initial={category.name}
          disabled={!canEdit(category)}
          onAlter={changeName}
        />
        {canEdit(category) && (
          <i className={css.category__deleteBtn} onClick={onRemove}>close</i>
        )}
      </header>
      <div className={css.category__testList}>
        {category.tests.map(test => (
          <Test test={test} key={test.id}
            finished={stats.find(x => x.test && x.test.id === test.id)}
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
  const input = useRef();
  const { items, addItem, removeItem } = useDocument('/test/categories', {
    samples: '30',
    include: 'name,tests(name),creator(name)',
  });
  const [, stats = []] = useRequest(() => get('/stats/tests'));
  const add = async () => {
    if (!input.current.reportValidity()) return;
    await addItem({ name: input.current.value });
    input.current.value = '';
  };
  return (
    <div className={css.pageCategories}>
      <div className={css.pageTitle}>Категории</div>
      {canCreate() && (
        <div className={css.add}>
          <input className={css.add__input} ref={input} placeholder="Название категории" required/>
          <Button className={css.add__btn} onClick={add}>+</Button>
        </div>
      )}
      <div className={css.categoryList}>
        {items.map(category => (
          <Category category={category} stats={stats}
            key={category.id}
            onRemove={() => removeItem(category.id)}
          />
        ))}
      </div>
    </div>
  );
}
