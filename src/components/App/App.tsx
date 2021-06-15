import { ReactElement, useCallback, useEffect, useState, useMemo } from 'react';

// components
import OrderBook from 'components/OrderBook';

// external components
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import SwapHorizIcon from '@material-ui/icons/SwapHoriz';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';

enum Coins {
  PI_XBTUSD = 'PI_XBTUSD',
  PI_ETHUSD = 'PI_ETHUSD',
}

type OrdersType = [number, number][];
type AllOrders = {
  asks: OrdersType;
  bids: OrdersType;
} | null;

function App(): ReactElement {
  const [orders, setOrders] = useState<AllOrders>(null);
  const [marketId, setMarketId] = useState(Coins.PI_XBTUSD);
  const [isSocketOpen, setSocketState] = useState(false);
  const [isSocketActive, setIsSocketActive] = useState(true);
  const [isFirstTime, setIsFirstTime] = useState(true);

  const wSocket = useMemo(() => new WebSocket('wss://www.cryptofacilities.com/ws/v1'), [isSocketOpen]);

  function openSocket() {
    setSocketState((prev) => !prev);
  }

  function closeSocket() {
    wSocket.close();
    setIsSocketActive(false);
  }

  const subscribe = useCallback(() => {
    const msg = {
      event: 'subscribe',
      feed: 'book_ui_1',
      product_ids: [marketId],
    };

    wSocket.send(JSON.stringify(msg));
  }, [marketId, wSocket]);

  const unsubscribe = useCallback(() => {
    const msg = {
      event: 'unsubscribe',
      feed: 'book_ui_1',
      product_ids: [marketId],
    };
    wSocket.send(JSON.stringify(msg));
  }, [marketId, wSocket]);

  function handleToggleMarket() {
    unsubscribe();
    if (marketId === Coins.PI_XBTUSD) {
      return setMarketId(Coins.PI_ETHUSD);
    }

    return setMarketId(Coins.PI_XBTUSD);
  }

  function toggleConnection() {
    if (wSocket.readyState === 3) {
      return openSocket();
    }
    return closeSocket();
  }

  useEffect(() => () => {
    closeSocket();
  }, []);

  useEffect(() => {
    if (isFirstTime) {
      setIsFirstTime(false);
    } else {
      subscribe();
    }
  }, [marketId]);

  useEffect(() => {
    wSocket.onopen = () => {
      subscribe();
      setIsSocketActive(true);
    };

    wSocket.onerror = () => {
      setIsSocketActive(false);
      openSocket();
    };

    wSocket.onmessage = (event: MessageEvent) => {
      const response = JSON.parse(event.data);
      setOrders(response);
    };

  }, [wSocket]);


  return (
    <Container maxWidth="md">
      <Grid container>
        <Grid item xs={12}>
          <OrderBook orders={orders} market={marketId} isActive={isSocketActive} openConnection={openSocket}
          />
        </Grid>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="center" mt={2}>
            <Button variant="contained" disabled={!isSocketActive} onClick={handleToggleMarket} startIcon={<SwapHorizIcon />}
              style = {{backgroundColor : "#5841D9", color: "#ADA6E3", textAlign: 'right', margin: '10px'}}>Toggle feed</Button>
            <Button onClick={toggleConnection} color={isSocketActive ? 'secondary' : 'primary'} variant="contained" startIcon={<ErrorOutlineIcon />}
              style = {{backgroundColor : "#B92A25", color: "#D9B4B7", textAlign: 'left', margin: '10px'}}> {isSocketActive ? 'Kill Feed' : 'Open socket'}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}

export default App;