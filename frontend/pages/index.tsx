import './index.css';

export default function Index() {
  return (
    <div className="index">
      <div className="index__heading">
        <h1>Интернет платформа</h1>
        <h2>Тестирования студентов</h2>
        <img className="index__logo" src="/logo.svg" alt=""/>
      </div>
      <div className="index__features-heading">Возможности</div>
      <div className="index__features">
        <div className="index__feature">Простая развёртка в локальных сетях</div>
        <div className="index__feature">Создание и редактирование тестов</div>
        <div className="index__feature">Обобщение результатов испытуемых</div>
      </div>
    </div>
  );
}
