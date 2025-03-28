"use strict";
/*
ORDER:
net_total - decimal(12, 2)
tax - decimal(5, 2)
total - decimal(12, 2)

ORDER ITEM
net_price - decimal(12, 2)
quantity - unsigned int
net_total - decimal(12, 2)
total - decimal(12, 2)
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateOrder = exports.roundToTwoDecimals = void 0;
var roundToTwoDecimals = function (value) {
    return Math.round(value * 100) / 100;
};
exports.roundToTwoDecimals = roundToTwoDecimals;
var calculateOrder = function (order, taxRatePercent) {
    //validate negative tax rate on input
    if (taxRatePercent < 0) {
        taxRatePercent = -taxRatePercent;
    }
    order.order_items.forEach(function (item) {
        //validate input
        item.net_price = item.net_price < 0 ? -item.net_price : item.net_price;
        item.quantity = Math.trunc(item.quantity < 0 ? -item.quantity : item.quantity);
        item.net_total = (0, exports.roundToTwoDecimals)(item.net_price * item.quantity);
        item.total = (0, exports.roundToTwoDecimals)(item.net_total * (1 + taxRatePercent / 100));
    });
    order.net_total = order.order_items.reduce(function (sum, item) { return sum + (item.net_total || 0); }, 0);
    order.tax = (0, exports.roundToTwoDecimals)(order.net_total * (taxRatePercent / 100));
    order.total = (0, exports.roundToTwoDecimals)(order.net_total + order.tax);
    return order;
};
exports.calculateOrder = calculateOrder;
// // example usage
// const order: Order = {
//     net_total: null,
//     tax: null,
//     total: null,
//     order_items: [
//         { net_price: 123, quantity: 2, net_total: null, total: null },
//         { net_price: 12, quantity: 5, net_total: null, total: null }
//     ]
// };
//
// const taxRate: number = -23;
// console.log(calculateOrder(order, taxRate));
