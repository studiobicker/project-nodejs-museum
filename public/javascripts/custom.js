let toggle = document.querySelector(".hamburger-menu");
let siteHeader = document.querySelector(".site-header");

toggle.addEventListener("click", function(e) {
  e.preventDefault();
  if (siteHeader.classList.contains("toggledOn")) {
    siteHeader.classList.remove("toggledOn");
  } else {
    siteHeader.classList.add("toggledOn");
  }
});

const deleteMyListItems = document.querySelectorAll(".my-list__icon.delete");
if (deleteMyListItems) {
  deleteMyListItems.forEach(function(deleteMyListItem) {
    deleteMyListItem.addEventListener("click", () => {
      const listItem = deleteMyListItem.closest(".list-item");
      const listItemId = listItem.dataset.id;
      window.location = `/mylist/remove/${listItemId}`;
    });
  });
}

const gridItems = document.querySelectorAll(".grid-content-link");
if (gridItems) {
  gridItems.forEach(function(gridItem) {
    gridItem.addEventListener("click", function() {
      const anker = gridItem.querySelector("a");
      window.location = anker.getAttribute("href");
    });
  });
}

window.onload = async function() {
  const searchField = document.getElementById("search");
  if (searchField) {
    searchField.onkeyup = findMuseum();
  }
  async function findMuseum() {
    debugger;
    clearList();

    const searchString = document.getElementById("search").value;
    const autocompleteItems = document.getElementById("autocomplete-items");

    let museumArray = await getMuseums(searchString);
    if (museumArray) {
      for (let i = 0; i < museumArray.length; i++) {
        let suggestion = document.createElement("DIV");
        suggestion.innerHTML += museumArray[i].title;
        suggestion.innerHTML += `<input type="hidden" value="${museumArray[i].title}"></div>`;
        suggestion.addEventListener("click", function(e) {
          /*insert the value for the autocomplete text field:*/
          document.getElementById("search").value = this.getElementsByTagName(
            "input"
          )[0].value;
          /*close the list of autocompleted values,
          (or any other open lists of autocompleted values:*/
          clearList();
        });
        autocompleteItems.appendChild(suggestion);
      }
    }
  }

  async function getMuseums(searchString) {
    try {
      debugger;
      const response = await axios.get(
        `museums/search/?museum=${searchString}`
      );
      return response.data;
    } catch (err) {
      console.log(err);
    }
  }

  function clearList() {
    document.getElementById("autocomplete-items").innerHTML = "";
  }
};
