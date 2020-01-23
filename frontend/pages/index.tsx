import css from './index.css';

export default function Index() {
  return (
    <div className={css.pageIndex}>
      <div className={css.heading}>
        <h1>Интернет платформа</h1>
        <h2>Тестирования студентов</h2>
        <img className={css.logo} src="/logo.svg" alt=""/>
      </div>
      <div className={css.featuresHeading}>Возможности</div>
      <div className={css.features}>
        <div className={css.feature}>Простая развёртка в локальных сетях</div>
        <div className={css.feature}>Создание и редактирование тестов</div>
        <div className={css.feature}>Обобщение результатов испытуемых</div>
      </div>
    </div>
  );
}
