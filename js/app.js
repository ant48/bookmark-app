//listen for form submit in jumbotron
document.getElementById('myForm').addEventListener('submit', saveBookmark);


function saveBookmark(evt) {
  //get form values
  var siteName = document.getElementById('siteName').value;
  console.log(siteName);
  var siteUrl = document.getElementById('siteUrl').value;

  //check validation
  if (!validateForm(siteName, siteUrl)) {
    return false;
  }

  //check if url has http, if not, add it in the url
  if (!siteUrl.match(/^[a-zA-Z]+:\/\//)) {
    //add http part if there is none in url
    siteUrl = 'http://' + siteUrl;
  }

  //create bookmark object
  let bookmark = {
    name: siteName,
    url: siteUrl
  }

  //check if bookmarks is null
  if(localStorage.getItem('bookmarks') === null) {
    //Init array
    var bookmarks = [];
    //add to array
    bookmarks.push(bookmark);
    //set to localStorage
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  } else {
    //get bookmarks from localStorage
    var bookmarks = JSON.parse(localStorage.getItem('bookmarks'));

    //check duplication
    if(!checkDuplicate(bookmark.url, bookmarks)) {
      return false;
    }

    //add bookmark to array
    bookmarks.push(bookmark);
    //reset back to localStorage
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  }

  /*local storage only store string*/

  //reset myForm
  resetform();

  //fetch bookmarks
  fetchBookmarks();

  //prevent form from submitting
  evt.preventDefault();
}

//reset form after submit
function resetform() {
  document.getElementById('myForm').reset();
}


//delete bookmarks
function deleteBookmark(url) {
  //get bookmarks from localStorage
  var bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
  //loop through bookmarks
  for (var i =0; i < bookmarks.length; i++) {
    if (bookmarks[i].url == url) {
      //remove from the array
      bookmarks.splice(i, 1);
    }
  }
  //reset back to localStorage
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks));

  //refetch bookmarks
  fetchBookmarks();
}

//fetch bookmarks
function fetchBookmarks() {
  var bookmarks = JSON.parse(localStorage.getItem('bookmarks'));

  //get output id
  var bookmarksResults = document.getElementById('bookmarksResults');

  //build output
  bookmarksResults.innerHTML = '';

  //loop
  for (var i = 0; i < bookmarks.length; i++) {
    var name = bookmarks[i].name;
    var url = bookmarks[i].url;

    bookmarksResults.innerHTML += '<li class="list-group-item">'
                                  +name+
                                  ' <a class="btn btn-outline-info btn-sm float-right" target="_blank" href="' +url+ '">Visit</a> ' + '<a onclick="deleteBookmark(\''+url+'\')" class="btn btn-outline-danger btn-sm float-right mr-1" href="#">Delete</a>' +'</li>';
  }
}

//validate the url
function validateForm(name, url) {
  //check if the form is not filled in as supposed
  if (!name || !url) {
    alert("Please fill in the form before submit");
    return false;
  }

  var expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
  var regex = new RegExp(expression);

  if (!(url.match(regex))) {
    alert('Please enter a valid URL');
    return false;
  }
  return true;
}

//check for duplication
function checkDuplicate(url, bookmarks) {
  for (var i = 0; i < bookmarks.length; i++) {
    if (url === bookmarks[i].url) {
      alert("You already bookmarked this link. Try another one.");
      return false;
    }
  }
  return true;
}
