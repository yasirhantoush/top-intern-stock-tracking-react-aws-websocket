import { Button, Grid } from '@material-ui/core';
import React, { useState, useCallback, useMemo, useRef } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { DashboardCounter } from './components/dashboard-counter.component';

function App() {
  //Public API that will echo messages sent to it back to the client
  const [socketUrl, setSocketUrl] = useState('wss://vdrkr3ciw8.execute-api.us-east-2.amazonaws.com/production');

  const {
    sendMessage,
    lastMessage,
    readyState,
  } = useWebSocket(socketUrl);

  const handleClickSendStockInMessage = useCallback(() =>
    sendMessage(JSON.stringify({ action: 'stockIn', qty: 5 })), []);

  const handleClickSendStockOutMessage = useCallback(() =>
    sendMessage(JSON.stringify({ action: 'stockOut', qty: 5 })), []);

    const stats = useMemo(() => {
      try {
        const payload = JSON.parse(lastMessage?.data);
        return payload;
      } catch (err) {
        return null;
      }
    }, [lastMessage])

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];

  return (
    <>
      <div style={{ padding: 20 }}>
        <Grid container
          direction="row"
          justifyContent="center"
          alignItems="center">
          <Grid item>
            <DashboardCounter loading={false} color="green" counter={connectionStatus} title={'Connection Status'} />
            <br />
            <Button
              fullWidth
              variant="outlined"
              onClick={handleClickSendStockInMessage}
              disabled={readyState !== ReadyState.OPEN}
            >
              Add Stock
            </Button>
            <br />
            <Button
              fullWidth
              variant="outlined"
              onClick={handleClickSendStockOutMessage}
              disabled={readyState !== ReadyState.OPEN}
            >
              Consume Stock
            </Button>
            <br />
            <br />
            <DashboardCounter loading={false} color="green" counter={stats?.stock} title="Stock Qty" />
          </Grid>
        </Grid>
      </div>
    </>
  );
}

export default App;
