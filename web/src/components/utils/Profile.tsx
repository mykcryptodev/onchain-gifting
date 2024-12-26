import { AccountAvatar } from "thirdweb/react"

import { AccountName } from "thirdweb/react"
import { Name as OckName, Avatar as OckAvatar } from "@coinbase/onchainkit/identity"

import { AccountProvider } from "thirdweb/react"
import { CHAIN, CLIENT } from "~/constants"
import { type FC } from "react"

type Props = {
  address: string;
  avatarSize?: number;
}

type AvatarProps = {
  address: string
  size: number
}
export const Avatar: FC<AvatarProps> = ({ address, size }) => {
  return (
    <AccountProvider
      client={CLIENT}
      address={address}
    >
      <AccountAvatar
        className={`rounded-full h-${size} w-${size}`}
        loadingComponent={
          <div className={`h-${size} w-${size} rounded-full bg-gray-200 animate-pulse`} />
        }
        fallbackComponent={
          <OckAvatar
            address={address}
            chain={CHAIN}
            className={`rounded-full h-${size} w-${size}`}
          />
        }
      />
    </AccountProvider>
  )
}

export const Name: FC<Props> = ({ address }) => {
  return (
    <AccountProvider
      client={CLIENT}
      address={address}
    >
      <AccountName
        loadingComponent={
          <div className="h-6 w-24 rounded-lg bg-gray-200 animate-pulse" />
        }
        fallbackComponent={
          <OckName
            address={address}
            chain={CHAIN}
          />
        }
      />
    </AccountProvider>
  )
}

export const Profile: FC<Props> = ({ address, avatarSize = 6 }) => {
  return (
    <div className="flex flex-row gap-1 items-center">
      <Avatar address={address} size={avatarSize} />
      <Name address={address} />
    </div>
  )
}