import { useState } from 'react';
import { put, get, useRequest } from '../api';
import Button from '../components/button';

const Categories = () => {
  const [name, setName] = useState('');
  const [, items = []] = useRequest(() => get('/test/categories?samples=30&eager=tests'));
  const submit = async () => {
    try {
      await put('/test/categories', { name });
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div className="page-categories">
      <div className="page-title">Категории</div>
      <div className="page-categories__add">
        <input className="page-categories__add__input" placeholder="Название категории" onChange={e => setName(e.target.value)}/>
        <Button className="page-categories__add__btn" onClick={submit}>+</Button>
      </div>
      <div className="page-categories__category-list">
        {items.map(category => (
          <div className="category" key={category.id}>
            <div className="category__name">{category.name}</div>
            <div className="category__test-list">
              {category.tests.map(test => (
                <div className="category__test-list__test" key={test.id}>
                  {test.name}
                </div>
              ))}
              <div className="category__test-list__add-btn">Добавить тест</div>
            </div>
            <div className="category__summary">
              <div><i>info</i>6</div>
              <div><i>query_builder</i>60</div>
              <Button link={`#/tests/${category.id}`}>Перейти</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
