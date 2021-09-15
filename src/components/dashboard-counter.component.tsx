import { Box, CircularProgress, Grid, Icon, Paper } from "@material-ui/core";
import React from "react";

interface Props {
  loading: boolean;
  counter: string;
  title: string;
  color?: string;
}

export function DashboardCounter({ loading, color, counter, title }: Props) {
  return (
    <Paper>
      <Grid item>
        <Box bgcolor={color} p={1}></Box>
      </Grid>
      <Grid item>
        <Box p={2}>
          <Box fontSize={16} textAlign="left">
            {title}
          </Box>
          <Box fontSize={18} textAlign="right">
            {loading && <CircularProgress />}
            {!loading && <h2>{counter}</h2>}
          </Box>
        </Box>
      </Grid>
    </Paper>
  );
}
