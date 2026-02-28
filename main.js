const saveToLocalStorage = () => {
  // JSON.stringify(library) массив в string
  // localStorage.setItem сохраняет значение в ключ "library"
  localStorage.setItem("library", JSON.stringify(library));
};

// Исходный массив объектов (книг)
const defaultBooks = [
  {
    title: "Война и мир",
    author: "Толстой",
    isAvailable: true,
    isEditing: false,
  },
  { title: "Детство", author: "Толстой", isAvailable: true, isEditing: false },
  { title: "Калитка", author: "Папка", isAvailable: true, isEditing: false },
  {
    title: "Преступление и наказание",
    author: "Достоевский",
    isAvailable: false,
    isEditing: false,
  },
  { title: "Треш", author: "Аноним", isAvailable: true, isEditing: false },
];

const list = document.getElementById("book-list"); // контейнер <ul>
// Переменные input и button
const authorInput = document.getElementById("author-input");
const titleInput = document.getElementById("title-input");
const addBook = document.getElementById("addBook-button");
addBook.classList.add("btn-round");
addBook.title = "Добавить книгу";
const findInput = document.getElementById("find-input");
const findBook = document.getElementById("find-button");
findBook.classList.add("btn-round");
findBook.title = "Найти книгу";

const findIcon = document.querySelector("fi fi-rr-search");

// масиив library = старым сохраненным string, собранным в массив
// либо library = исходным объктам book, child...
let library = JSON.parse(localStorage.getItem("library")) || defaultBooks;

// Функция обновленной отрисовки для найденных книг по поиску
const updateUI = (ui) => {
  const query = findInput.value.toLowerCase(); // значение поля поиска

  // Создаем отфильтрованный массив
  const filterBooks = library.filter(
    (book) =>
      book.title.toLowerCase().includes(query) ||
      book.author.toLowerCase().includes(query),
  );
  // Рисуем отфильтрованные книги, но если пусто, то просто рисуются все книги
  renderLibrary(filterBooks);
};

// Поиск книги
findBook.addEventListener("click", (event) => {
  event.preventDefault();
  updateUI();
});

const header = document.querySelector("add-book-container");

// Общая подсказка
const tooltipAll = document.createElement("span");
tooltipAll.className = "tooltip-all-span";
tooltipAll.textContent = "Заполните все поля!";

// Добавление книги
addBook.addEventListener("click", (event) => {
  event.preventDefault(); // предотвратить перезагрузку страницы

  // Проверка пустых полей Автор, Название
  if (authorInput.value && titleInput.value) {
    //добавляем объект в конец массива
    library.push({
      title: titleInput.value,
      author: authorInput.value,
      isAvailable: true,
      isEditing: false,
    });
    // Очистка значений input
    authorInput.value = "";
    titleInput.value = "";
    saveToLocalStorage(); // Сохраняем массив на склад
    updateUI();
    console.log(library);
  } else {
    // alert("Заполните оба поля!");
    if (!header.querySelector(".tooltip-all-span")) {
      header.appendChild(tooltipAll);
    }
    header.appendChild(tooltipAll);
  }
});

