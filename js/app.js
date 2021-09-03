const StorageCtrl = (function () {
  return {
    storeItem: (item) => {
      let items = [];
      if (!localStorage.getItem("items")) {
        items = [];
        items.push(item);
        return localStorage.setItem("items", JSON.stringify(items));
      }
      items = JSON.parse(localStorage.getItem("items"));
      items.push(item);
      return localStorage.setItem("items", JSON.stringify(items));
    },
    getItemsFromStorage: () => {
      let items;
      if (!localStorage.getItem("items")) {
        return (items = []);
      }
      items = JSON.parse(localStorage.getItem("items"));
      return items;
    },
    updateLocalStorage: (updatedItem) => {
      let items = JSON.parse(localStorage.getItem("items"));
      items.forEach((item, index) => {
        if (updatedItem.id === item.id) {
          items.splice(index, 1, updatedItem);
        }
      });
      localStorage.setItem("items", JSON.stringify(items));
    },
    deleteItemFromStorage: (itemId) => {
      let items = JSON.parse(localStorage.getItem("items"));
      items.forEach((itemId, index) => {
        if (itemId === item.id) {
          items.splice(index, 1);
        }
      });
      localStorage.setItem("items", JSON.stringify(items));
    },
    clearItemsFromStorage: () => {
      localStorage.removeItem("items");
    },
  };
})();

const ItemCtrl = (function () {
  const Item = function (id, name, price) {
    this.id = id;
    this.name = name;
    this.price = price;
  };

  const data = {
    items: StorageCtrl.getItemsFromStorage(),
    currentItem: null,
    totalPrice: 0,
  };

  return {
    getItems: function () {
      return data.items;
    },
    addItem: function (name, price) {
      let ID;
      if (data.items.length > 0) {
        ID = data.items[data.items.length - 1].id + 1;
      } else {
        ID = 0;
      }
      price = parseInt(price);

      newItem = new Item(ID, name, price);

      data.items.push(newItem);
      return newItem;
    },
    logData: function () {
      return data;
    },
    getTotalPrice: () => {
      let total = 0;
      data.items.forEach((item) => {
        total += item.price;
      });
      data.totalPrice = total;
      return data.totalPrice;
    },
    getItemById: (id) => {
      let found;
      data.items.forEach((item) => {
        if (item.id === id) {
          found = item;
        }
      });
      return found;
    },
    setCurrentItem: (item) => {
      data.currentItem = item;
    },
    getCurrentItem: () => {
      return data.currentItem;
    },
    updateItem: (name, price) => {
      price = parseInt(price);

      let found;
      data.items.forEach((item) => {
        if (item.id === data.currentItem.id) {
          item.name = name;
          item.price = price;
          found = item;
        }
      });
      return found;
    },
    deleteItem: (id) => {
      const ids = data.items.map((item) => {
        return item.id;
      });
      const index = ids.indexOf(id);
      data.items.splice(index, 1);
    },
    clearAllItems: () => {
      data.items = [];
      UiCtrl.populateItemList(data.items);
    },
  };
})();

