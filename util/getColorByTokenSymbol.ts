import { Token } from 'components/Pages/AssetOverview';

export const getColorByTokenSymbol = (symbol: string): string => {
  switch (symbol) {
    case Token.FURY:
      return '#13B55A'
    case Token.ASH:
      return 'lightgreen'
    case Token.ampFURY:
      return '#ADD8FD'
    case Token.bFURY:
      return 'orange'
    case Token.mUSDC:
      return '#189AE9'
    case Token['USDC-FURY-LP']:
      return 'yellow'
    case Token['FURY-wBTC-LP']:
      return 'red'
    case Token.wBTC:
      return 'darkorange'
    case Token.ampOSMO:
      return 'purple'
    case Token.bOSMO:
      return 'purple'
    case Token.OPHIR:
      return 'lightgreen'
    case Token.MOAR:
      return 'lightgreen'
    case Token.gASH:
      return 'blue'
    case Token.RAC:
        return '#009076'
    case Token.FROG:
      return 'green'
    case Token.XUSK:
      return 'purple'
    case Token.arbFURY:
      return 'green'
    default:
      return 'grey'
  }
}
