import { useState } from 'react'

import { generateSixDigitCode } from 'src/logic/daa/actions'

type DAAActionsState = {
  sixDigitCode: {
    isOpen: boolean
    code?: string
  }
}

const INITIAL_STATE: DAAActionsState = {
  sixDigitCode: {
    isOpen: false,
    code: undefined,
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

  return { daaActionsState, hideSixDigitCode, showSixDigitCode }
}

export default useSafeActions
