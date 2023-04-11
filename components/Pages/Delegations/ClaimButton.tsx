import useDelegations from 'hooks/useDelegations';
import {useMemo} from 'react';
import useTransaction, {TxStep} from "components/Pages/Delegations/hooks/useTransaction";
import {ActionType} from "components/Pages/Delegations/Dashboard";
import CustomButton from "components/CustomButton";

const ClaimButton = ({isWalletConnected, onOpenModal, address}) => {

  const { data: {totalRewards} = {} } = useDelegations({address})


  const {submit, txStep} = useTransaction()

  const onClaim = () => {
    submit(ActionType.claim, null, null, null,null)
  }
  const buttonLabel = useMemo(() => {
    if (!isWalletConnected) return 'Connect Wallet'
    else if ((Number(totalRewards) === 0)) return 'No Rewards'
    else return 'Claim'
  }, [totalRewards, isWalletConnected])

const isLoading =
    txStep == TxStep.Estimating ||
    txStep == TxStep.Posting ||
    txStep == TxStep.Broadcasting
  return (
      <CustomButton
          buttonLabel={buttonLabel}
          onClick={
            isWalletConnected && Number(totalRewards) !== 0 ? onClaim : onOpenModal
          }
          disabled={isWalletConnected && Number(totalRewards) === 0}
          loading={isLoading}
          height="60px"
          width="250px"
      />
  )
}
export default ClaimButton