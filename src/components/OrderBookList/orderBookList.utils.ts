type OrdersType = [number, number][];

const ORDER_BOOK_LIST_ROW_COUNT= 15;

type SingleOrderType = {
  ['price']: number;
  ['size']: number;
  ['total']: number;
};

type OrdersByPriceType = Record<
  string,
  {
    ['price']: number;
    ['size']: number;
  }
>;

function floorValueWithStep(value: number, step: number) {
  const inv = 1.0 / step;
  return Math.floor(value * inv) / inv;
}

export function getGroupedOrdersByPrice(
  ordersByPrice: OrdersByPriceType,
  group: number,
) {
  return Object.keys(ordersByPrice).reduce(
    (currentOrdersByPrice: OrdersByPriceType, orderPrice: string) => {
      const step = group;
      const { size } = ordersByPrice[orderPrice];
      const groupKeyPrice = floorValueWithStep(Number(orderPrice), step);
      const groupField = currentOrdersByPrice[groupKeyPrice];

      if (groupField) {
        const { size: prevSize } = groupField;
        return {
          ...currentOrdersByPrice,
          [groupKeyPrice]: {
            ['size']: prevSize + size,
            ['price']: groupKeyPrice,
          },
        };
      }
      return {
        ...currentOrdersByPrice,
        [groupKeyPrice]: {
          ['size']: size,
          ['price']: groupKeyPrice,
        },
      };
    },
    {} as OrdersByPriceType,
  );
}

export function getOrdersArray(groupedOrdersByPrice: OrdersByPriceType) {
  return Object.keys(groupedOrdersByPrice)
    .sort((a, b) => Number(a) - Number(b))
    .splice(0, ORDER_BOOK_LIST_ROW_COUNT)
    .reduce((arr: SingleOrderType[], orderKey) => {
      const { price, size } = groupedOrdersByPrice[orderKey];
      const prevTotalSize = arr[arr.length - 1];
      const totalSize = prevTotalSize ? prevTotalSize.total + size : size;

      return [
        ...arr,
        {
          ['total']: totalSize,
          ['size']: size,
          ['price']: price,
        },
      ];
    }, [] as SingleOrderType[]);
}

export function getOrdersByPrice(
  orders: OrdersType,
  prevOrders: OrdersByPriceType,
) {
  const updatedOrders = { ...prevOrders };
  for (let index = 0; index < orders.length; index += 1) {
    const order = orders[index];
    const price = order[0];
    const size = order[1];

    if (size === 0) {
      delete updatedOrders[price];
    } else {
      updatedOrders[price] = {
        ['size']: size,
        ['price']: price,
      };
    }
  }

  return updatedOrders;
}
