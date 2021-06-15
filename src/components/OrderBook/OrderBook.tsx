import React, { useEffect, useMemo, useState } from 'react';

// components
import OrderBookList from 'components/OrderBookList';

// external components
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';

enum Coins {
  PI_XBTUSD = 'PI_XBTUSD',
  PI_ETHUSD = 'PI_ETHUSD',
}
type OrdersType = [number, number][];

type AllOrders = {
  asks: OrdersType;
  bids: OrdersType;
} | null;


// styles
import useOrderBookStyles from './orderBook.styles';

const marketConfig = {
  ["PI_XBTUSD"]: {
    defaultGroup: 0.5,
    groups: [0.5, 1, 2.5],
    marketName: 'XBTUSD',
  },
  ["PI_ETHUSD"]: {
    defaultGroup: 0.05,
    groups: [0.05, 0.1, 0.25],
    marketName: 'ETHUSD',
  },
};

type OrderBookType = {
  orders: AllOrders,
  market: keyof typeof Coins,
  isActive: boolean,
  openConnection: () => void
};

function OrderBook({ orders, market, isActive, openConnection }: OrderBookType) {
  const classes = useOrderBookStyles();
  const marketInfo = useMemo(() => marketConfig[market], [market]);
  const [group, setGroup] = useState(marketInfo.defaultGroup);

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setGroup(event.target.value as number);
  };

  useEffect(() => {
    setGroup(marketInfo.defaultGroup);
  }, [marketInfo]);

  return (
    <Grid container>
      <Grid container justify="space-between" alignItems="center" className={classes.header}>
        <Typography display="inline">
          Order book
        </Typography>
        <Typography display="inline">
          {marketInfo.marketName}
        </Typography>
        <Select
          value={group}
          onChange={handleChange}
          disabled={!isActive}
          classes={{
            select: classes.select,
            icon: classes.icon,
          }}
        >
          {marketInfo.groups.map((orderBookGroup: number) =>
            <MenuItem key={orderBookGroup} value={orderBookGroup}>{`Group ${orderBookGroup}`}</MenuItem>)}
        </Select>
      </Grid>
      <Grid container className={classes.orderBookGrid} style={{paddingLeft:"5px",paddingRight:"5px",paddingBottom:"5px"}}>
        {orders && orders.bids && orders.asks && (
          <React.Fragment>
            <Grid item xs={12} md={6}>
              <OrderBookList
                orders={orders.bids}
                type="asks"
                group={group}
                defaultGroup={marketInfo.defaultGroup}
              />
            </Grid>
            <Grid item xs={12} md={6} className={classes.secondOrderbook}>
              <OrderBookList
                orders={orders.asks}
                type="bids"
                group={group}
                defaultGroup={marketInfo.defaultGroup}
              />
            </Grid>
          </React.Fragment>
        )}
        {!isActive && (
          <div className={classes.ErrorContainer}>
            <Grid container direction="column" alignItems="center">
              <Typography variant="h4" align="center">
                Lost connection
              </Typography>
              <Button onClick={openConnection} variant="contained" color="secondary">
                Reconnect
              </Button>
            </Grid>
          </div>
        )}
      </Grid>

    </Grid>
  );
}

export default OrderBook;
