import { client } from 'src/utils/axiosClient'

type genSixDigitCodeT = {
  safeName: string
  safeAddress: string
  advisorName: string
  advisorAddress: string
  chainId: string
}

export const generateSixDigitCode = async (args: genSixDigitCodeT): Promise<string> => {
  const daaBackendClient = await client(process.env.REACT_APP_DAA_HOST || 'http://localhost:3001')
  try {
    const { data } = await daaBackendClient.post('/v2/advisor/safe', {
      ...args,
    })

    return data
  } catch (e) {
    console.error(e)
    return ''
  }
}

type getInvestorAddressByAdvisorT = {
  safeAddress: string
  advisorAddress: string
  chainId: string
}

export const getInvestorAddressByAdvisor = async (args: getInvestorAddressByAdvisorT): Promise<string | undefined> => {
  const daaBackendClient = await client(process.env.REACT_APP_DAA_HOST || 'http://localhost:3001')
  const { chainId, advisorAddress, safeAddress } = args
  try {
    const { data } = await daaBackendClient.get(`/v2/advisor/${advisorAddress}/safe`)
    const safeData = data.find(
      (safeData) => safeData.chainId == chainId && safeData.safeAddress.toLowerCase() == safeAddress.toLowerCase(),
    )
    return safeData && safeData.investorAddress
  } catch (e) {
    console.error(e)
    return undefined
  }
}
