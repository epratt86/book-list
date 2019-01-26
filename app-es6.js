class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

class UI {
  addBookToList(book) {
    // Grab book-list from the UI
    const list = document.getElementById("book-list");
    // Create a Row for book being added
    const row = document.createElement("tr");
    // Insert cols
    row.innerHTML = `
    <td>${book.title}</td>
    <td>${book.author}</td>
    <td>${book.isbn}</td>
    <td><a href="#" class="delete">X</a></td>
  `;

    list.appendChild(row);
  }

  showAlert(msg, className) {
    //create div
    const div = document.createElement("div");
    // add classes
    div.className = `alert ${className}`;
    //add text
    div.appendChild(document.createTextNode(msg));
    //get parent
    const container = document.querySelector(".container");
    //get form
    const form = document.querySelector("#book-form");
    //insert the alert div before the book-form
    container.insertBefore(div, form);
    //timeout after 3 seconds
    setTimeout(function() {
      document.querySelector(".alert").remove();
    }, 3000);
  }

  deleteBook(target) {
    if (target.className === "delete") {
      //to get the <tr> must go up 2 levels of DOM
      target.parentElement.parentElement.remove();
    }
  }

  clearFields() {
    document.getElementById("title").value = "";
    document.getElementById("author").value = "";
    document.getElementById("isbn").value = "";
  }
}

class Storage {
  static getBooks() {
    let books;
    if (localStorage.getItem("books") === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem("books"));
    }
    return books;
  }

  static displayBooks() {
    const books = Storage.getBooks();

    books.forEach(book => {
      const ui = new UI();

      //Add book to UI
      ui.addBookToList(book);
    });
  }

  static addBook(book) {
    const books = Storage.getBooks();

    books.push(book);
    // update LS
    localStorage.setItem("books", JSON.stringify(books));
  }

  static removeBook(isbn) {
    const books = Storage.getBooks();

    books.forEach((book, index) => {
      // if the isbn# matches a book object in LS
      if (book.isbn === isbn) {
        books.splice(index, 1);
      }
    });
    //update LS
    localStorage.setItem("books", JSON.stringify(books));
  }
}

// Event Listener for DOM
document.addEventListener("DOMContentLoaded", Storage.displayBooks);

//Event Listener for adding book
document.getElementById("book-form").addEventListener("submit", function(e) {
  e.preventDefault();
  // Get form values
  const title = document.getElementById("title").value,
    author = document.getElementById("author").value,
    isbn = document.getElementById("isbn").value;

  // Instantiate book
  const book = new Book(title, author, isbn);

  // Instantiate UI
  const ui = new UI();

  // Validate form entry
  if (title === "" || author === "" || isbn === "") {
    // Show Error
    ui.showAlert("Please fill in all fields", "error");
  } else {
    //Add book to UI
    ui.addBookToList(book);
    // Add book to Storage - No need to instantiate for static methods
    Storage.addBook(book);
    // Show success message
    ui.showAlert("Book Added!", "success");
    // Clear fields
    ui.clearFields();
  }
});

//Event Listener for delete book - Grab the parent element
document.getElementById("book-list").addEventListener("click", function(e) {
  e.preventDefault();

  const ui = new UI();
  //remove from UI
  ui.deleteBook(e.target);

  //remove from LS - Traverse DOM to get isbn#
  Storage.removeBook(e.target.parentElement.previousElementSibling.textContent);

  ui.showAlert("Book Removed", "success");
});
