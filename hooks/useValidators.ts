import { useQuery } from 'react-query';

import { LCDClient, Validator } from '@terra-money/feather.js';
import { Pagination } from '@terra-money/feather.js/dist/client/lcd/APIRequester';
import { ValidatorInfo } from 'components/Pages/Alliance/ValidatorInput/ValidatorList';
import { Token } from 'components/Pages/AssetOverview';
import useLCDClient from 'hooks/useLCDClient';
import { num } from 'libs/num';
import allianceTokens from 'public/mainnet/white_listed_alliance_token_info.json'
import { convertMicroDenomToDenom } from 'util/conversion';

import useDelegations from './useDelegations';

type GetValidatorsParams = {
  client: LCDClient | null;
  validatorInfo: [Validator[], Pagination] | undefined;
  delegations: any[]
};

const getValidators = ({
  client,
  validatorInfo,
  delegations,
}: GetValidatorsParams) => {
  const getIsDelegated = (validator: any) => {
    const delegation = delegations.find(({ delegation }) => delegation?.validator_address === validator?.validator_addr);
    return Boolean(delegation);
  };

  return client?.alliance.
    alliancesByValidators('furya-1').
    then((data) => {
      const [validators = [], pagination] = validatorInfo || [];

      // Sum of validator shares
      const totalShares = validators.reduce((acc, v) => acc.plus(v.delegator_shares.toString()),
        num(0));
      const delegatedValidators = data?.validators as any[];

      const validatorsWithInfo = validators?.
        map((validator) => {
          const delegatedValidator = delegatedValidators?.find((v) => v?.validator_addr === validator.operator_address);
          const delegated = getIsDelegated(delegatedValidator);
          const rate = validator?.commission?.commission_rates.rate.toString();
          const share = validator?.delegator_shares.toString();
          const votingPower = num(100).
            times(share!).
            div(totalShares).
            toFixed(2);
          const commission = num(rate).times(100).
            toFixed(0);

          return {
            ...validator,
            ...delegatedValidator,
            delegated,
            commission,
            votingPower,
          };
        }).
        filter((v: any) => v.status === 'BOND_STATUS_BONDED');

      return { validators: validatorsWithInfo,
        pagination };
    }).
    catch((error) => {
      console.log({ error });
      return [[], {}];
    })
};
const getStakedFury = async ({ validatorData }) => {
  let sum = 0
  validatorData.validators.forEach((validator) => {
    sum += Number(validator.tokens.toString());
  })
  return convertMicroDenomToDenom(sum, 6)
}

type UseValidatorsResult = {
  data: {
    validators: ValidatorInfo[]
    pagination: any;
    stakedFury: number
    stakedAmpFury: number
    stakedBFury: number
    stakedWBtc: number
    stakedAmpOSMO: number
    stakedbOsmo: number
  }
  isFetching: boolean
}
const getStakedWBtc = async ({ validatorData }) => {
  const wBTC = allianceTokens.find((token) => token.symbol === Token.wBTC)
  let totalWBtcAmount = 0
  validatorData.validators.forEach((v) => {
    const wBTCAmount = v.total_staked.find((token) => token.denom === wBTC.denom)?.amount || 0
    totalWBtcAmount += convertMicroDenomToDenom(wBTCAmount, wBTC.decimals)
  })
  return { totalWBtcAmount }
}

const getStakedAmpOsmo = async ({ validatorData }) => {
  const ampOsmo = allianceTokens.find((token) => token.symbol === Token.ampOSMO)
  let totalampOsmoAmount = 0
  validatorData.validators.forEach((v) => {
    const ampOsmoAmount = v.total_staked.find((token) => token.denom === ampOsmo.denom)?.amount || 0
    totalampOsmoAmount += convertMicroDenomToDenom(ampOsmoAmount, ampOsmo.decimals)
  })
  return { totalampOsmoAmount }
}

const getStakedbOsmo = async ({ validatorData }) => {
  const bOsmo = allianceTokens.find((token) => token.symbol === Token.bOSMO)
  let totalbOsmoAmount = 0
  validatorData.validators.forEach((v) => {
    const bosmoAmount = v.total_staked.find((token) => token.denom === bOsmo.denom)?.amount || 0
    totalbOsmoAmount += convertMicroDenomToDenom(bosmoAmount, bOsmo.decimals)
  })
  return { totalbOsmoAmount }
}

const getStakedLSTFuryAmounts = async ({ validatorData }) => {
  const bFuryDenom = allianceTokens.find((token) => token.symbol === 'bFURY').denom
  const ampFuryDenom = allianceTokens.find((token) => token.symbol === 'ampFURY').denom
  let totalAmpFuryAmount = 0
  let totalBFuryAmount = 0
  validatorData.validators.map((v) => {
    const bFury = v.total_staked.find((token) => token.denom === bFuryDenom)?.amount || 0
    const ampFury = v.total_staked.find((token) => token.denom === ampFuryDenom)?.amount || 0
    totalAmpFuryAmount += convertMicroDenomToDenom(ampFury, 6)
    totalBFuryAmount = totalAmpFuryAmount + convertMicroDenomToDenom(bFury, 6)
    return null
  })
  return { totalAmpFuryAmount,
    totalBFuryAmount }
}
const useValidators = ({ address }): UseValidatorsResult => {
  const client = useLCDClient();

  const { data: { delegations = [] } = {}, isFetched } = useDelegations({
    address,
  })

  const { data: validatorInfo } = useQuery({
    queryKey: ['validatorInfo'],
    queryFn: async () => await client?.staking.validators('furya-1'),
    enabled: Boolean(client),
  })

  const { data: validatorData, isFetching } = useQuery({
    queryKey: ['validators', isFetched],
    queryFn: () => getValidators({ client,
      validatorInfo,
      delegations }),
    enabled: Boolean(client) && Boolean(validatorInfo) && Boolean(delegations),
  })

  const { data: stakedFury } = useQuery({
    queryKey: ['stakedFury'],
    queryFn: () => getStakedFury({ validatorData }),
    enabled: Boolean(validatorData),
  })
  const { data: furyLSTData } = useQuery({
    queryKey: ['stakedLSTs'],
    queryFn: () => getStakedLSTFuryAmounts({ validatorData }),
    enabled: Boolean(validatorData),
  })

  const { data: stakedWBtc } = useQuery({
    queryKey: ['stakedWBtc'],
    queryFn: () => getStakedWBtc({ validatorData }),
    enabled: Boolean(validatorData),
  })

  const { data: stakedAmpOSMO } = useQuery({
    queryKey: ['stakedAmpOsmo'],
    queryFn: () => getStakedAmpOsmo({ validatorData }),
    enabled: Boolean(validatorData),
  })
  const { data: stakedbOsmo } = useQuery({
    queryKey: ['stakedbOsmo'],
    queryFn: () => getStakedbOsmo({ validatorData }),
    enabled: Boolean(validatorData),
  })
  return {
    data: {
      validators: validatorData?.validators || [],
      pagination: validatorData?.pagination || {},
      stakedFury: stakedFury || 0,
      stakedAmpFury: furyLSTData?.totalAmpFuryAmount || 0,
      stakedBFury: furyLSTData?.totalBFuryAmount || 0,
      stakedWBtc: stakedWBtc?.totalWBtcAmount || 0,
      stakedAmpOSMO: stakedAmpOSMO?.totalampOsmoAmount || 0,
      stakedbOsmo: stakedbOsmo?.totalbOsmoAmount || 0,
    },
    isFetching,
  }
}
export default useValidators
