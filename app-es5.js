// Book Constructor
function Book(title, author, isbn) {
  this.title = title;
  this.author = author;
  this.isbn = isbn;
}

//UI Constructor
function UI() {}

UI.prototype.addBookToList = function(book) {
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
};

// Delete Book
UI.prototype.deleteBook = function(target) {
  if (target.className === "delete") {
    //to get the <tr> must go up 2 levels of DOM
    target.parentElement.parentElement.remove();
  }
};
// Clear the input fields after a submission
UI.prototype.clearFields = function() {
  document.getElementById("title").value = "";
  document.getElementById("author").value = "";
  document.getElementById("isbn").value = "";
};
// Create a 'flash' message that appears above the form
UI.prototype.showAlert = function(msg, className) {
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
};

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
    //Add book to list
    ui.addBookToList(book);
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

  ui.deleteBook(e.target);

  ui.showAlert("Book Removed", "success");
});
