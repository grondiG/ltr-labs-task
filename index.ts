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

export interface Order {
    net_total: number | null;
    tax: number | null;
    total: number | null;
    order_items: OrderItem[];
}

export interface OrderItem {
    net_price: number;
    quantity: number;
    net_total: number | null;
    total: number | null;
}

export const roundToTwoDecimals = (value: number): number => {
    return Math.round(value * 100) / 100;
}

export const calculateOrder = (order: Order, taxRatePercent: number): Order => {
    //validate negative tax rate on input
    if (taxRatePercent < 0) {
        taxRatePercent = -taxRatePercent;
    }

    order.order_items.forEach((item: OrderItem) => {
        //validate input
        item.net_price = item.net_price < 0 ? -item.net_price : item.net_price;
        item.quantity = Math.trunc(item.quantity < 0 ? -item.quantity : item.quantity);

        item.net_total = roundToTwoDecimals(item.net_price * item.quantity);
        item.total = roundToTwoDecimals(item.net_total * (1 + taxRatePercent / 100));
    });
    order.net_total = order.order_items.reduce(
        (sum: number, item: OrderItem) => sum + (item.net_total || 0), 0
    );

    order.tax = roundToTwoDecimals(order.net_total * (taxRatePercent / 100));
    order.total = roundToTwoDecimals(order.net_total + order.tax);

    return order;
}



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
