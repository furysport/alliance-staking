import { SigningStargateClient } from '@cosmjs/stargate';
import { alliance } from 'furyajs';
import { createGasFee } from 'util/createGasFees'

export const allianceRedelegate = async (
  client: SigningStargateClient,
  validatorSrcAddress: string,
  validatorDstAddress: string,
  address: string,
  amount: string,
  allianceDenom: string,
) => {
  const { redelegate } = alliance.alliance.MessageComposer.fromPartial
  const message = redelegate({ delegatorAddress: address,
    validatorSrcAddress,
    validatorDstAddress,
    amount: { denom: allianceDenom,
      amount } })
  return await client.signAndBroadcast(
    address, [message], await createGasFee(
      client, address, [message],
    ),
  )
}
