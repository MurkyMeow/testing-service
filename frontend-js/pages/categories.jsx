import { useState } from 'react';
import { useDocument } from '../index';
import { useRequest, get } from '../api';
import Button from '../components/button';

const Categories = () => {
  const [name, setName] = useState('');
  const { items, addItem, removeItem } = useDocument('/test/categories', {
    relation: 'tests',
    samples: '30',
  });
  const [loadingStats, stats] = useRequest(() => get('/stats/tests'));
  const finished = test =>
    !loadingStats && stats.find(x => x.test && x.test.id === test.id);
  return (
    <div className="page-categories">
      <div className="page-title">Категории</div>
      <div className="page-categories__add">
        <input className="page-categories__add__input" placeholder="Название категории" onChange={e => setName(e.target.value)}/>
        <Button className="page-categories__add__btn" onClick={() => addItem({ name })}>+</Button>
      </div>
      <div className="page-categories__category-list">
        {items.map(category => (
          <div className="category" key={category.id}>
            <header className="category__header">
              <div>{category.name}</div>
              <i className="category__header__close-btn" onClick={() => removeItem(category.id)}>
                close
              </i>
            </header>
            <div className="category__test-list">
              {category.tests.map(test => (
                <div className={`category__test-list__test ${finished(test) ? '--finished' : ''}`} key={test.id}>
                  <span className="category__test-list__test__name">{test.name}</span>
                  <span> {finished(test) ? '(Пройден)' : ''}</span>
                </div>
              ))}
              <div className="category__test-list__add-btn">Добавить тест</div>
            </div>
            <div className="category__summary">
              <div><i>info</i>6</div>
              <div><i>query_builder</i>60</div>
              <Button link={`/category?id=${category.id}`}>Перейти</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
