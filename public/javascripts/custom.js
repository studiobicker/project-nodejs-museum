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

const searchAndFilter = () => {
  const searchField = document.getElementById("search");
  if (searchField) {
    const searchStr = searchField.value.toUpperCase();
    const items = document.querySelectorAll("[data-title]");
    for (let i = 0; i < items.length; i++) {
      const title = items[i].getAttribute("data-title");
      if (title.toUpperCase().indexOf(searchStr) > -1) {
        items[i].style.display = "";
      } else {
        items[i].style.display = "none";
      }
    }
  }
};

async function getMuseums(searchString) {
  try {
    debugger;
    const response = await axios.get(`museums/search/?museum=${searchString}`);
    return response.data;
  } catch (err) {
    console.log(err);
  }
}

function clearList() {
  document.getElementById("autocomplete-items").innerHTML = "";
}
