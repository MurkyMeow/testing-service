const Index = () => (
  <div className="page-index">
    <div className="page-index__heading">
      <h1>Интернет платформа</h1>
      <h2>Тестирования студентов</h2>
      <img className="page-index__logo" src="/logo.svg"/>
    </div>
    <div className="page-index__features-heading">Возможности</div>
    <div className="page-index__features">
      <div className="page-index__feature --f1">
        Простая развёртка в локальных сетях
      </div>
      <div className="page-index__feature --f2">
        Создание и редактирование тестов
      </div>
      <div className="page-index__feature --f3">
        Обобщение результатов испытуемых
      </div>
    </div>
  </div>
);

export default Index;
