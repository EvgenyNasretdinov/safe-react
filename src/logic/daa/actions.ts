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