// Функция отрисовки (принимает массив items, по умолчанию — library)
const renderLibrary = (items = library) => {
  list.innerHTML = ""; // полностью стирает

  // Проверка наличия книг в массиве
  if (items.length === 0) {
    list.innerHTML = "<li>Ничего не найдено</li>";
    return; // Выходим из функции, если список пуст
  }

  // Цикл построения списка книг
  for (const element of items) {
    // Карточка книги
    const card = document.createElement("div");
    card.className = "book-card";

    const cardIcon = document.createElement("div");
    cardIcon.className = "icon-card";

    card.appendChild(cardIcon);

    const statusText = element.isAvailable ? "ДОСТУПНА" : "ВЫДАНА";
    card.classList.add(
      element.isAvailable ? "status-available" : "status-taken",
    );

    // Создаем элемент индикатора
    const badge = document.createElement("span");
    badge.className = "status-badge";
    badge.textContent = statusText;
    card.prepend(badge); // Добавляем в начало карточки

    // Кнопка Удалить книгу
    const deleteBook = document.createElement("button");
    deleteBook.className = "deleteBook-button";
    deleteBook.classList.add("btn-round");
    const deleteIcon = document.createElement("i");
    deleteIcon.className = "fi fi-rr-trash";
    deleteBook.title = "Удалить книгу";
    deleteBook.append(deleteIcon);

    //Удаление книги
    deleteBook.addEventListener("click", (event) => {
      event.stopPropagation(); // остановит «всплытие» других "click"
      //удаляем книгу
      library = library.filter((book) => book !== element);
      saveToLocalStorage(); // Сохраняем массив на склад
      updateUI(); //Отрисует новый список книг
    });

    // Подсказка
    const tooltip = document.createElement("span");
    tooltip.className = "tooltip-span";
    tooltip.textContent = "Заполните все поля!";

    //Проверка редактирования выбранной книги
    if (element.isEditing === true) {
      // Рисуем форму в режиме редактирования

      // Input при редактировании
      const editTitle = document.createElement("input"); //input для cardTitle
      const editAuthor = document.createElement("input"); //input для cardTitle
      editTitle.className = "edit-title-input";
      editAuthor.className = "edit-author-input";

      // Наполняем Input данными
      editTitle.value = element.title; // Вносим текущее название в input
      editAuthor.value = element.author; // Вносим текущего автора в input

      //Вручную редактируем название и автора книги

      // Добавляем Input в карточку
      card.appendChild(editTitle);
      card.appendChild(editAuthor);

      editTitle.focus(); //срабатывает после официального существования editTitle

      //Функция Принять Изменения Редактирования
      const applyChanges = () => {
        //проверка пустого названия
        if (editTitle.value.trim() !== "" && editAuthor.value.trim() !== "") {
          // Обновляем название и автора после редактирования
          element.title = editTitle.value;
          element.author = editAuthor.value;
          //Выкл. Режим редактирования
          element.isEditing = false;
          saveToLocalStorage();
          updateUI(); //Отрисует новый список книг
        } else {
          if (!card.querySelector(".tooltip-span")) {
            card.appendChild(tooltip);
          }
        }
      };

      // Кнопка Назад при редактировании
      const cancelBtn = document.createElement("button");
      cancelBtn.className = "cancelBtn";
      cancelBtn.classList.add("btn-round");
      const cancelIcon = document.createElement("i");
      cancelIcon.className = "fi fi-rr-arrow-small-left";
      cancelIcon.title = "Назад";
      cancelBtn.append(cancelIcon); // вносим иконку в кнопку

      // Назад при редактировании книги
      cancelBtn.addEventListener("click", () => {
        //Выкл. Режим редактирования
        element.isEditing = false;
        saveToLocalStorage();
        updateUI(); //Отрисует новый список книг
      });

      // card.appendChild(cancelBtn);
      cardIcon.appendChild(cancelBtn);

      // Кнопка Сохранить книгу
      const saveBook = document.createElement("button");
      saveBook.className = "saveBook-button";
      saveBook.classList.add("btn-round");
      const saveIcon = document.createElement("i");
      // saveIcon.className = "fi fi-rr-add";
      saveIcon.className = "fi fi-rr-plus-small";
      saveBook.title = "Сохранить книгу";
      saveBook.append(saveIcon);

      //Сохранение книги
      saveBook.addEventListener("click", (event) => {
        event.stopPropagation(); // остановит «всплытие» других "click"
        applyChanges();
      });

      // card.appendChild(saveBook);
      cardIcon.appendChild(saveBook);
    } else {
      // Рисуем форму обычной карточки

      // Название книги
      const cardTitle = document.createElement("h3");
      cardTitle.className = "h3-title";
      cardTitle.textContent = element.title;

      // Автор книги
      const cardAuthor = document.createElement("p");
      cardAuthor.className = "p-author";
      cardAuthor.textContent = element.author;

      // Кнопка Изменить книгу
      const changeBook = document.createElement("button");
      changeBook.className = "changeBook-button";
      changeBook.classList.add("btn-round");
      const changelIcon = document.createElement("i");
      changelIcon.className = "fi fi-rr-file-edit";
      changeBook.title = "Изменить книгу";
      changeBook.append(changelIcon); // вносим иконку в кнопку

      //Определяем цвет и содержание
      if (element.isAvailable) {
        card.classList.add("status-available"); // Книга доступна
        // cardTitle.style.color = "green"; //книга доступна
        cardTitle.textContent = element.title;
      } else {
        card.classList.add("status-taken"); // Книга на руках
        // cardTitle.style.color = "blue"; //книга на руках
        cardTitle.textContent = `${element.title} (на руках) `;
      }

      // Смена статуса книги
      cardTitle.addEventListener("click", () => {
        element.isAvailable = !element.isAvailable;
        saveToLocalStorage(); // Сохраняем массив на склад
        updateUI(); // Перерисует основной список
      });

      // Редактирование книги
      changeBook.addEventListener("click", () => {
        // Вкл. Режим редактирования
        element.isEditing = true;

        // Отрисует форму с отредактированной книгой
        updateUI();
      });

      //Построение элементов карточки
      // card.appendChild(changeBook);
      cardIcon.appendChild(changeBook);
      // card.appendChild(deleteBook);
      cardIcon.appendChild(deleteBook);
      card.appendChild(cardTitle);
      card.appendChild(cardAuthor);
    }

    //Добавляем готовую card в list
    list.appendChild(card);
  }
};

// Вызов функции отрисовки книг при загрузке страницы
updateUI();
