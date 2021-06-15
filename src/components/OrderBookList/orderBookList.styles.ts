import { makeStyles } from '@material-ui/core';

const useOrderBookListStyles = makeStyles({
  cell: {
    width: `${100 / 3}%`,
    textAlign: 'right',
    color: 'rgb(255,255,255)',
    borderBottom: '0px'
  },
  headerCell: {
    width: `${100 / 3}%`,
    color: '#535A67',
    textAlign: 'right',
    borderBottom: '0px'
  },
  tableHead: {
    display: 'table-header-group',
    textTransform: 'uppercase',
    borderSpacing: '0',
    borderCollapse: 'collapse',
    '&.hidden': {
      ['@media (max-width:400px)']: { 
        display: 'none'
      },
    },
  },
  hidden:{
    ['@media (max-width:400px)']: { 
      backgroundColor: 'red'
    },
  },
  thCell: {
    color: '#535A67',
    textAlign: 'right',
    paddingLeft: '10px'
  }
});

export default useOrderBookListStyles;
