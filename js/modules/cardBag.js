import { userState } from "./data.js";
import {
  createBagCard,
  createActiveOrderObject,
  wait,
  showToast,
} from "./helper.js";
import {
  renderActiveOrders,
  renderPastOrders,
  renderOrderStats,
  startOrderProgress,
} from "./orders.js";
export function renderBagStats() {
  const bagCount = document.querySelector("#bag-count");
  const bagRarity = document.querySelector("#bag-rarity");
  const bagValue = document.querySelector("#bag-value");
  const confirmOrderButton = document.querySelector("#confirm-order");

  if (!bagCount || !bagRarity || !bagValue) return;

  let value = 0;
  let rarityTotal = 0;
  //   let isPlural = userState.bag.length === 1 ? "" : "s";

  //  get total values
  userState.bag.forEach((card) => {
    if (!card.value || !card.rarity) return;
    rarityTotal += card.rarity;
    value += card.value;
  });
  bagRarity.textContent = `+${rarityTotal}`;
  bagValue.textContent = `£${value}`;
  bagCount.textContent = `${userState.bag.length}`;
  confirmOrderButton.disabled = userState.bag.length === 0;
}

export function renderBagCards() {
  const cardBagList = document.querySelector(".card-bag-list");
  const baggedCards = userState.bag;
  if (!cardBagList) return;
  cardBagList.textContent = ``;
  let emptyBagHTML = `<div class="empty-state">
  <p class="empty-state-title">No cards in your bag yet</p>
  <p class="empty-state-text">
    Add cards from the shop to build your next order.
  </p>
</div>`;
  if (userState.bag.length === 0) {
    cardBagList.innerHTML = emptyBagHTML;
    return;
  }

  baggedCards.forEach((card) => {
    cardBagList.append(createBagCard(card));
  });
}

export function handleRemoveCard() {
  const cardBagList = document.querySelector(".card-bag-list");
  if (!cardBagList);

  cardBagList.addEventListener("click", (event) => {
    const trashButton = event.target.closest(".bag-card-remove");
    if (!trashButton) return;

    const bagCard = trashButton.closest(".bag-card");

    const cardId = bagCard.dataset.cardId;
    const cardToRemove = userState.bag.find((card) => {
      return card.id === cardId;
    });

    userState.bag = userState.bag.filter((card) => card.id !== cardId);
    showToast(
      `Removed ${cardToRemove.playerName} from the Card Bag`,
      "warning",
    );
    renderBagStats();
    renderBagCards();
  });
}

export function handleBagSubmit() {
  const confirmOrderButton = document.querySelector("#confirm-order");
  if (!confirmOrderButton) return;

  confirmOrderButton.addEventListener("click", async () => {
    if (userState.bag.length === 0) return;
    for (const bagCard of userState.bag) {
      await wait(3000);
      const newOrder = createActiveOrderObject(bagCard);
      showToast(`Order #${newOrder.orderId} is preparing`, "success");
      userState.activeOrders.push(newOrder);
      userState.bag = userState.bag.filter((card) => {
        return card.id !== bagCard.id;
      });
      startOrderProgress(newOrder.orderId);
      confirmOrderButton.textContent = `Confirming ${bagCard.playerName} of ${userState.bag.length}.....`;
      renderOrderStats();
      renderActiveOrders();
      renderPastOrders();
      renderBagStats();
      renderBagCards();
    }

    showToast(`All orders added to Order Tracking`, "success");

    confirmOrderButton.textContent = "Confirm Order";
    confirmOrderButton.disabled = userState.bag.length === 0;
  });
}

// No cards in your bag yet.
