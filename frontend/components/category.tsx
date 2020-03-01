import Link from 'next/link';
import cx from 'classnames';
import { useSelector } from '../store';
import { Input } from './input';
import { Button } from './button';
import { Role } from '../graphql-types';

export function Category(props: {
  className?: string;

  id: number;
  name: string;
  editable?: boolean;
  tests: { id: number; name: string }[];
  creator?: { id: number; name: string };

  finished: boolean;
  onEdit?: (name: string) => void;
  onRemove?: () => void;
}) {
  const user = useSelector(s => s.user);

  return (
    <div className={cx('category', props.className)}>
      <header className="category__header">
        <Input className="category__name"
          defaultValue={props.name}
          disabled={!props.editable}
          onChange={e => props.onEdit && props.onEdit(e.currentTarget.value)}
        />
        {props.editable && (
          <button className="category__deleteBtn" onClick={props.onRemove}>
            <i>close</i>
          </button>
        )}
      </header>
      <div className="category__tests">
        {props.tests.map(test => {
          const finished = user?.results.some(res => res.test.id === test.id);
          return (
            <div className={cx('test', finished && 'test_finished')} key={test.id}>
              <span className="test__name">{test.name}</span>
              <span> {finished ? '(Пройден)' : ''}</span>
            </div>
          );
        })}
        {user?.role === Role.Admin && (
          <Link href={`/test_edit?category_id=${props.id}`}>
            <div className="test__addBtn">Добавить тест</div>
          </Link>
        )}
      </div>
      <div className="category__summary">
        <div><i>info</i>6</div>
        <div><i>query_builder</i>60</div>
        {props.creator && (
          <Link href={`/profile?id=${props.creator.id}`}>
            <div className="category__creator">Создатель: {props.creator.name}</div>
          </Link>
        )}
        <Button link={`/category?id=${props.id}`}>Перейти</Button>
      </div>
    </div>
  );
}
