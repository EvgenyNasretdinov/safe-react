import { useState } from 'react'

import { generateSixDigitCode, getInvestorAddressByAdvisor } from 'src/logic/daa/actions'

type DAAActionsState = {
  sixDigitCode: {
    isOpen: boolean
    code?: string
  }
  investorAddress: {
    isOpen: boolean
    address?: string
  }
}

const INITIAL_STATE: DAAActionsState = {
  sixDigitCode: {
    isOpen: false,
    code: undefined,
  },
  investorAddress: {
    isOpen: false,
    address: undefined,
  },
}

type Response = {
  showSixDigitCode: (
    safeAddress: string,
    safeName: string,
    advisorAddress: string,
    advisorName: string,
    chainId: string,
  ) => void
  hideSixDigitCode: () => void
  showGetInvestorAddress: (advisorAddress: string, safeAddress: string, chainId: string) => void
  hideGetInvestorAddress: () => void
  daaActionsState: DAAActionsState
}

const useSafeActions = (): Response => {
  const [daaActionsState, setDAAActionsState] = useState(INITIAL_STATE)

  const showSixDigitCode = async (
    safeAddress: string,
    safeName: string,
    advisorAddress: string,
    advisorName: string,
    chainId: string,
  ) => {
    const code = await generateSixDigitCode({
      safeAddress,
      safeName,
      advisorAddress,
      advisorName,
      chainId,
    })
    setDAAActionsState((prevState) => ({
      ...prevState,
      sixDigitCode: {
        isOpen: true,
        code,
      },
    }))
  }

  const hideSixDigitCode = () => {
    setDAAActionsState((prevState) => ({
      ...prevState,
      sixDigitCode: {
        isOpen: false,
        code: prevState.sixDigitCode.code,
      },
    }))
  }

  const showGetInvestorAddress = async (advisorAddress: string, safeAddress: string, chainId: string) => {
    const address = await getInvestorAddressByAdvisor({
      safeAddress,
      advisorAddress,
      chainId,
    })
    setDAAActionsState((prevState) => ({
      ...prevState,
      investorAddress: {
        isOpen: true,
        address,
      },
    }))
  }

  const hideGetInvestorAddress = () => {
    setDAAActionsState((prevState) => ({
      ...prevState,
      investorAddress: {
        isOpen: false,
        address: prevState.investorAddress.address,
      },
    }))
  }

  return { daaActionsState, hideSixDigitCode, showSixDigitCode, showGetInvestorAddress, hideGetInvestorAddress }
}

export default useSafeActions
