import { useState } from 'react';
import Link from 'next/link';
import { useDocument, canEdit, notify } from '../index';
import { useRequest, get, post } from '../api';
import { Editable } from '../components/editable';
import Button from '../components/button';

const Test = ({ test, finished }) => (
  <div className={`page-categories__test ${finished ? '--finished' : ''}`}>
    <span className="page-categories__test-name">{test.name}</span>
    <span> {finished ? '(Пройден)' : ''}</span>
  </div>
);

const Category = ({ category, stats, onRemove }) => {
  const changeName = name => {
    post('/test/categories', { id: category.id, name })
      .catch(() => notify('error', 'Не удалось поменять название'));
  };
  return (
    <div className="page-categories__category">
      <header className="page-categories__category-header">
        <Editable className="page-categories__category-name"
          initial={category.name}
          disabled={!canEdit(category)}
          onChange={changeName}
        />
        {canEdit(category) && (
          <i className="page-categories__category-delete-btn" onClick={onRemove}>
            close
          </i>
        )}
      </header>
      <div className="page-categories__category-test-list">
        {category.tests.map(test => (
          <Test test={test} key={test.id}
            finished={stats.find(x => x.test && x.test.id === test.id)}
          />
        ))}
        <Link href={`/test_edit?category_id=${category.id}`}>
          <div className="page-categories__test-add-btn">Добавить тест</div>
        </Link>
      </div>
      <div className="page-categories__category-summary">
        <div><i>info</i>6</div>
        <div><i>query_builder</i>60</div>
        {category.creator && (
          <Link href={`/profile?id=${category.creator.id}`}>
            <div className="page-categories__category-creator">
              Создатель: {category.creator && category.creator.name}
            </div>
          </Link>
        )}
        <Button link={`/category?id=${category.id}`}>Перейти</Button>
      </div>
    </div>
  );
};

const Categories = () => {
  const [name, setName] = useState('');
  const { items, addItem, removeItem } = useDocument('/test/categories', {
    relation: '[tests, creator]',
    samples: '30',
  });
  const [, stats = []] = useRequest(() => get('/stats/tests'));
  return (
    <div className="page-categories">
      <div className="page-title">Категории</div>
      <div className="page-categories__add">
        <input className="page-categories__add-input"
          placeholder="Название категории"
          onChange={e => setName(e.target.value)}
        />
        <Button className="page-categories__add-btn"
          onClick={() => addItem({ name })}>
          +
        </Button>
      </div>
      <div className="page-categories__category-list">
        {items.map(category => (
          <Category category={category} stats={stats}
            key={category.id}
            onRemove={() => removeItem(category.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default Categories;
