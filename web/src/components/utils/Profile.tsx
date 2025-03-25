import { AccountAvatar } from "thirdweb/react"

import { AccountName, Blobbie } from "thirdweb/react"
import { Name as OckName, Avatar as OckAvatar } from "@coinbase/onchainkit/identity"

import { AccountProvider } from "thirdweb/react"
import { CHAIN, CLIENT } from "~/constants"
import { type FC } from "react"
import { type Chain } from "viem"
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
            address={address as `0x${string}`}
            chain={CHAIN as unknown as Chain}
            className={`rounded-full h-${size} w-${size}`}
            defaultComponent={<Blobbie address={address} className={`h-${size} w-${size}`} />}
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
            address={address as `0x${string}`}
            chain={CHAIN as unknown as Chain}
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