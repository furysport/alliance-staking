import { SigningStargateClient } from '@cosmjs/stargate'
import { ActionType } from 'components/Pages/Dashboard'
import { alliance, cosmos } from 'furyajs';
import { createGasFee } from 'util/createGasFees'

export const claimAllRewards = async (
  client: SigningStargateClient,
  delegations: any, address: string,
) => {
  const claimAllianceRewards = alliance.alliance.MessageComposer.fromPartial.claimDelegationRewards
  const delegatorRewards = cosmos.distribution.v1beta1.MessageComposer.fromPartial.withdrawDelegatorReward
  const msgs = delegations.map(({ delegation }) => {
    if (delegation.denom === 'ufury') {
      return (delegatorRewards({
        delegatorAddress: delegation.delegator_address,
        validatorAddress: delegation.validator_address,
      }))
    } else {
      return (claimAllianceRewards({
        delegatorAddress: delegation.delegator_address,
        validatorAddress: delegation.validator_address,
        denom: delegation.denom,
      }))
    }
  })
  const result = await client.signAndBroadcast(
    address, msgs, await createGasFee(
      client, address, msgs,
    ),
  )
  return { result,
    actionType: ActionType.claim }
}