const UiCtrl = (function () {
  const UiSelectors = {
    itemList: "#item-list",
    listItems: "#item-list li",
    addBtn: ".add-btn",
    itemNameInput: ".item-name",
    itemPriceInput: ".item-price",
    totalPrice: ".total-price",
    updateBtn: ".update-btn",
    deleteBtn: ".delete-btn",
    backBtn: ".back-btn",
    clearBtn: ".clear-btn",
    notifyContainer: ".notifyContainer",
  };
  const UiStyles = {
    liStyle: "flex justify-between border p-3 rounded-md",
  };
  return {
    populateItemList: function (items) {
      let html = "";

      items.forEach((item) => {
        html += `
        <li class="${UiStyles.liStyle}" id="item-${item.id}">
        <p class="font-bold text-gray-800">
            ${item.name} <span class="font-light">${item.price}</span>
          </p>
          <a class="p-2 rounded-full hover:bg-blue-300 transition duration-100 ease-in"
            href="#">
            <svg
            class="w-6 h-6 stroke-current text-gray-700 edit-item"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            ></path>
          </svg>
          </a>
          </li>

            
        `;
      });
      document.querySelector(UiSelectors.itemList).innerHTML = html;
    },
    notifyUser: (type, removeMessage) => {
      const notifyContainer = document.querySelector(
        UiSelectors.notifyContainer
      );
      let notifyTextStyle = {
        textColor: "",
        message: "",
      };
      function fadeOutMessage(toReplace, replaceWith) {
        setTimeout(
          () => notifyContainer.classList.replace(toReplace, replaceWith),
          3000
        );
      }
      (function typeOfMessage(type) {
        notifyContainer.classList.replace("opacity-0", "opacity-100");
        notifyContainer.classList.add("translate-y-1");
        fadeOutMessage("opacity-100", "opacity-0");
        if (type === "success") {
          notifyTextStyle.textColor = "text-yellow-600";
          notifyTextStyle.message = "Item successfully added";
        }
        if (type === "deleted") {
          notifyTextStyle.textColor = "text-red-600";
          notifyTextStyle.message = "Item successfully deleted";
        }
        if (type === "updated") {
          notifyTextStyle.textColor = "text-yellow-600";
          notifyTextStyle.message = "Item successfully updated";
        }
      })(type);
      // if (type === "success") {
      //   notifyTextStyle.textColor = "text-yellow-600";
      //   notifyTextStyle.message = "Item successfully added";
      //   notifyContainer.classList.replace("opacity-0", "opacity-100");
      //   notifyContainer.classList.add("translate-y-1");
      //   fadeOutMessage("opacity-100", "opacity-0");
      // }
      // if (type === "deleted") {
      //   notifyTextStyle.textColor = "text-red-600";
      //   notifyTextStyle.message = "Item successfully deleted";
      //   notifyContainer.classList.replace("opacity-0", "opacity-100");
      //   notifyContainer.classList.add("translate-y-1");
      //   fadeOutMessage("opacity-100", "opacity-0");
      // }
      // if (type === "updated") {
      //   notifyTextStyle.textColor = "text-yellow-600";
      //   notifyTextStyle.message = "Item successfully updated";
      //   notifyContainer.classList.replace("opacity-0", "opacity-100");
      //   notifyContainer.classList.add("translate-y-1");
      //   fadeOutMessage("opacity-100", "opacity-0");
      // }
      if (removeMessage) {
        notifyContainer.classList.replace("opacity-100", "opacity-0");
      }

      notifyContainer.innerHTML = `
      <div
      role="dialog"
      aria-labelledby="dialogTitle"
      class="flex items-center absolute top-0 inset-x-0 max-w-md mt-4 rounded-md mx-auto justify-between bg-gray-200 px-3 
      py-4"
    >
      <svg
        class="w-7 h-7 stroke-current ${notifyTextStyle.textColor}"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
        ></path>
      </svg>

      <h3 class="${notifyTextStyle.textColor}" id="dialogTitle">
        ${notifyTextStyle.message}
      </h3>
      <button class="cursor-pointer clear-modal  p-2 z-10" aria-label="close dialog">
        <svg
          class="w-6 h-6 stroke-current text-gray-700 pointer-events-none"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          ></path>
        </svg>
      </button>
    </div>
      `;
    },
    getItemInput: () => {
      return {
        name: document.querySelector(UiSelectors.itemNameInput).value,
        price: document.querySelector(UiSelectors.itemPriceInput).value,
      };
    },
    addListItem: (item) => {
      document.querySelector(UiSelectors.itemList).style.display = "block";
      const li = document.createElement("li");
      li.className = UiStyles.liStyle;
      li.id = `item-${item.id}`;
      li.innerHTML = `<p class="font-bold text-gray-800">
        ${item.name} <span class="font-light">${item.price}</span>
      </p>
      <a class="p-2 rounded-full hover:bg-blue-300 transition duration-100 ease-in"
        href="#">
        <svg
        class="w-6 h-6 stroke-current text-gray-700 edit-item "
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
        ></path>
      </svg>
      </a>`;

      document
        .querySelector(UiSelectors.itemList)
        .insertAdjacentElement("beforeend", li);
    },
    updateListItem: (item) => {
      let listItems = document.querySelectorAll(UiSelectors.listItems);
      listItems = Array.from(listItems);
      listItems.forEach((listItem) => {
        const itemId = listItem.getAttribute("id");
        if (itemId === `item-${item.id}`) {
          document.querySelector(`#${itemId}`).innerHTML = `
                <p class="font-bold text-gray-800">
                ${item.name} <span class="font-light">${item.price}</span>
              </p>
              <a class="p-2 rounded-full hover:bg-blue-300 transition duration-100 ease-in"
                href="#">
                <svg
                class="w-6 h-6 stroke-current text-gray-700 edit-item "
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                ></path>
              </svg>
              </a>`;
        }
      });
    },
    deleteListItem: (id) => {
      const itemId = `#item-${id}`;
      item = document.querySelector(itemId);
      item.remove();
    },
    removeItems: () => {
      let listItems = document.querySelectorAll(UiSelectors.listItems);
      listItems = Array.from(listItems);
      listItems.forEach((item) => {
        item.remove;
      });
    },

    clearInputs: () => {
      document.querySelector(UiSelectors.itemNameInput).value = "";
      document.querySelector(UiSelectors.itemPriceInput).value = "";
    },
    addItemToForm: () => {
      document.querySelector(UiSelectors.itemNameInput).value =
        ItemCtrl.getCurrentItem().name;
      document.querySelector(UiSelectors.itemPriceInput).value =
        ItemCtrl.getCurrentItem().price;
      UiCtrl.showEditState();
    },
    hideList: () => {
      document.querySelector(UiSelectors.itemList).style.display = "none";
    },
    showTotalPrice: (totalPrice) => {
      document.querySelector(
        UiSelectors.totalPrice
      ).textContent = `${totalPrice}`;
    },
    getSelectors: () => {
      return UiSelectors;
    },
    showEditState: () => {
      document.querySelector(UiSelectors.updateBtn).style.display = "flex";
      document.querySelector(UiSelectors.deleteBtn).style.display = "flex";
      document.querySelector(UiSelectors.backBtn).style.display = "flex";
      document.querySelector(UiSelectors.addBtn).style.display = "none";
    },
    clearEditState: () => {
      UiCtrl.clearInputs();
      document.querySelector(UiSelectors.updateBtn).style.display = "none";
      document.querySelector(UiSelectors.deleteBtn).style.display = "none";
      document.querySelector(UiSelectors.backBtn).style.display = "none";
      document.querySelector(UiSelectors.addBtn).style.display = "flex";
    },
  };
})();

