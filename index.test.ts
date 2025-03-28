import { Order, calculateOrder } from './index';

describe('Order calculations', () => {
    it('should correctly calculate order values with integer tax rate', () => {
        const order: Order = {
            net_total: null,
            tax: null,
            total: null,
            order_items: [
                { net_price: 100, quantity: 2, net_total: null, total: null },
                { net_price: 50, quantity: 4, net_total: null, total: null }
            ]
        };

        const result: Order = calculateOrder(order, 20);

        expect(result.order_items[0].net_total).toBe(200);
        expect(result.order_items[0].total).toBe(240);
        expect(result.order_items[1].net_total).toBe(200);
        expect(result.order_items[1].total).toBe(240);

        expect(result.net_total).toBe(400);
        expect(result.tax).toBe(80);
        expect(result.total).toBe(480);
    });

    it('should handle decimal values correctly', () => {
        const order: Order = {
            net_total: null,
            tax: null,
            total: null,
            order_items: [
                { net_price: 99.99, quantity: 3, net_total: null, total: null }
            ]
        };

        const result: Order = calculateOrder(order, 23.5);

        expect(result.order_items[0].net_total).toBeCloseTo(299.97);
        expect(result.order_items[0].total).toBeCloseTo(370.46);
        expect(result.net_total).toBeCloseTo(299.97);
        expect(result.tax).toBeCloseTo(70.49, 1);
        expect(result.total).toBeCloseTo(370.46);
    });

    it('should handle empty order items', () => {
        const order: Order = {
            net_total: null,
            tax: null,
            total: null,
            order_items: []
        };

        const result: Order = calculateOrder(order, 23);

        expect(result.net_total).toBe(0);
        expect(result.tax).toBe(0);
        expect(result.total).toBe(0);
    });

    it('should handle zero tax rate', () => {
        const order: Order = {
            net_total: null,
            tax: null,
            total: null,
            order_items: [
                { net_price: 100, quantity: 1, net_total: null, total: null }
            ]
        };

        const result: Order = calculateOrder(order, 0);

        expect(result.order_items[0].total).toBe(100);
        expect(result.net_total).toBe(100);
        expect(result.tax).toBe(0);
        expect(result.total).toBe(100);
    });

    it('should handle negative tax rate', () => {
        const order: Order = {
            net_total: null,
            tax: null,
            total: null,
            order_items: [
                { net_price: 100, quantity: 1, net_total: null, total: null }
            ]
        };

        const result: Order = calculateOrder(order, -23);

        expect(result.order_items[0].total).toBe(123);
        expect(result.net_total).toBe(100);
        expect(result.tax).toBe(23);
        expect(result.total).toBe(123);
    });

    it('should handle zero quantity', () => {
        const order: Order = {
            net_total: null,
            tax: null,
            total: null,
            order_items: [
                { net_price: 100, quantity: 0, net_total: null, total: null }
            ]
        };

        const result: Order = calculateOrder(order, 23);

        expect(result.order_items[0].total).toBe(0);
        expect(result.net_total).toBe(0);
        expect(result.tax).toBe(0);
        expect(result.total).toBe(0);
    });

    it('should handle maximum decimal values correctly', () => {
        const maxDecimalValue: number = 99999999.99;
        const order: Order = {
            net_total: null,
            tax: null,
            total: null,
            order_items: [
                { net_price: maxDecimalValue, quantity: 999999, net_total: null, total: null }
            ]
        };

        const result: Order = calculateOrder(order, 23.3);

        expect(result.order_items[0].net_total).toBeCloseTo(99999999.99 * 999999, 2);
        expect(result.order_items[0].total).toBeCloseTo(
            result.order_items[0].net_total! * 1.233,
            2
        );

        expect(result.net_total).toBe(result.order_items[0].net_total);
        expect(result.tax).toBeCloseTo(result.net_total! * 0.233, 2);
        expect(result.total).toBeCloseTo(result.net_total! + result.tax!, 2);
    });

    it('should hadnle negative prices', () => {
        const order: Order = {
            net_total: null,
            tax: null,
            total: null,
            order_items: [
                { net_price: -100, quantity: 2, net_total: null, total: null }
            ]
        };

        const result: Order = calculateOrder(order, 20);
        expect(result.order_items[0].net_price).toBe(100);
        expect(result.total).toBe(240);
    });

    it('should truncate decimal quantities', () => {
        const order: Order = {
            net_total: null,
            tax: null,
            total: null,
            order_items: [
                { net_price: 100, quantity: 3.9, net_total: null, total: null }
            ]
        };

        const result: Order = calculateOrder(order, 20);
        expect(result.order_items[0].quantity).toBe(3);
        expect(result.net_total).toBe(300);
    });
});
