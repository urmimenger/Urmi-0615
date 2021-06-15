import { makeStyles } from '@material-ui/core';

const useOrderBookStyles = makeStyles({
  ErrorContainer: {
    position: 'absolute',
    background: 'rgba(0,0,0,0.3)',
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#999DA4',
  },
  orderBookGrid: {
    overflow: 'hidden',
    position: 'relative',
    minHeight: '200px',
    backgroundColor: 'rgb(18,24,37)'
  },
  header:{
    padding: '8px',
    marginTop: '4px',
    marginBottom: '4px',
    backgroundColor: '#121828',
    color:'#999DA4' 
  },
  secondOrderbook:{
    ['@media (max-width:400px)']: { 
      marginTop: '20px'
    }
  },
  select:{ color:'#A5ABB2',backgroundColor:"#374251",borderRadius:"5px",paddingLeft:"5px" },
  icon: { color: "#A5ABB2" },
  label: { color: "#A5ABB2" },
});

export default useOrderBookStyles;