const App = (function (ItemCtrl, StorageCtrl, UiCtrl) {
  const loadEventListeners = () => {
    const UiSelectors = UiCtrl.getSelectors();

    document
      .querySelector(UiSelectors.addBtn)
      .addEventListener("click", itemAddSubmit);

    document
      .querySelector(UiSelectors.notifyContainer)
      .addEventListener("click", clearModalOnClick);

    document
      .querySelector(UiSelectors.itemList)
      .addEventListener("click", itemEditClick);

    document
      .querySelector(UiSelectors.updateBtn)
      .addEventListener("click", itemUpdateSubmit);

    document
      .querySelector(UiSelectors.backBtn)
      .addEventListener("click", UiCtrl.clearEditState);
    document
      .querySelector(UiSelectors.deleteBtn)
      .addEventListener("click", itemDeleteSubmit);
    document
      .querySelector(UiSelectors.clearBtn)
      .addEventListener("click", clearItemsOnClick);
  };

  const itemAddSubmit = (e) => {
    const input = UiCtrl.getItemInput();
    if (input.name !== "" && input.price !== "") {
      const newItem = ItemCtrl.addItem(input.name, input.price);
      UiCtrl.addListItem(newItem);
      UiCtrl.notifyUser("success");
      const totalPrice = ItemCtrl.getTotalPrice();
      UiCtrl.showTotalPrice(totalPrice);

      StorageCtrl.storeItem(newItem);
      UiCtrl.clearInputs();
    }

    e.preventDefault();
  };

  const itemEditClick = (e) => {
    if (e.target.classList.contains("edit-item")) {
      const listId = e.target.parentNode.parentNode.id;
      const listIdArray = listId.split("-");
      const id = parseInt(listIdArray[1]);
      const itemToEdit = ItemCtrl.getItemById(id);

      ItemCtrl.setCurrentItem(itemToEdit);

      UiCtrl.addItemToForm();
    }

    e.preventDefault();
  };

  const clearModalOnClick = (e) => {
    if (e.target.classList.contains("clear-modal")) {
      console.log("click");
      UiCtrl.notifyUser(null, true);
    }

    e.preventDefault();
  };

  const itemUpdateSubmit = (e) => {
    const input = UiCtrl.getItemInput();

    const updatedItem = ItemCtrl.updateItem(input.name, input.price);

    UiCtrl.updateListItem(updatedItem);
    UiCtrl.notifyUser("updated");

    const totalPrice = ItemCtrl.getTotalPrice();
    UiCtrl.showTotalPrice(totalPrice);
    StorageCtrl.updateLocalStorage(updatedItem);
    UiCtrl.clearEditState();

    e.preventDefault(e);
  };

  const itemDeleteSubmit = (e) => {
    const currentItem = ItemCtrl.getCurrentItem();
    ItemCtrl.deleteItem(currentItem.id);

    UiCtrl.deleteListItem(currentItem.id);
    UiCtrl.notifyUser("deleted");
    const totalPrice = ItemCtrl.getTotalPrice();
    UiCtrl.showTotalPrice(totalPrice);
    StorageCtrl.deleteItemFromStorage(currentItem.id);
    UiCtrl.clearEditState();
    e.preventDefault();
  };

  const clearItemsOnClick = (e) => {
    ItemCtrl.clearAllItems();
    const totalPrice = ItemCtrl.getTotalPrice();
    UiCtrl.showTotalPrice(totalPrice);
    UiCtrl.removeItems();
    StorageCtrl.clearItemsFromStorage();
    UiCtrl.hideList();
  };

  return {
    init: function () {
      UiCtrl.clearEditState();

      const items = ItemCtrl.getItems();
      if (items.length === 0) {
        UiCtrl.hideList();
      }
      UiCtrl.populateItemList(items);

      const totalPrice = ItemCtrl.getTotalPrice();
      UiCtrl.showTotalPrice(totalPrice);

      loadEventListeners();
    },
  };
})(ItemCtrl, StorageCtrl, UiCtrl);
App.init();
