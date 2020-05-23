import ReactGA from 'react-ga'
import { batch } from 'react-redux'

import addProvider from './addProvider'

import { getNetwork } from 'src/config'
import { NOTIFICATIONS, enhanceSnackbarForAction } from 'src/logic/notifications'
import enqueueSnackbar from 'src/logic/notifications/store/actions/enqueueSnackbar'
import { ETHEREUM_NETWORK, ETHEREUM_NETWORK_IDS, getProviderInfo, getWeb3 } from 'src/logic/wallets/getWeb3'
import { makeProvider } from 'src/logic/wallets/store/model/provider'
import { addOrUpdateTransactions } from 'src/routes/safe/store/actions/transactions/addOrUpdateTransactions'
import { store } from 'src/store'
import { safeSelector, safeTransactionsSelector } from 'src/routes/safe/store/selectors'
import { calculateTransactionStatus } from 'src/routes/safe/store/actions/transactions/utils/transactionHelpers'

export const processProviderResponse = (dispatch, provider) => {
  const walletRecord = makeProvider(provider)
  const state = store.getState()
  const safe = safeSelector(state)
  const safeAddress = safe.address
  const transactions = safeTransactionsSelector(state)

  batch(() => {
    dispatch(addProvider(walletRecord))
    dispatch(
      addOrUpdateTransactions({
        safeAddress,
        transactions: transactions.withMutations((list) =>
          list.map((tx) => tx.set('status', calculateTransactionStatus(tx, safe, walletRecord.account))),
        ),
      }),
    )
  })
}

const handleProviderNotification = (provider, dispatch) => {
  const { available, loaded, network } = provider

  if (!loaded) {
    dispatch(enqueueSnackbar(enhanceSnackbarForAction(NOTIFICATIONS.CONNECT_WALLET_ERROR_MSG)))
    return
  }

  if (ETHEREUM_NETWORK_IDS[network] !== getNetwork()) {
    dispatch(enqueueSnackbar(NOTIFICATIONS.WRONG_NETWORK_MSG))
    return
  }
  if (ETHEREUM_NETWORK.RINKEBY === getNetwork()) {
    dispatch(enqueueSnackbar(enhanceSnackbarForAction(NOTIFICATIONS.RINKEBY_VERSION_MSG)))
  }

  if (available) {
    // NOTE:
    // if you want to be able to dispatch a `closeSnackbar` action later on,
    // you SHOULD pass your own `key` in the options. `key` can be any sequence
    // of number or characters, but it has to be unique to a given snackbar.

    ReactGA.event({
      category: 'Wallets',
      action: 'Connect a wallet',
      label: provider.name,
    })
    dispatch(enqueueSnackbar(enhanceSnackbarForAction(NOTIFICATIONS.WALLET_CONNECTED_MSG)))
  } else {
    dispatch(enqueueSnackbar(enhanceSnackbarForAction(NOTIFICATIONS.UNLOCK_WALLET_MSG)))
  }
}

export default (providerName) => async (dispatch) => {
  const web3 = getWeb3()
  const providerInfo = await getProviderInfo(web3, providerName)
  await handleProviderNotification(providerInfo, dispatch)
  processProviderResponse(dispatch, providerInfo)
}
