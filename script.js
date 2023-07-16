const modal = document.getElementById("modal");
const form = document.form;
let bookPosition;

//Book object properties
class Book {
  constructor(title, author, pages, cover, read) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.cover = cover;
    this.read = read ? 'Completed' : 'Unread';
  }
}

class Library {
  constructor() {
    this.books = []
  }
  addBook(book) {
    this.books.push(book)
  }
  removeBook(position) {
    this.books.splice(position, 1)
  }
  getBook(position) {
    return this.books[position]
  }
}

const myLibrary = new Library;

// Create html container for book
const displayBook = (book) => {
  const library = document.getElementById('library');
  const bookCard = document.createElement('div');
  const imgContainer = document.createElement('div');
  const title = document.createElement('p');
  const author = document.createElement('p');
  const pages = document.createElement('p');
  const read = document.createElement('p');
  const cover = document.createElement('img')
  const deleteBtn = document.createElement('button');
  const deleteIcon = document.createElement('span');
  const pageIcon = document.createElement('span');
  bookCard.setAttribute('position', myLibrary.books.indexOf(book))
  const bookcover_url = `https://www.googleapis.com/books/v1/volumes?q=isbn:${book.cover}&key=AIzaSyCEeZJZMFl6OkBhuTGrmltm4GWbuyqZXlY`;
  fetch(bookcover_url)
    .then(response => response.json())
    .then(response => cover.src = response.items[0].volumeInfo.imageLinks.thumbnail)
    .then(url => console.log(url))
  title.textContent = `${book.title}`;
  author.textContent = `${book.author}`;
  pages.textContent = `${book.pages}`;
  read.textContent = `${book.read}`;
  deleteIcon.textContent = "delete";
  pageIcon.textContent = "auto_stories";
  title.className = "title";
  author.className = "author";
  pages.className = "pages";
  read.className = 'read'
  cover.className = "cover";
  cover.id = "cover";
  imgContainer.className = "container";
  deleteBtn.className = "deleteBtn";
  bookCard.className = "book-card";
  deleteIcon.className = "material-symbols-outlined";
  pageIcon.className = "material-symbols-outlined";
  deleteBtn.onclick = function() {
    const parent = this.parentNode.parentNode;
    const bookPosition = parent.getAttribute('position');
    myLibrary.removeBook(bookPosition);
    parent.remove();
    for (let i = +bookPosition + 1; i <= myLibrary.books.length; i++) {
      console.log(`i is ${i}`)
      let element = document.querySelector(`[position="${i}"]`);
      console.log(`Element is ${element}`);
      let elementValue = element.getAttribute('position');
      console.log(`Value is ${elementValue}`);
      element.setAttribute('position', `${elementValue - 1}`);
    }
  };
  cover.onclick = function() {
    let thisBook = this.parentNode.parentNode;
    bookPosition = thisBook.getAttribute('position');
    book = myLibrary.books[bookPosition];
    console.log(bookPosition, book);
    form.className = 'edit'
    form.elements['title'].value = book.title;
    form.elements['author'].value = book.author;
    form.elements['pages'].value = book.pages;
    form.elements['cover'].value = book.cover;
    form.elements['read'].checked = (() => book.read == 'Completed' ? true : false)();
    modal.style.display = "block";
  };
  deleteBtn.appendChild(deleteIcon);
  imgContainer.appendChild(cover);
  imgContainer.appendChild(deleteBtn);
  bookCard.append(imgContainer, title, author, pages, read);
  pages.appendChild(pageIcon);
  library.prepend(bookCard);
}

// Create new book from form data and add to myLibrary
const createBook = () => {
  let newBook = new Book(form.title.value, form.author.value, form.pages.value, form.cover.value, form.read.checked);
  myLibrary.addBook(newBook);
  displayBook(myLibrary.books.at(-1))
}

// Open new book modal
const modalBtn = document.getElementById("modalBtn");
modalBtn.onclick = function() {
  form.className = 'new'
  modal.style.display = "block";
}

// Remove element on click
const removeElement = (e) => {
  let parent = e.parentNode;
  parent.remove();
}

// Close modal when clicking outside
const modalOuter = document.getElementById('modal')
modalOuter.addEventListener('mousedown', function(event) {
  const isOutside = !event.target.closest('#form');
  console.log(isOutside);
  if (isOutside) {
    closeModal();
    resetModal();
  }
})

// Hide the modal using display 'none'
function closeModal() {
  modal.style.display = "none";
}

function resetModal() {
  document.getElementById("form").reset();
}

// Submit and reset form
function submitForm(event) {
  createBook();
  resetModal();
  closeModal();
}

// Submit form
form.addEventListener('submit', event => {
  event.preventDefault();
  submit()
});

function submit() {
  if (form.className == 'new') {
    submitForm();
    console.log('new');
  }
  else if (form.className == 'edit') {
    element = document.querySelector(`[position="${bookPosition}"]`)
    book = myLibrary.books[bookPosition]
    book.title = form.elements['title'].value;
    book.author = form.elements['author'].value;
    book.pages = form.elements['pages'].value;
    book.cover = form.elements['cover'].value;
    book.read = (() => form.elements['read'].checked == true ? 'Completed' : 'Unread')();
    element.querySelector('.title').textContent = book.title;
    element.querySelector('.author').textContent = book.author;
    element.querySelector('.pages').childNodes[0].textContent = book.pages;
    element.querySelector('.read').textContent = (() => form.elements['read'].checked == true ? 'Completed' : 'Unread')();
    let bookcover_url = `https://www.googleapis.com/books/v1/volumes?q=isbn:${book.cover}&key=AIzaSyCEeZJZMFl6OkBhuTGrmltm4GWbuyqZXlY`;
    fetch(bookcover_url)
      .then(response => response.json())
      .then(response => element.querySelector('.cover').src = response.items[0].volumeInfo.imageLinks.thumbnail)
      .then(url => console.log(url))
    resetModal();
    closeModal();
    console.log('edit');
  }
}

// Create and display default Library Books on load
(() => {
  const book1 = new Book('The Hobbit', 'J.R.R. Tolkien', 295, '9780544003415', false),
    book2 = new Book('Surrounded by Idiots', 'Thomas Erikson', 186, '9781250179944', true);
  myLibrary.addBook(book1);
  myLibrary.addBook(book2);
  myLibrary.books.forEach((book) => displayBook(book));
})()