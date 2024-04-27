import { SigningStargateClient } from '@cosmjs/stargate'
import file from 'public/mainnet/contract_addresses.json'

import { createExecuteMessage } from 'util/createExecutionMessage'
import { createGasFee } from 'util/createGasFees'

export const undelegate = async (
  client: SigningStargateClient,
  address: string,
  amount: string,
  denom: string,
  isNative: boolean,
) => {
  const nativeMsg = {
    unstake: {
      info: {
        native: denom,
      },
      amount,
    },
  }

  const nonNativeMsg = {
    unstake: {
      info: {
        cw20: denom,
      },
      amount,
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
