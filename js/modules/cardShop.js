import { renderBagCards, renderBagStats } from "./cardBag.js";
import { userState } from "./data.js";
import { createShopCard, findCardById, showToast } from "./helper.js";

export async function renderCards() {
  const cardList = document.querySelector(".card-list");
  const selectedCards = userState.cards[userState.selectedFilter];
  if (!cardList) return;

  cardList.textContent = "";

  selectedCards.sort((cardA, cardB) => {
    if (cardA.rating < cardB.rating) {
      return 1;
    } else {
      return -1;
    }
  });

  selectedCards.forEach((card) => {
    cardList.append(createShopCard(card));
  });
  syncActiveFilter();
}

function syncActiveFilter() {
  const filterButtons = document.querySelectorAll(".filter-button");
  if (!filterButtons.length === 0) return;
  filterButtons.forEach((filterButton) => {
    const sportToSelect = filterButton.dataset.sport;
    filterButton.classList.toggle("active-filter", false);
    if (sportToSelect === userState.selectedFilter) {
      filterButton.classList.toggle("active-filter", true);
    }
  });
}

export function cardShopFilter() {
  const filterButtons = document.querySelectorAll(".filter-button");
  if (filterButtons.length === 0) return;

  filterButtons.forEach((filterButton) => {
    const sportToSelect = filterButton.dataset.sport;
    filterButton.addEventListener("click", () => {
      userState.selectedFilter = sportToSelect;
      renderCards();
      handleCardClick();
      syncActiveFilter();
    });
  });
}

export function handleCardClick() {
  const allShopCards = document.querySelectorAll(".shop-card");

  allShopCards.forEach((card) => {
    const cardId = card.dataset.cardId;
    const selectedCard = findCardById(cardId);
    const cardButton = card.querySelector(".shop-card-button");
    if (!selectedCard) return;

    cardButton.addEventListener("click", () => {
      const isDuplicate =
        userState.bag.findIndex((card) => card.id === cardId) !== -1;
      if (isDuplicate) {
        showToast("Duplicate Card.", "danger");
        return;
      }
      showToast(`Added ${selectedCard.playerName} to Card Bag`, "success");
      userState.bag.push(selectedCard);
      renderBagCards();
      renderBagStats();
    });
  });
}
