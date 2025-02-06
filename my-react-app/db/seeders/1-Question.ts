'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Questions', [
        {
          text: 'Какого древнегреческого философа называли "отцом западной философии"?',
          answer: 'Фалес',
          category: 'Философы',
          points: 200,
          createdAt: new Date(),
          updatedAt: new Date()
        },
      {
        text: 'Кто является автором работы "Государство" и знаменитой аллегории пещеры?',
        answer: 'Платон',
        category: 'Философы',
        points: 400,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        text: 'Какой философ утверждал "Cogito, ergo sum" ("Мыслю, следовательно, существую")?',
        answer: 'Рене Декарт',
        category: 'Философы',
        points: 600,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        text: 'Кто написал книгу "Так говорил Заратустра"?',
        answer: 'Фридрих Ницше',
        category: 'Философы',
        points: 800,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        text: 'Какого философа называют основателем экзистенциализма?',
        answer: 'Сёрен Кьеркегор',
        category: 'Философы',
        points: 1000,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        text: 'Как зовут Агента 007',
        answer: 'Джеймс Бонд',
        category: 'Агент 007',
        points: 200,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        text: 'Как называется организация, против которой часто борется Джеймс Бонд?',
        answer: 'СПЕКТР',
        category: 'Агент 007',
        points: 400,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        text: 'Какой легендарный автомобиль Бонда оснащён гаджетами, включая пулемёты и катапультируемое кресло?',
        answer: 'Aston Martin',
        category: 'Агент 007',
        points: 600,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        text: 'Как зовут начальника Джеймса Бонда, которого он называет одной буквой?',
        answer: 'М',
        category: 'Агент 007',
        points: 800,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        text: 'Какое культовое предложение говорит Джеймс Бонд, представляясь?',
        answer: 'Бонд. Джеймс Бонд.',
        category: 'Агент 007',
        points: 1000,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        text: 'Сколько клеток на шахматной доске?',
        answer: '64',
        category: 'Шахматы',
        points: 200,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        text: 'Какая шахматная фигура может ходить только по диагонали?',
        answer: 'Слон',
        category: 'Шахматы',
        points: 400,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        text: ' Как называется ситуация, когда королю объявлен шах, и он не может избежать атаки?',
        answer: 'Мат',
        category: 'Шахматы',
        points: 600,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        text: 'Какая фигура может превратиться в любую другую, если дойдёт до последней горизонтали?',
        answer: 'Пешка',
        category: 'Шахматы',
        points: 800,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        text: 'Сколько клеток может перемещаться конь за один ход?',
        answer: 'На 2 клетки в одном направлении и 1 в другом, буквой "Г"',
        category: 'Шахматы',
        points: 1000,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        text: 'Кто является автором романа "Евгений Онегин"?',
        answer: 'Пушкин',
        category: 'Евгений Онегин',
        points: 200,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        text: 'Как зовут сестру Татьяны Лариной?',
        answer: 'Ольга',
        category: 'Евгений Онегин',
        points: 400,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        text: 'Какую книгу читал Евгений Онегин в начале романа?',
        answer: '"Путешествие из Петербурга в Москву"',
        category: 'Евгений Онегин',
        points: 600,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        text: 'Где произошла дуэль между Онегиным и Ленским?',
        answer: 'В роще, недалеко от дома Лариных.',
        category: 'Евгений Онегин',
        points: 800,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        text: 'Кого Татьяна выбрала в качестве мужа в финале романа?',
        answer: 'Генерала',
        category: 'Евгений Онегин',
        points: 1000,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        text: 'Какая страна является самой большой по территории в мире?',
        answer: 'Россия',
        category: 'Страны и народы',
        points: 200,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        text: 'Как называется народ, проживающий в Японии?',
        answer: 'Японцы',
        category: 'Страны и народы',
        points: 400,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        text: 'В какой стране находится самое высокое здание в мире — Бурдж-Халифа?',
        answer: 'В ОАЭ',
        category: 'Страны и народы',
        points: 600,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        text: 'Какой язык является самым распространенным в мире по числу носителей?',
        answer: 'Китайский',
        category: 'Страны и народы',
        points: 800,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        text: 'Какую страну называют "страной восходящего солнца"?',
        answer: 'Япония',
        category: 'Страны и народы',
        points: 1000,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        text: 'Какая река в Китае носит название, связанное с жёлтым цветом?',
        answer: 'Хуанхэ (Жёлтая река)',
        category: 'Желтая тема',
        points: 200,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        text: 'Какой фрукт жёлтого цвета считается символом тропиков?',
        answer: 'Банан',
        category: 'Желтая тема',
        points: 400,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        text: 'Как называется металл, который ассоциируется с жёлтым цветом?',
        answer: 'Золото',
        category: 'Желтая тема',
        points: 600,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        text: 'Какой жёлтый цветок часто называют вестником весны?',
        answer: 'Мимоза',
        category: 'Желтая тема',
        points: 800,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        text: 'Какой жёлтый объект является центральной звездой нашей солнечной системы?',
        answer: 'Солнце',
        category: 'Желтая тема',
        points: 1000,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
