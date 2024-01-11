import React from 'react';
import { isMobile } from 'react-device-detect';

import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  VStack,
} from '@chakra-ui/react';
import { WalletConnectButton } from 'components/Wallet/Modal/WalletConnectButton';
import { MIGALOO_CHAIN_ID } from 'constants/common';
import { useChains } from 'hooks/useChainInfo';

export enum WalletType {
  keplrExtension = 'keplr-extension',
  keplrMobile = 'keplr-mobile',
  terraExtension = 'station-extension',
  shellExtension = 'shell-extension',
  leapExtension = 'leap-extension',
  leapMobile = 'leap-cosmos-mobile',
  leapSnap = 'leap-metamask-cosmos-snap',
  cosmoStationExtension = 'cosmostation-extension',
  cosmoStationMobile = 'cosmostation-mobile'
}

export const WalletModal = ({ isOpen, setOpen, walletRepo }) => {
  const chainInfos: any = useChains();
  const snap = Boolean(chainInfos.find((elem: { chainId: string; coinType: number; }) => elem.chainId === MIGALOO_CHAIN_ID && elem.coinType === 118))

  const onCloseModal = () => {
    if (isOpen) {
      setOpen(false);
    }
  }

  const shouldRenderButton = (wallet: { walletName: string, isModeExtension: boolean }) => {
    const { walletName } = wallet
    const inApp = isMobile && window.leap && window.leap.mode === 'mobile-web'
    if (inApp && walletName === WalletType.leapExtension) {
      return true;
    }
    if (!inApp && walletName.toLowerCase().includes('metamask') && !snap) {
      return false;
    }
    if (!inApp && isMobile && !wallet.isModeExtension) {
      return true;
    }
    if (!inApp && !isMobile && wallet.isModeExtension) {
      return true;
    }
    return false
  }

  return (
    <Modal isOpen={isOpen} onClose={onCloseModal}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Select Wallet</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack alignItems="flex-start" width="full" gap={2}>
            {walletRepo?.wallets.map((wallet) => {
              const { connect, walletName } = wallet;
              if (!shouldRenderButton(wallet)) {
                return null
              }
              return (
                <WalletConnectButton
                  key={walletName}
                  onCloseModal={onCloseModal}
                  connect={connect}
                  walletType={walletName as WalletType}
                />
              );
            })}
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
