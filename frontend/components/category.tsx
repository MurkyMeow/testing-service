import Link from 'next/link';
import cx from 'classnames';
import { canEdit, canCreate } from '../index';
import { Input } from './input';
import { Button } from './button';
import { GetCategoriesQuery } from '../graphql-types';

export function Category(props: {
  className?: string;
  category: GetCategoriesQuery['getCategories'][0];
  onEdit?: (name: string) => void;
  onRemove?: () => void;
}) {
  const { category } = props;
  return (
    <div className={cx('category', props.className)}>
      <header className="category__header">
        <Input className="category__name"
          initial={category.name}
          disabled={!canEdit(category)}
          onAlter={props.onEdit}
        />
        {canEdit(category) && (
          <button className="category__deleteBtn" onClick={props.onRemove}>
            <i>close</i>
          </button>
        )}
      </header>
      <div className="category__tests">
        {category.tests.map(test => (
          <div className="test" data-finished={test.finished} key={test.id}>
            <span className="test__name">{test.name}</span>
            <span> {test.finished ? '(Пройден)' : ''}</span>
          </div>
        ))}
        {canCreate() && (
          <Link href={`/test_edit?category_id=${category.id}`}>
            <div className="test__addBtn">Добавить тест</div>
          </Link>
        )}
      </div>
      <div className="category__summary">
        <div><i>info</i>6</div>
        <div><i>query_builder</i>60</div>
        {category.creator && (
          <Link href={`/profile?id=${category.creator.id}`}>
            <div className="category__creator">Создатель: {category.creator.name}</div>
          </Link>
        )}
        <Button link={`/category?id=${category.id}`}>Перейти</Button>
      </div>
    </div>
  );
}
