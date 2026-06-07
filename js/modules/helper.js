import { userState } from "./data.js";

export const wait = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

export function generateOrderNumber() {
  return Math.floor(100000 + Math.random() * 9000430);
}

export function showToast(message, type = "success") {
  const toastElement = document.querySelector("#app-toast");
  const toastMessage = document.querySelector("#toast-message");

  if (!toastElement || !toastMessage) return;

  toastMessage.textContent = message;

  toastElement.classList.remove(
    "text-bg-success",
    "text-bg-danger",
    "text-bg-warning",
    "text-bg-primary",
  );

  if (type === "danger") {
    toastElement.classList.add("text-bg-danger");
  } else if (type === "warning") {
    toastElement.classList.add("text-bg-warning");
  } else if (type === "info") {
    toastElement.classList.add("text-bg-primary");
  } else {
    toastElement.classList.add("text-bg-success");
  }

  const toastInstance = bootstrap.Toast.getOrCreateInstance(toastElement, {
    delay: 2200,
  });

  toastInstance.show();
}

export function createShopCard(card) {
  const articleCard = document.createElement("article");
  const cardId = card.id;
  const ratingClass = getRatingClass(card.rating);
  articleCard.className = "shop-card";
  articleCard.dataset.cardId = cardId;

  articleCard.innerHTML = `<button class="shop-card-button" type="button">
    <div class="rating-badge ${ratingClass}">${card.rating}</div>

    <div class="shop-card-player">
      <img
        src="${card.image}"
        alt="${card.playerName} portrait"
        class="shop-card-image"
      />

      <div class="shop-card-info">
        <p class="shop-card-name">${card.playerName}</p>
        <p class="shop-card-meta">${card.sport[0].toUpperCase()}${card.sport.slice(1, card.sport.length)} • ${card.team}</p>
      </div>
    </div>

    <div class="shop-card-stats">
      <p class="shop-card-stat card-age">${card.age}</p>
      <p class="shop-card-stat card-rarity">+${card.rarity}</p>
      <p class="shop-card-stat card-value">£${card.value}</p>
      <p class="shop-card-stat card-impact">+${card.impact}</p>
    </div>
  </button>`;
  return articleCard;
}

export function createBagCard(card) {
  const articleCard = document.createElement("article");
  const cardId = card.id;
  const ratingClass = getRatingClass(card.rating);

  articleCard.classList = "bag-card";
  articleCard.dataset["cardId"] = cardId;

  articleCard.innerHTML = `
  <div class="rating-badge ${ratingClass} bag-rating">${card.rating}</div>
  <img
    src="${card.image}"
    alt="${card.playerName} portrait"
    class="bag-card-image"
  />

  <div class="bag-card-content">
    <p class="bag-card-name">${card.playerName}</p>
    <p class="bag-card-meta">${card.sport[0].toUpperCase()}${card.sport.slice(1, card.sport.length)} • ${card.team}</p>
    <div class="bag-card-stats">
      <span class="bag-card-rarity">+${card.rarity}</span>
      <span class="bag-card-value">£${card.value}</span>
      <button type="button" class="bag-card-remove">
        <i class="fa-solid fa-trash"></i>
      </button>
    </div>
  </div>
  `;
  return articleCard;
}

export function createActiveOrderObject({
  id,
  playerName,
  sport,
  team,
  rating,
  image,
}) {
  const estimatedDate = new Date();

  const randomExpectedDay = Math.floor(Math.random() * (1, 6));

  estimatedDate.setDate(estimatedDate.getDate() + randomExpectedDay);
  const fullDate = estimatedDate.toLocaleDateString("en-gb", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  let newOrder = {
    orderId: `${generateOrderNumber()}-${id}`,
    cardId: id,
    playerName,
    sport,
    team,
    rating,
    image,
    status: "preparing",
    date: fullDate,
    days: randomExpectedDay,
    deliveryText: `ETA: ${fullDate}`,
  };

  return newOrder;
}

export function createOrderCard(order, orderCategory) {
  const orderCardArticle = document.createElement("article");
  const orderId = order.orderId;
  const orderStatusStyles = getOrderStatus(order.status);
  orderCardArticle.className = "order-card";
  orderCardArticle.dataset["orderId"] = orderId;

  //  turn sport  into title case

  const sportTitle = order.sport[0].toUpperCase() + order.sport.slice(1);

  if (order.status === "cancelled") {
    orderCardArticle.classList.add("order-card-cancelled");
  }
  if (orderCategory === "active") {
    orderCardArticle.innerHTML = `
    <div class="order-card-head">
      <p class="order-card-id">Order #${order.orderId}</p>
      <div class="order-card-actions">
      <span class="order-status ${orderStatusStyles.className}">${orderStatusStyles.text}</span>
      <button type="button" class="order-cancel-button" data-order-id="${orderId}"><i class="fa-solid fa-xmark"></i>
      </button>
      </div>
    </div>
    <div class="order-card-body">
      <img
        src="${order.image}"
        alt="${order.playerName} card portrait"
        class="order-card-image"
      />
      <div class="order-card-content">
        <p class="order-card-name">${order.playerName}</p>
        <p class="order-card-meta">${sportTitle} • ${order.team}</p>
        <p class="order-card-delivery">${order.deliveryText}</p>
      </div>

    </div>
 `;
  } else {
    orderCardArticle.innerHTML = `
    <div class="order-card-head">
      <p class="order-card-id">Order #${order.orderId}</p>
      <span class="order-status ${orderStatusStyles.className}">${orderStatusStyles.text}</span>
    </div>
    <div class="order-card-body">
      <img
        src="${order.image}"
        alt="${order.playerName} card portrait"
        class="order-card-image"
      />
      <div class="order-card-content">
        <p class="order-card-name">${order.playerName}</p>
        <p class="order-card-meta">${sportTitle} • ${order.team}</p>
        <p class="order-card-delivery">${order.deliveryText}</p>
      </div>
    </div>
 `;
  }

  return orderCardArticle;
}

export function getRatingClass(rating) {
  let ratingClass = "";
  if (rating >= 90) {
    ratingClass = "rating-elite";
  } else if (rating >= 80) {
    ratingClass = "rating-great";
  } else if (rating >= 70) {
    ratingClass = "rating-strong";
  } else if (rating >= 60) {
    ratingClass = "rating-mid";
  } else {
    ratingClass = "rating-low";
  }
  return ratingClass;
}

export function findCardById(cardId) {
  const allCards = [...userState.cards.football, ...userState.cards.basketball];

  return allCards.find((card) => card.id === cardId || null);
}

export function getOrderStatus(status) {
  switch (status) {
    case "preparing":
      return {
        text: "Preparing",
        className: "status-preparing",
        isCancelled: "",
      };
    case "shipped":
      return {
        text: "Shipped",
        className: "status-shipped",
        isCancelled: "",
      };
    case "delivered":
      return {
        text: "Delivered",
        className: "status-delivered",
        isCancelled: "",
      };

    case "cancelled":
      return {
        text: "Cancelled",
        className: "status-cancelled",
        isCancelled: "order-card-cancelled",
      };
    default:
      return {
        text: "Unknown",
        className: "",
        isCancelled: "",
      };
  }
}
