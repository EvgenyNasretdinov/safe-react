import { ReactElement } from 'react'
import styled from 'styled-components'

import { NotificationsState } from 'src/logic/notifications/store/notifications'
import { NOTIFICATION_LIMIT } from 'src/components/AppLayout/Header/components/Notifications'
import { StyledScrollableBar } from 'src/routes/safe/components/Transactions/TxList/styled'
import { background, black300, gray500 } from 'src/theme/variables'
import NotificationItem from 'src/components/AppLayout/Header/components/Notifications/NotificationItem'
import { Typography } from '@material-ui/core'

import Bell from './assets/bell.svg'

const NotificationList = ({ notifications }: { notifications: NotificationsState }): ReactElement => {
  if (!notifications.length) {
    return (
      <Wrapper>
        <img src={Bell} alt="No notifications" />
        <Description>No notifications</Description>
      </Wrapper>
    )
  }

  return (
    <ScrollContainer $showScrollbar={notifications.length > NOTIFICATION_LIMIT}>
      <NotificationType>System updates</NotificationType>
      {notifications.map((notification) => (
        <NotificationItem key={notification.timestamp} {...notification} />
      ))}
    </ScrollContainer>
  )
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Description = styled(Typography)`
  color: ${gray500};
  padding-top: 8px;
`

const ScrollContainer = styled(StyledScrollableBar)<{ $showScrollbar: boolean }>`
  height: ${({ $showScrollbar: $scroll }) => ($scroll ? '500px' : 'auto')};
  overflow-x: hidden;
  overflow-y: auto;
  width: 100%;
  & > div:not(:last-child) {
    border-bottom: 2px solid ${background};
  }
`

const NotificationType = styled.h4`
  all: unset;
  display: block;
  font-weight: 400;
  font-size: 14px;
  color: ${black300};
  margin-bottom: 12px;
`

export default NotificationList
