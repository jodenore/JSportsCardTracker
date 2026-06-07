import { handleThemeSwitcher } from "./modules/theme.js";

import {
  renderBagStats,
  renderBagCards,
  handleRemoveCard,
  handleBagSubmit,
} from "./modules/cardBag.js";
import {
  renderCards,
  cardShopFilter,
  handleCardClick,
} from "./modules/cardShop.js";
import {
  handleCancelOrder,
  renderActiveOrders,
  renderOrderStats,
  renderPastOrders,
} from "./modules/orders.js";

handleThemeSwitcher();
renderCards();
cardShopFilter();
renderBagStats();
renderBagCards();
handleCardClick();
handleRemoveCard();
handleBagSubmit();
renderOrderStats();
renderActiveOrders();
renderPastOrders();
handleCancelOrder();
