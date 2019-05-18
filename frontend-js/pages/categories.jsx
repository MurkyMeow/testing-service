import { useState } from 'react';
import { put } from '../api';
import Button from '../components/button';
import ListPage from '../abstract/list-page';

const Categories = () => {
  const [name, setName] = useState('');
  const submit = async () => {
    try {
      await put('/test/categories', { name });
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div>
      <ListPage title="Категории" colWidth={500} endpoint="/test/categories?samples=30&eager=tests">
        {category => (
          <div className="category" key={category.id}>
            <div className="category-name">{category.name}</div>
            <div className="category-test-list">
              {category.tests.map(test => (
                <div className="category-test-list-item" key={test.id}>
                  {test.name}
                </div>
              ))}
              <div className="category-test-list-add-btn">Добавить тест</div>
            </div>
            <div className="category-summary">
              <div><i>info</i>6</div>
              <div><i>query_builder</i>60</div>
            </div>
            <div className="category-actions">
              <Button link={`#/tests/${category.id}`}>Перейти</Button>
            </div>
          </div>
        )}
      </ListPage>
      <div className="categories-add">
        <input className="categories-add-input" placeholder="Название категории"
          onChange={e => setName(e.target.value)}/>
        <Button className="categories-add-btn" onClick={submit}>+</Button>
      </div>
    </div>
  );
};

export default Categories;
