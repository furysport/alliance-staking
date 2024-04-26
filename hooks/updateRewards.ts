import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate/build/signingcosmwasmclient'
import file from 'public/mainnet/contract_addresses.json'
import { createExecuteMessage } from '../util/createExecutionMessage'
import { createGasFee } from '../util/createGasFees'

export const updateRewards = async (client: SigningCosmWasmClient,
  address: string) => {
  const msg = {
    update_rewards: {},
  }
  const execMSG = createExecuteMessage({
    senderAddress: address,
    contractAddress: file.alliance_contract,
    message: msg,
    funds: []
  })
  return await client.signAndBroadcast(
    address, [execMSG], await createGasFee(
      client, address, [execMSG],
    ), null,
  )
}
