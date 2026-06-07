import { userState } from "./data.js";
import { createOrderCard, showToast, wait } from "./helper.js";

export function renderOrderStats() {
  const [
    activeOrdersStat,
    currentlyPreparingStat,
    shippedOrdersStat,
    deliveredOrdersStat,
    cancelledOrdersStat,
  ] = document.querySelectorAll(".order-stat");

  const orderStatsLength = document.querySelectorAll(".order-stat").length;
  if (orderStatsLength !== 5) return;

  //   Active orders
  const activeOrderCount = userState.activeOrders.length;
  const currentlyPreparingCount = userState.activeOrders.filter((order) => {
    return order.status === "preparing";
  }).length;

  const shippedOrdersCount = userState.activeOrders.filter((order) => {
    return order.status === "shipped";
  }).length;

  activeOrdersStat.textContent = `${activeOrderCount} active orders`;
  currentlyPreparingStat.textContent = `${currentlyPreparingCount} preparing`;

  shippedOrdersStat.textContent = `${shippedOrdersCount} shipped`;

  // Past Orders

  const deliveredOrdersStatCount = userState.pastOrders.filter((order) => {
    return order.status === "delivered";
  }).length;

  const cancelledOrdersStatCount = userState.pastOrders.filter((order) => {
    return order.status === "cancelled";
  }).length;

  deliveredOrdersStat.textContent = `${deliveredOrdersStatCount} delivered`;
  cancelledOrdersStat.textContent = `${cancelledOrdersStatCount} cancelled`;
}

export function renderActiveOrders() {
  const activeOrdersList = document.querySelector(".order-summary-list");
  if (!activeOrdersList) return;
  activeOrdersList.textContent = "";
  const emptyOrdersHTML = `<div class="empty-state">
  <p class="empty-state-title">No active orders yet</p>
  <p class="empty-state-text">
    Confirmed card orders will appear here once tracking begins.
  </p>
</div>`;
  if (userState.activeOrders.length === 0) {
    activeOrdersList.innerHTML = emptyOrdersHTML;
    return;
  }

  userState.activeOrders.forEach((order) => {
    activeOrdersList.append(createOrderCard(order, "active"));
  });
}

export function renderPastOrders() {
  const pastOrdersList = document.querySelector(".past-orders-list");
  if (!pastOrdersList) return;

  pastOrdersList.textContent = "";
  const emptyPastOrdersHTML = `<div class="empty-state">
  <p class="empty-state-title">No order history yet

</p>
  <p class="empty-state-text">
    Delivered and cancelled orders will appear here.
  </p>
</div>`;
  if (userState.pastOrders.length === 0) {
    pastOrdersList.innerHTML = emptyPastOrdersHTML;
    return;
  }

  userState.pastOrders.forEach((order) => {
    pastOrdersList.append(createOrderCard(order, "past"));
  });
}

export async function startOrderProgress(orderId) {
  await wait(2500);
  let activeOrder = userState.activeOrders.find((order) => {
    return order.orderId === orderId;
  });
  if (!activeOrder) return;
  if (activeOrder.status !== "preparing") return;
  activeOrder.status = "shipped";
  showToast(`Order ${activeOrder.orderId} has shipped`, "info");

  renderActiveOrders();
  renderOrderStats();

  await wait(activeOrder.days + 7000);
  activeOrder = userState.activeOrders.find((order) => {
    return order.orderId === orderId;
  });
  activeOrder.status = "delivered";
  activeOrder.deliveryText = `Delivered: ${activeOrder.date}`;
  renderActiveOrders();
  showToast(`Order ${activeOrder.orderId} has been delivered`, "success");
  await wait(1500);

  userState.pastOrders.push(activeOrder);
  userState.activeOrders = userState.activeOrders.filter((order) => {
    return order.orderId !== activeOrder.orderId;
  });
  renderActiveOrders();
  renderPastOrders();
  renderOrderStats();
}

export async function cancelActiveOrder(orderId) {
  await wait(400);

  const cancelledOrder = userState.activeOrders.find((order) => {
    return order.orderId === orderId;
  });

  cancelledOrder.status = "cancelled";
  cancelledOrder.deliveryText = `Cancelled ${cancelledOrder.date}`;

  userState.pastOrders.push(cancelledOrder);

  userState.activeOrders = userState.activeOrders.filter((order) => {
    return order.orderId !== cancelledOrder.orderId;
  });

  showToast(`Order ${cancelledOrder.orderId} has been cancelled`, "danger");

  renderActiveOrders();
  renderPastOrders();
  renderOrderStats();
}

export function handleCancelOrder() {
  const activeOrdersList = document.querySelector(".order-summary-list");
  if (!activeOrdersList) return;

  activeOrdersList.addEventListener("click", async (event) => {
    const cancelButton = event.target.closest(".order-cancel-button");
    if (!cancelButton) return;

    const orderId = cancelButton.dataset.orderId;
    cancelButton.disabled = true;
    cancelActiveOrder(orderId);
  });
}
