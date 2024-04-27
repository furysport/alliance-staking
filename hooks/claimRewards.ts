import { SigningStargateClient } from '@cosmjs/stargate'
import file from 'public/mainnet/contract_addresses.json'
import { createExecuteMessage } from 'util/createExecutionMessage';
import { createGasFee } from 'util/createGasFees'

export const claimRewards = async (
  client: SigningStargateClient,
  address: string,
  denom: string,
  isNative: boolean,
) => {
  const nativeMsg = {
    claim_rewards: {
      native: denom,
    },
  }
  const nonNativeMsg = {
    claim_rewards: {
      cw20: denom,
    },
  }

  const execMSG = createExecuteMessage({
    senderAddress: address,
    contractAddress: file.alliance_contract,
    message: isNative ? nativeMsg : nonNativeMsg,
    funds: [],
  })
  return await client.signAndBroadcast(
    address, [execMSG], await createGasFee(
      client, address, [execMSG],
    ), null,
  )
}
