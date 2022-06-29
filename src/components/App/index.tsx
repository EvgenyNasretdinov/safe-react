import { useContext } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import AppLayout from 'src/components/AppLayout'
import { SafeListSidebar, SafeListSidebarContext } from 'src/components/SafeListSidebar'
import CookiesBanner from 'src/components/CookiesBanner'
import { currentSafeWithNames } from 'src/logic/safe/store/selectors'
import { currentCurrencySelector } from 'src/logic/currencyValues/store/selectors'
import Modal from 'src/components/Modal'
import SendModal from 'src/routes/safe/components/Balances/SendModal'
import useSafeActions from 'src/logic/safe/hooks/useSafeActions'

import useDAAActions from 'src/logic/daa/hooks/useDAAActions'
import { currentChainId } from 'src/logic/config/store/selectors'
import { userAccountSelector } from 'src/logic/wallets/store/selectors'

import { formatCurrency } from 'src/logic/tokens/utils/formatAmount'
import { grantedSelector } from 'src/routes/safe/container/selector'
import ReceiveModal from './ReceiveModal'
import GenerateSixDigitCodeModal from '../DAA/GenerateSixDigitCodeModal'
import GetInvestorAddressModal from '../DAA/GetInvestorAddressModal'
import { useSidebarItems } from 'src/components/AppLayout/Sidebar/useSidebarItems'
import useAddressBookSync from 'src/logic/addressBook/hooks/useAddressBookSync'
import { useCurrentSafeAddressSync } from 'src/logic/currentSession/hooks/useCurrentSafeAddressSync'

const Frame = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  max-width: 100%;
`

const App: React.FC = ({ children }) => {
  const { toggleSidebar } = useContext(SafeListSidebarContext)
  const { name: safeName, totalFiatBalance: currentSafeBalance, owners } = useSelector(currentSafeWithNames)
  const { safeActionsState, onShow, onHide, showSendFunds, hideSendFunds } = useSafeActions()

  const { showSixDigitCode, hideSixDigitCode, showGetInvestorAddress, hideGetInvestorAddress, daaActionsState } =
    useDAAActions()
  const userAddress = useSelector(userAccountSelector)
  const chainId = useSelector(currentChainId)
  const userOwner = owners.find((owner) => owner.address == userAddress)
  const userName = userOwner ? userOwner.name : ''

  const currentCurrency = useSelector(currentCurrencySelector)
  const granted = useSelector(grantedSelector)
  const sidebarItems = useSidebarItems()
  const { address: safeAddress } = useSelector(currentSafeWithNames)

  useCurrentSafeAddressSync()
  useAddressBookSync()

  const sendFunds = safeActionsState.sendFunds
  const sixDigitCode = daaActionsState.sixDigitCode
  const investorAddress = daaActionsState.investorAddress
  const balance = formatCurrency(currentSafeBalance.toString(), currentCurrency)

  const onReceiveShow = () => onShow('Receive')
  const onReceiveHide = () => onHide('Receive')

  return (
    <Frame>
      <AppLayout
        sidebarItems={sidebarItems}
        safeAddress={safeAddress}
        safeName={safeName}
        balance={balance}
        granted={granted}
        onToggleSafeList={toggleSidebar}
        onReceiveClick={onReceiveShow}
        onNewTransactionClick={() => showSendFunds('')}
        onGenerateSixDigitCodeClick={async () => {
          await showSixDigitCode(safeAddress, safeName, userAddress, userName, chainId)
        }}
        onGetInvestorAddressClick={async () => {
          await showGetInvestorAddress(userAddress, safeAddress, chainId)
        }}
      >
        {children}
      </AppLayout>

      <SendModal
        activeScreenType="chooseTxType"
        isOpen={sendFunds.isOpen}
        onClose={hideSendFunds}
        selectedToken={sendFunds.selectedToken}
      />

      <Modal
        open={sixDigitCode.isOpen}
        handleClose={hideSixDigitCode}
        description="DAA six digit code for investor"
        title="DAA six digit code"
      >
        <GenerateSixDigitCodeModal code={sixDigitCode.code} onClose={hideSixDigitCode} />
      </Modal>

      <Modal
        open={investorAddress.isOpen}
        handleClose={hideGetInvestorAddress}
        description="DAA six digit code for investor"
        title="Investor address"
      >
        <GetInvestorAddressModal address={investorAddress.address} onClose={hideGetInvestorAddress} />
      </Modal>

      {safeAddress && (
        <Modal
          description="Receive Tokens Form"
          handleClose={onReceiveHide}
          open={safeActionsState.showReceive}
          paperClassName="receive-modal"
          title="Receive Tokens"
        >
          <ReceiveModal onClose={onReceiveHide} safeAddress={safeAddress} safeName={safeName} />
        </Modal>
      )}
      <CookiesBanner />
    </Frame>
  )
}

const WrapperAppWithSidebar: React.FC = ({ children }) => (
  <SafeListSidebar>
    <App>{children}</App>
  </SafeListSidebar>
)

export default WrapperAppWithSidebar
