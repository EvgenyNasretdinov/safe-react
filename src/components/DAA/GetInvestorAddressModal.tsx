import { Button } from '@gnosis.pm/safe-react-components'
import IconButton from '@material-ui/core/IconButton'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import Close from '@material-ui/icons/Close'
import { ReactElement } from 'react'
import { CopyToClipboardBtn } from '@gnosis.pm/safe-react-components'

import Hairline from 'src/components/layout/Hairline'
import Paragraph from 'src/components/layout/Paragraph'
import Row from 'src/components/layout/Row'
import { border, fontColor, lg, md, screenSm, secondaryText } from 'src/theme/variables'
import { getChainInfo } from 'src/config'
import { ChainInfo } from '@gnosis.pm/safe-react-gateway-sdk'

const useStyles = (chainInfo: ChainInfo) =>
  makeStyles(
    createStyles({
      heading: {
        padding: `${md} ${lg}`,
        justifyContent: 'space-between',
        height: '74px',
        boxSizing: 'border-box',
      },

      code: {
        justifyContent: 'center',
      },
      close: {
        height: lg,
        width: lg,
        fill: secondaryText,
      },
      qrContainer: {
        backgroundColor: '#fff',
        padding: md,
        borderRadius: '6px',
        border: `1px solid ${secondaryText}`,
      },
      networkInfo: {
        backgroundColor: `${chainInfo?.theme?.backgroundColor ?? border}`,
        color: `${chainInfo?.theme?.textColor ?? fontColor}`,
        padding: md,
        marginBottom: 0,
      },
      annotation: {
        margin: lg,
        marginBottom: 0,
      },
      safeName: {
        margin: `${md} 0`,
      },
      buttonRow: {
        height: '84px',
        justifyContent: 'center',
        '& > button': {
          fontFamily: 'Averta',
          fontSize: md,
          boxShadow: '1px 2px 10px 0 rgba(212, 212, 211, 0.59)',
        },
      },
      addressContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        margin: `${lg} 0`,

        [`@media (min-width: ${screenSm}px)`]: {
          flexDirection: 'row',
        },
      },
    }),
  )()

type Props = {
  onClose: () => void
  address: string | undefined
}

const GetInvestorAddressModal = ({ onClose, address }: Props): ReactElement => {
  const chainInfo = getChainInfo()
  const classes = useStyles(chainInfo)

  return (
    <>
      <Row align="center" className={classes.heading} grow>
        <Paragraph noMargin size="xl" weight="bolder">
          Your Investor&apos;s address
        </Paragraph>
        <IconButton disableRipple onClick={onClose}>
          <Close className={classes.close} />
        </IconButton>
      </Row>
      <Hairline />
      {address ? (
        <div>
          <Row align="center" className={classes.code} grow>
            <Paragraph className={classes.annotation} noMargin size="lg">
              Investor was registered! Here&apos;s the address:
            </Paragraph>
          </Row>
          <Row align="center" className={classes.code} grow>
            <Paragraph>{address}</Paragraph>
            <CopyToClipboardBtn textToCopy={address} />
          </Row>
        </div>
      ) : (
        <Paragraph className={classes.annotation} noMargin size="lg">
          Looks like the Investor is not registered yet, try to check for the address later
        </Paragraph>
      )}
      <Hairline />
      <Row align="center" className={classes.buttonRow}>
        <Button size="md" color="primary" onClick={onClose} variant="contained">
          Done
        </Button>
      </Row>
    </>
  )
}

export default GetInvestorAddressModal
