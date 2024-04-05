import { useQuery } from 'react-query';

import { LCDClient } from '@terra-money/feather.js';
import useLCDClient from 'hooks/useLCDClient';
import usePrices from 'hooks/usePrices';
import tokens from 'public/mainnet/white_listed_alliance_token_info.json';
import { convertMicroDenomToDenom } from 'util/conversion';

interface Amount {
  amount: string;
  denom: string;
}
interface Message {
  amount: Amount
  validator_address: string;
  delegator_address: string;
}
interface Body {
  extension_options: any[]; // You may replace 'any' with a more specific type if needed
  memo: string;
  messages: Message[];
  non_critical_extension_options: any[]; // You may replace 'any' with a more specific type if needed
  timeout_height: string;
}
interface AuthInfo {
  signer_infos: any[]; // You may replace 'any' with a more specific type if needed
  fee: any
  tip: null
}
interface Tx {
  '@type': string;
  auth_info: AuthInfo;
  body: Body;
  signatures: string[];
}
interface TxResponse {
  height: string;
  txhash: string;
  codespace: string;
  code: number;
  data: string;
  raw_log: string;
  logs: any[]; // You may replace 'any' with a more specific type if needed
  info: string;
  gas_wanted: string;
  gas_used: string;
  events: Event[];
  timestamp: string;
  tx: Tx
}
interface RawTxData {
  txs: any[];
  tx_responses: TxResponse[];
  pagination: null;
  total: string;
}

export interface Undelegation {
  amount: number;
  dollarValue: number;
  symbol: string;
  validatorAddress: string;
  delegatorAddress: string;
}
const getUndelegations = async (
  client: LCDClient | null,
  priceList: any,
  delegatorAddress: string,
): Promise<any> => {
  let undelegations:Undelegation[] = []
  for (const token of tokens) {
    let url: string = 'terra/alliances/unbondings/'
    url += `/${encodeURIComponent(encodeURIComponent(token.token_address))}/${delegatorAddress}`;
    const resAlliance: any = await client.alliance.getReqFromAddress(delegatorAddress).get(url)
    if (resAlliance.unbondings.length > 0) {
      resAlliance.unbondings.forEach((undelegation) => {
        console.log(undelegation)
        const amount = convertMicroDenomToDenom(undelegation.amount,
          token.decimals);
        const dollarValue = priceList[token.name] * amount;
        undelegations.push({
          validatorAddress: undelegation.validator_address,
          delegatorAddress: delegatorAddress,
          amount,
          dollarValue,
          symbol: token.symbol,
        });
      }); 
    }
  }
  const stakingToken = "Whale"
  const nativeRes = await client?.staking.unbondingDelegations(delegatorAddress);
  const nativeUndelegations = nativeRes[0].map((undelegation) => {
    const undelegationJson = undelegation.toProto();
    const amount = convertMicroDenomToDenom(undelegationJson.entries[0].balance,
      6);
    const dollarValue = priceList[stakingToken] * amount;
    return {
      validatorAddress: undelegation.validator_address,
      delegatorAddress: undelegation.delegator_address,
      amount,
      dollarValue,
      symbol: "WHALE",
    };
  });
  // And finally merge them up and return
  const allUndelegations = undelegations.concat(nativeUndelegations);

  return { allUndelegations };
}

const useUndelegations = ({ address }) => {
  const client = useLCDClient();
  const [priceList] = usePrices() || [];

  return useQuery({
    queryKey: ['undelegations', address],
    queryFn: () => getUndelegations(
      client, priceList, address,
    ),
    enabled: Boolean(address) && Boolean(priceList),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  })
}

export default useUndelegations;
