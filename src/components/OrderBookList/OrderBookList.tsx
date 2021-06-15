import { useCallback, useEffect, useMemo, useState } from 'react';

// external components
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';


// styles
import useOrderBookListStyles from './orderBookList.styles';

type SingleOrderType = {
  ['price']: number;
  ['size']: number;
  ['total']: number;
};
const orderListConfig = {
  ["asks"]: {
    color: '#3D8D68',
    depthColor: '#3F212C',
    titleOrder: ['total','size','price'],
    direction: '-90deg',
  },
  ["bids"]: {
    color: '#3D8D68',
    depthColor: '#13393A',
    titleOrder: ['price','size','total'],
    direction: '90deg',
  },
};
type OrdersType = [number, number][];


type OrderBookListPropsType = {
  orders: OrdersType;
  type: "asks" | "bids";
  group: number;
  defaultGroup: number;
};

type OrdersByPriceType = Record<
  string,
  {
    ['price']: number;
    ['size']: number;
  }
>;


// utils
import { getGroupedOrdersByPrice, getOrdersArray, getOrdersByPrice } from './orderBookList.utils';

enum OrderBookValueListEnum {
  PRICE = 'price',
  SIZE = 'size',
  TOTAL = 'total',
}

function OrderBookList({ orders, type, group,
  defaultGroup }: OrderBookListPropsType) {
  const classes = useOrderBookListStyles();
  const {
    color,
    depthColor,
    titleOrder,
    direction,
  } = useMemo(() => orderListConfig[type], [type]);

  const [ordersByPrice, setOrdersByPrice] = useState<OrdersByPriceType>({});

  useEffect(() => {
    setOrdersByPrice((prevOrders) => getOrdersByPrice(orders, prevOrders));
  }, [orders, setOrdersByPrice]);

  const getMarketDepthBackground = useCallback(
    (marketDepth: number) =>
      `linear-gradient(${direction}, ${depthColor}, ${depthColor} ${marketDepth}%, transparent ${marketDepth}%)`,
    [direction, depthColor],
  );

  const groupedOrdersByPrice = useMemo(
    () => {
      if (group === defaultGroup) {
        return ordersByPrice;
      }
      return getGroupedOrdersByPrice(ordersByPrice, group);
    },
    [ordersByPrice, group, defaultGroup],
  );

  const ordersArr: SingleOrderType[] = useMemo(
    () => getOrdersArray(groupedOrdersByPrice), [groupedOrdersByPrice],
  );

  const getTableRow = useCallback((order: SingleOrderType, marketDepth: number) => (
    <TableRow key={`${order.price}`} style={{ background: getMarketDepthBackground(marketDepth) }}>
      {
        titleOrder.map((tableKey) => (
          <TableCell
            className={classes.cell}
            size="small"
            key={tableKey}
            style={
              { color: tableKey === OrderBookValueListEnum.PRICE ? color : 'white' }
            }
          >
            {order[tableKey as OrderBookValueListEnum]}
          </TableCell>
        ))
      }
    </TableRow>
  ), [getMarketDepthBackground, titleOrder, color, classes]);

  return (
    <Table>
      <TableHead className={classes.tableHead +" " + (type=="asks" ? 'show' : 'hidden')}>
        <TableRow>
          {orderListConfig[type].titleOrder.map(
            (title) => (
              <TableCell
                className={classes.headerCell}
                size="small"
                key={title}
              >
                {title}
              </TableCell>
            ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {ordersArr.map((order) => {
          const marketDepth = Math.round(
            ((order.total / (ordersArr[ordersArr.length - 1].total)) * 100),
          );
          return getTableRow(order, marketDepth);
        })}
      </TableBody>
    </Table>
  );
}

export default OrderBookList;
