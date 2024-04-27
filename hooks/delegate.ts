import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate/build/signingcosmwasmclient'
import { SigningStargateClient, coin } from '@cosmjs/stargate'
import file from 'public/mainnet/contract_addresses.json'
import { createExecuteMessage } from 'util/createExecutionMessage'
import { isNativeToken } from 'util/isNative'
import { toBase64 } from 'util/toBase64'

import { createGasFee } from '../util/createGasFees'

export const delegate = async (
  client: SigningStargateClient,
  address: string,
  amount: string,
  denom: string,
) => {
  const stakeMessage = {
    stake: {},
  }

  if (isNativeToken(denom)) {
    const msg = createExecuteMessage({
      senderAddress: address,
      contractAddress: file.alliance_contract,
      message: stakeMessage,
      funds: [coin(amount, denom)],
    })
    return await client.signAndBroadcast(
      address, [msg], await createGasFee(
        client, address, [msg],
      ), null,
    )
  } else {
    const msg =
    {
      send: {
        amount,
        contract: file.alliance_contract,
        msg: toBase64(stakeMessage),
      },
    }
    const execMSG = createExecuteMessage({
      senderAddress: address,
      contractAddress: file.alliance_contract,
      message: msg,
      funds: [],
    })
    return await client.signAndBroadcast(
      address, [execMSG], await createGasFee(
        client, address, [execMSG],
      ), null,
    )
  }
}
