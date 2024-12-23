import {
  prepareEvent,
  prepareContractCall,
  readContract,
  type BaseTransactionOptions,
  type AbiParameterToPrimitiveType,
} from "thirdweb";

/**
* Contract events
*/

/**
 * Represents the filters for the "Approval" event.
 */
export type ApprovalEventFilters = Partial<{
  owner: AbiParameterToPrimitiveType<{"indexed":true,"internalType":"address","name":"owner","type":"address"}>
approved: AbiParameterToPrimitiveType<{"indexed":true,"internalType":"address","name":"approved","type":"address"}>
tokenId: AbiParameterToPrimitiveType<{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}>
}>;

/**
 * Creates an event object for the Approval event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { approvalEvent } from "TODO";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  approvalEvent({
 *  owner: ...,
 *  approved: ...,
 *  tokenId: ...,
 * })
 * ],
 * });
 * ```
 */
export function approvalEvent(filters: ApprovalEventFilters = {}) {
  return prepareEvent({
    signature: "event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId)",
    filters,
  });
};
  

/**
 * Represents the filters for the "ApprovalForAll" event.
 */
export type ApprovalForAllEventFilters = Partial<{
  owner: AbiParameterToPrimitiveType<{"indexed":true,"internalType":"address","name":"owner","type":"address"}>
operator: AbiParameterToPrimitiveType<{"indexed":true,"internalType":"address","name":"operator","type":"address"}>
}>;

/**
 * Creates an event object for the ApprovalForAll event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { approvalForAllEvent } from "TODO";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  approvalForAllEvent({
 *  owner: ...,
 *  operator: ...,
 * })
 * ],
 * });
 * ```
 */
export function approvalForAllEvent(filters: ApprovalForAllEventFilters = {}) {
  return prepareEvent({
    signature: "event ApprovalForAll(address indexed owner, address indexed operator, bool approved)",
    filters,
  });
};
  

/**
 * Represents the filters for the "OwnershipTransferred" event.
 */
export type OwnershipTransferredEventFilters = Partial<{
  previousOwner: AbiParameterToPrimitiveType<{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"}>
newOwner: AbiParameterToPrimitiveType<{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}>
}>;

/**
 * Creates an event object for the OwnershipTransferred event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { ownershipTransferredEvent } from "TODO";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  ownershipTransferredEvent({
 *  previousOwner: ...,
 *  newOwner: ...,
 * })
 * ],
 * });
 * ```
 */
export function ownershipTransferredEvent(filters: OwnershipTransferredEventFilters = {}) {
  return prepareEvent({
    signature: "event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)",
    filters,
  });
};
  

/**
 * Represents the filters for the "PackCreated" event.
 */
export type PackCreatedEventFilters = Partial<{
  tokenId: AbiParameterToPrimitiveType<{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}>
creator: AbiParameterToPrimitiveType<{"indexed":true,"internalType":"address","name":"creator","type":"address"}>
}>;

/**
 * Creates an event object for the PackCreated event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { packCreatedEvent } from "TODO";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  packCreatedEvent({
 *  tokenId: ...,
 *  creator: ...,
 * })
 * ],
 * });
 * ```
 */
export function packCreatedEvent(filters: PackCreatedEventFilters = {}) {
  return prepareEvent({
    signature: "event PackCreated(uint256 indexed tokenId, address indexed creator, (address tokenAddress, uint256 amount)[] erc20Tokens, (address tokenAddress, uint256 tokenId)[] erc721Tokens, (address tokenAddress, uint256 tokenId, uint256 amount)[] erc1155Tokens, uint256 ethAmount)",
    filters,
  });
};
  

/**
 * Represents the filters for the "PackOpened" event.
 */
export type PackOpenedEventFilters = Partial<{
  tokenId: AbiParameterToPrimitiveType<{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}>
opener: AbiParameterToPrimitiveType<{"indexed":true,"internalType":"address","name":"opener","type":"address"}>
}>;

/**
 * Creates an event object for the PackOpened event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { packOpenedEvent } from "TODO";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  packOpenedEvent({
 *  tokenId: ...,
 *  opener: ...,
 * })
 * ],
 * });
 * ```
 */
export function packOpenedEvent(filters: PackOpenedEventFilters = {}) {
  return prepareEvent({
    signature: "event PackOpened(uint256 indexed tokenId, address indexed opener)",
    filters,
  });
};
  

/**
 * Represents the filters for the "RoleAdminChanged" event.
 */
export type RoleAdminChangedEventFilters = Partial<{
  role: AbiParameterToPrimitiveType<{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"}>
previousAdminRole: AbiParameterToPrimitiveType<{"indexed":true,"internalType":"bytes32","name":"previousAdminRole","type":"bytes32"}>
newAdminRole: AbiParameterToPrimitiveType<{"indexed":true,"internalType":"bytes32","name":"newAdminRole","type":"bytes32"}>
}>;

/**
 * Creates an event object for the RoleAdminChanged event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { roleAdminChangedEvent } from "TODO";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  roleAdminChangedEvent({
 *  role: ...,
 *  previousAdminRole: ...,
 *  newAdminRole: ...,
 * })
 * ],
 * });
 * ```
 */
export function roleAdminChangedEvent(filters: RoleAdminChangedEventFilters = {}) {
  return prepareEvent({
    signature: "event RoleAdminChanged(bytes32 indexed role, bytes32 indexed previousAdminRole, bytes32 indexed newAdminRole)",
    filters,
  });
};
  

/**
 * Represents the filters for the "RoleGranted" event.
 */
export type RoleGrantedEventFilters = Partial<{
  role: AbiParameterToPrimitiveType<{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"}>
account: AbiParameterToPrimitiveType<{"indexed":true,"internalType":"address","name":"account","type":"address"}>
sender: AbiParameterToPrimitiveType<{"indexed":true,"internalType":"address","name":"sender","type":"address"}>
}>;

/**
 * Creates an event object for the RoleGranted event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { roleGrantedEvent } from "TODO";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  roleGrantedEvent({
 *  role: ...,
 *  account: ...,
 *  sender: ...,
 * })
 * ],
 * });
 * ```
 */
export function roleGrantedEvent(filters: RoleGrantedEventFilters = {}) {
  return prepareEvent({
    signature: "event RoleGranted(bytes32 indexed role, address indexed account, address indexed sender)",
    filters,
  });
};
  

/**
 * Represents the filters for the "RoleRevoked" event.
 */
export type RoleRevokedEventFilters = Partial<{
  role: AbiParameterToPrimitiveType<{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"}>
account: AbiParameterToPrimitiveType<{"indexed":true,"internalType":"address","name":"account","type":"address"}>
sender: AbiParameterToPrimitiveType<{"indexed":true,"internalType":"address","name":"sender","type":"address"}>
}>;

/**
 * Creates an event object for the RoleRevoked event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { roleRevokedEvent } from "TODO";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  roleRevokedEvent({
 *  role: ...,
 *  account: ...,
 *  sender: ...,
 * })
 * ],
 * });
 * ```
 */
export function roleRevokedEvent(filters: RoleRevokedEventFilters = {}) {
  return prepareEvent({
    signature: "event RoleRevoked(bytes32 indexed role, address indexed account, address indexed sender)",
    filters,
  });
};
  

/**
 * Represents the filters for the "Transfer" event.
 */
export type TransferEventFilters = Partial<{
  from: AbiParameterToPrimitiveType<{"indexed":true,"internalType":"address","name":"from","type":"address"}>
to: AbiParameterToPrimitiveType<{"indexed":true,"internalType":"address","name":"to","type":"address"}>
tokenId: AbiParameterToPrimitiveType<{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}>
}>;

/**
 * Creates an event object for the Transfer event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { transferEvent } from "TODO";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  transferEvent({
 *  from: ...,
 *  to: ...,
 *  tokenId: ...,
 * })
 * ],
 * });
 * ```
 */
export function transferEvent(filters: TransferEventFilters = {}) {
  return prepareEvent({
    signature: "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)",
    filters,
  });
};
  

/**
* Contract read functions
*/



/**
 * Calls the "DEFAULT_ADMIN_ROLE" function on the contract.
 * @param options - The options for the DEFAULT_ADMIN_ROLE function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { DEFAULT_ADMIN_ROLE } from "TODO";
 *
 * const result = await DEFAULT_ADMIN_ROLE();
 *
 * ```
 */
export async function DEFAULT_ADMIN_ROLE(
  options: BaseTransactionOptions
) {
  return readContract({
    contract: options.contract,
    method: [
  "0xa217fddf",
  [],
  [
    {
      "internalType": "bytes32",
      "name": "",
      "type": "bytes32"
    }
  ]
],
    params: []
  });
};




/**
 * Calls the "OPENER_ROLE" function on the contract.
 * @param options - The options for the OPENER_ROLE function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { OPENER_ROLE } from "TODO";
 *
 * const result = await OPENER_ROLE();
 *
 * ```
 */
export async function OPENER_ROLE(
  options: BaseTransactionOptions
) {
  return readContract({
    contract: options.contract,
    method: [
  "0x2cfc828b",
  [],
  [
    {
      "internalType": "bytes32",
      "name": "",
      "type": "bytes32"
    }
  ]
],
    params: []
  });
};


/**
 * Represents the parameters for the "balanceOf" function.
 */
export type BalanceOfParams = {
  owner: AbiParameterToPrimitiveType<{"internalType":"address","name":"owner","type":"address"}>
};

/**
 * Calls the "balanceOf" function on the contract.
 * @param options - The options for the balanceOf function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { balanceOf } from "TODO";
 *
 * const result = await balanceOf({
 *  owner: ...,
 * });
 *
 * ```
 */
export async function balanceOf(
  options: BaseTransactionOptions<BalanceOfParams>
) {
  return readContract({
    contract: options.contract,
    method: [
  "0x70a08231",
  [
    {
      "internalType": "address",
      "name": "owner",
      "type": "address"
    }
  ],
  [
    {
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    }
  ]
],
    params: [options.owner]
  });
};


/**
 * Represents the parameters for the "getApproved" function.
 */
export type GetApprovedParams = {
  tokenId: AbiParameterToPrimitiveType<{"internalType":"uint256","name":"tokenId","type":"uint256"}>
};

/**
 * Calls the "getApproved" function on the contract.
 * @param options - The options for the getApproved function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { getApproved } from "TODO";
 *
 * const result = await getApproved({
 *  tokenId: ...,
 * });
 *
 * ```
 */
export async function getApproved(
  options: BaseTransactionOptions<GetApprovedParams>
) {
  return readContract({
    contract: options.contract,
    method: [
  "0x081812fc",
  [
    {
      "internalType": "uint256",
      "name": "tokenId",
      "type": "uint256"
    }
  ],
  [
    {
      "internalType": "address",
      "name": "",
      "type": "address"
    }
  ]
],
    params: [options.tokenId]
  });
};


/**
 * Represents the parameters for the "getPack" function.
 */
export type GetPackParams = {
  tokenId: AbiParameterToPrimitiveType<{"internalType":"uint256","name":"tokenId","type":"uint256"}>
};

/**
 * Calls the "getPack" function on the contract.
 * @param options - The options for the getPack function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { getPack } from "TODO";
 *
 * const result = await getPack({
 *  tokenId: ...,
 * });
 *
 * ```
 */
export async function getPack(
  options: BaseTransactionOptions<GetPackParams>
) {
  return readContract({
    contract: options.contract,
    method: [
  "0x895ec54c",
  [
    {
      "internalType": "uint256",
      "name": "tokenId",
      "type": "uint256"
    }
  ],
  [
    {
      "components": [
        {
          "internalType": "address",
          "name": "creator",
          "type": "address"
        },
        {
          "components": [
            {
              "internalType": "address",
              "name": "tokenAddress",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            }
          ],
          "internalType": "struct GiftPack.ERC20Token[]",
          "name": "erc20Tokens",
          "type": "tuple[]"
        },
        {
          "components": [
            {
              "internalType": "address",
              "name": "tokenAddress",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "tokenId",
              "type": "uint256"
            }
          ],
          "internalType": "struct GiftPack.ERC721Token[]",
          "name": "erc721Tokens",
          "type": "tuple[]"
        },
        {
          "components": [
            {
              "internalType": "address",
              "name": "tokenAddress",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "tokenId",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            }
          ],
          "internalType": "struct GiftPack.ERC1155Token[]",
          "name": "erc1155Tokens",
          "type": "tuple[]"
        },
        {
          "internalType": "bool",
          "name": "opened",
          "type": "bool"
        },
        {
          "internalType": "uint256",
          "name": "ethAmount",
          "type": "uint256"
        }
      ],
      "internalType": "struct GiftPack.Pack",
      "name": "",
      "type": "tuple"
    }
  ]
],
    params: [options.tokenId]
  });
};


/**
 * Represents the parameters for the "getPackByHash" function.
 */
export type GetPackByHashParams = {
  hash: AbiParameterToPrimitiveType<{"internalType":"bytes32","name":"hash","type":"bytes32"}>
};

/**
 * Calls the "getPackByHash" function on the contract.
 * @param options - The options for the getPackByHash function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { getPackByHash } from "TODO";
 *
 * const result = await getPackByHash({
 *  hash: ...,
 * });
 *
 * ```
 */
export async function getPackByHash(
  options: BaseTransactionOptions<GetPackByHashParams>
) {
  return readContract({
    contract: options.contract,
    method: [
  "0xd9f7d864",
  [
    {
      "internalType": "bytes32",
      "name": "hash",
      "type": "bytes32"
    }
  ],
  [
    {
      "components": [
        {
          "internalType": "address",
          "name": "creator",
          "type": "address"
        },
        {
          "components": [
            {
              "internalType": "address",
              "name": "tokenAddress",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            }
          ],
          "internalType": "struct GiftPack.ERC20Token[]",
          "name": "erc20Tokens",
          "type": "tuple[]"
        },
        {
          "components": [
            {
              "internalType": "address",
              "name": "tokenAddress",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "tokenId",
              "type": "uint256"
            }
          ],
          "internalType": "struct GiftPack.ERC721Token[]",
          "name": "erc721Tokens",
          "type": "tuple[]"
        },
        {
          "components": [
            {
              "internalType": "address",
              "name": "tokenAddress",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "tokenId",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            }
          ],
          "internalType": "struct GiftPack.ERC1155Token[]",
          "name": "erc1155Tokens",
          "type": "tuple[]"
        },
        {
          "internalType": "bool",
          "name": "opened",
          "type": "bool"
        },
        {
          "internalType": "uint256",
          "name": "ethAmount",
          "type": "uint256"
        }
      ],
      "internalType": "struct GiftPack.Pack",
      "name": "",
      "type": "tuple"
    }
  ]
],
    params: [options.hash]
  });
};


/**
 * Represents the parameters for the "getPackCreator" function.
 */
export type GetPackCreatorParams = {
  tokenId: AbiParameterToPrimitiveType<{"internalType":"uint256","name":"tokenId","type":"uint256"}>
};

/**
 * Calls the "getPackCreator" function on the contract.
 * @param options - The options for the getPackCreator function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { getPackCreator } from "TODO";
 *
 * const result = await getPackCreator({
 *  tokenId: ...,
 * });
 *
 * ```
 */
export async function getPackCreator(
  options: BaseTransactionOptions<GetPackCreatorParams>
) {
  return readContract({
    contract: options.contract,
    method: [
  "0x63aae736",
  [
    {
      "internalType": "uint256",
      "name": "tokenId",
      "type": "uint256"
    }
  ],
  [
    {
      "internalType": "address",
      "name": "",
      "type": "address"
    }
  ]
],
    params: [options.tokenId]
  });
};


/**
 * Represents the parameters for the "getPackERC1155Tokens" function.
 */
export type GetPackERC1155TokensParams = {
  tokenId: AbiParameterToPrimitiveType<{"internalType":"uint256","name":"tokenId","type":"uint256"}>
};

/**
 * Calls the "getPackERC1155Tokens" function on the contract.
 * @param options - The options for the getPackERC1155Tokens function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { getPackERC1155Tokens } from "TODO";
 *
 * const result = await getPackERC1155Tokens({
 *  tokenId: ...,
 * });
 *
 * ```
 */
export async function getPackERC1155Tokens(
  options: BaseTransactionOptions<GetPackERC1155TokensParams>
) {
  return readContract({
    contract: options.contract,
    method: [
  "0x12124722",
  [
    {
      "internalType": "uint256",
      "name": "tokenId",
      "type": "uint256"
    }
  ],
  [
    {
      "components": [
        {
          "internalType": "address",
          "name": "tokenAddress",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "internalType": "struct GiftPack.ERC1155Token[]",
      "name": "",
      "type": "tuple[]"
    }
  ]
],
    params: [options.tokenId]
  });
};


/**
 * Represents the parameters for the "getPackERC20Tokens" function.
 */
export type GetPackERC20TokensParams = {
  tokenId: AbiParameterToPrimitiveType<{"internalType":"uint256","name":"tokenId","type":"uint256"}>
};

/**
 * Calls the "getPackERC20Tokens" function on the contract.
 * @param options - The options for the getPackERC20Tokens function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { getPackERC20Tokens } from "TODO";
 *
 * const result = await getPackERC20Tokens({
 *  tokenId: ...,
 * });
 *
 * ```
 */
export async function getPackERC20Tokens(
  options: BaseTransactionOptions<GetPackERC20TokensParams>
) {
  return readContract({
    contract: options.contract,
    method: [
  "0x0cb4dd99",
  [
    {
      "internalType": "uint256",
      "name": "tokenId",
      "type": "uint256"
    }
  ],
  [
    {
      "components": [
        {
          "internalType": "address",
          "name": "tokenAddress",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "internalType": "struct GiftPack.ERC20Token[]",
      "name": "",
      "type": "tuple[]"
    }
  ]
],
    params: [options.tokenId]
  });
};


/**
 * Represents the parameters for the "getPackERC721Tokens" function.
 */
export type GetPackERC721TokensParams = {
  tokenId: AbiParameterToPrimitiveType<{"internalType":"uint256","name":"tokenId","type":"uint256"}>
};

/**
 * Calls the "getPackERC721Tokens" function on the contract.
 * @param options - The options for the getPackERC721Tokens function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { getPackERC721Tokens } from "TODO";
 *
 * const result = await getPackERC721Tokens({
 *  tokenId: ...,
 * });
 *
 * ```
 */
export async function getPackERC721Tokens(
  options: BaseTransactionOptions<GetPackERC721TokensParams>
) {
  return readContract({
    contract: options.contract,
    method: [
  "0x23c35ca2",
  [
    {
      "internalType": "uint256",
      "name": "tokenId",
      "type": "uint256"
    }
  ],
  [
    {
      "components": [
        {
          "internalType": "address",
          "name": "tokenAddress",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "internalType": "struct GiftPack.ERC721Token[]",
      "name": "",
      "type": "tuple[]"
    }
  ]
],
    params: [options.tokenId]
  });
};


/**
 * Represents the parameters for the "getPackEthAmount" function.
 */
export type GetPackEthAmountParams = {
  tokenId: AbiParameterToPrimitiveType<{"internalType":"uint256","name":"tokenId","type":"uint256"}>
};

/**
 * Calls the "getPackEthAmount" function on the contract.
 * @param options - The options for the getPackEthAmount function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { getPackEthAmount } from "TODO";
 *
 * const result = await getPackEthAmount({
 *  tokenId: ...,
 * });
 *
 * ```
 */
export async function getPackEthAmount(
  options: BaseTransactionOptions<GetPackEthAmountParams>
) {
  return readContract({
    contract: options.contract,
    method: [
  "0xe9d4bf05",
  [
    {
      "internalType": "uint256",
      "name": "tokenId",
      "type": "uint256"
    }
  ],
  [
    {
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    }
  ]
],
    params: [options.tokenId]
  });
};


/**
 * Represents the parameters for the "getRoleAdmin" function.
 */
export type GetRoleAdminParams = {
  role: AbiParameterToPrimitiveType<{"internalType":"bytes32","name":"role","type":"bytes32"}>
};

/**
 * Calls the "getRoleAdmin" function on the contract.
 * @param options - The options for the getRoleAdmin function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { getRoleAdmin } from "TODO";
 *
 * const result = await getRoleAdmin({
 *  role: ...,
 * });
 *
 * ```
 */
export async function getRoleAdmin(
  options: BaseTransactionOptions<GetRoleAdminParams>
) {
  return readContract({
    contract: options.contract,
    method: [
  "0x248a9ca3",
  [
    {
      "internalType": "bytes32",
      "name": "role",
      "type": "bytes32"
    }
  ],
  [
    {
      "internalType": "bytes32",
      "name": "",
      "type": "bytes32"
    }
  ]
],
    params: [options.role]
  });
};


/**
 * Represents the parameters for the "hasRole" function.
 */
export type HasRoleParams = {
  role: AbiParameterToPrimitiveType<{"internalType":"bytes32","name":"role","type":"bytes32"}>
account: AbiParameterToPrimitiveType<{"internalType":"address","name":"account","type":"address"}>
};

/**
 * Calls the "hasRole" function on the contract.
 * @param options - The options for the hasRole function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { hasRole } from "TODO";
 *
 * const result = await hasRole({
 *  role: ...,
 *  account: ...,
 * });
 *
 * ```
 */
export async function hasRole(
  options: BaseTransactionOptions<HasRoleParams>
) {
  return readContract({
    contract: options.contract,
    method: [
  "0x91d14854",
  [
    {
      "internalType": "bytes32",
      "name": "role",
      "type": "bytes32"
    },
    {
      "internalType": "address",
      "name": "account",
      "type": "address"
    }
  ],
  [
    {
      "internalType": "bool",
      "name": "",
      "type": "bool"
    }
  ]
],
    params: [options.role, options.account]
  });
};


/**
 * Represents the parameters for the "isApprovedForAll" function.
 */
export type IsApprovedForAllParams = {
  owner: AbiParameterToPrimitiveType<{"internalType":"address","name":"owner","type":"address"}>
operator: AbiParameterToPrimitiveType<{"internalType":"address","name":"operator","type":"address"}>
};

/**
 * Calls the "isApprovedForAll" function on the contract.
 * @param options - The options for the isApprovedForAll function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { isApprovedForAll } from "TODO";
 *
 * const result = await isApprovedForAll({
 *  owner: ...,
 *  operator: ...,
 * });
 *
 * ```
 */
export async function isApprovedForAll(
  options: BaseTransactionOptions<IsApprovedForAllParams>
) {
  return readContract({
    contract: options.contract,
    method: [
  "0xe985e9c5",
  [
    {
      "internalType": "address",
      "name": "owner",
      "type": "address"
    },
    {
      "internalType": "address",
      "name": "operator",
      "type": "address"
    }
  ],
  [
    {
      "internalType": "bool",
      "name": "",
      "type": "bool"
    }
  ]
],
    params: [options.owner, options.operator]
  });
};


/**
 * Represents the parameters for the "isHashUsed" function.
 */
export type IsHashUsedParams = {
  hash: AbiParameterToPrimitiveType<{"internalType":"bytes32","name":"hash","type":"bytes32"}>
};

/**
 * Calls the "isHashUsed" function on the contract.
 * @param options - The options for the isHashUsed function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { isHashUsed } from "TODO";
 *
 * const result = await isHashUsed({
 *  hash: ...,
 * });
 *
 * ```
 */
export async function isHashUsed(
  options: BaseTransactionOptions<IsHashUsedParams>
) {
  return readContract({
    contract: options.contract,
    method: [
  "0x20021d8b",
  [
    {
      "internalType": "bytes32",
      "name": "hash",
      "type": "bytes32"
    }
  ],
  [
    {
      "internalType": "bool",
      "name": "",
      "type": "bool"
    }
  ]
],
    params: [options.hash]
  });
};


/**
 * Represents the parameters for the "isPackOpened" function.
 */
export type IsPackOpenedParams = {
  tokenId: AbiParameterToPrimitiveType<{"internalType":"uint256","name":"tokenId","type":"uint256"}>
};

/**
 * Calls the "isPackOpened" function on the contract.
 * @param options - The options for the isPackOpened function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { isPackOpened } from "TODO";
 *
 * const result = await isPackOpened({
 *  tokenId: ...,
 * });
 *
 * ```
 */
export async function isPackOpened(
  options: BaseTransactionOptions<IsPackOpenedParams>
) {
  return readContract({
    contract: options.contract,
    method: [
  "0x8a06e559",
  [
    {
      "internalType": "uint256",
      "name": "tokenId",
      "type": "uint256"
    }
  ],
  [
    {
      "internalType": "bool",
      "name": "",
      "type": "bool"
    }
  ]
],
    params: [options.tokenId]
  });
};




/**
 * Calls the "name" function on the contract.
 * @param options - The options for the name function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { name } from "TODO";
 *
 * const result = await name();
 *
 * ```
 */
export async function name(
  options: BaseTransactionOptions
) {
  return readContract({
    contract: options.contract,
    method: [
  "0x06fdde03",
  [],
  [
    {
      "internalType": "string",
      "name": "",
      "type": "string"
    }
  ]
],
    params: []
  });
};




/**
 * Calls the "owner" function on the contract.
 * @param options - The options for the owner function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { owner } from "TODO";
 *
 * const result = await owner();
 *
 * ```
 */
export async function owner(
  options: BaseTransactionOptions
) {
  return readContract({
    contract: options.contract,
    method: [
  "0x8da5cb5b",
  [],
  [
    {
      "internalType": "address",
      "name": "",
      "type": "address"
    }
  ]
],
    params: []
  });
};


/**
 * Represents the parameters for the "ownerOf" function.
 */
export type OwnerOfParams = {
  tokenId: AbiParameterToPrimitiveType<{"internalType":"uint256","name":"tokenId","type":"uint256"}>
};

/**
 * Calls the "ownerOf" function on the contract.
 * @param options - The options for the ownerOf function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { ownerOf } from "TODO";
 *
 * const result = await ownerOf({
 *  tokenId: ...,
 * });
 *
 * ```
 */
export async function ownerOf(
  options: BaseTransactionOptions<OwnerOfParams>
) {
  return readContract({
    contract: options.contract,
    method: [
  "0x6352211e",
  [
    {
      "internalType": "uint256",
      "name": "tokenId",
      "type": "uint256"
    }
  ],
  [
    {
      "internalType": "address",
      "name": "",
      "type": "address"
    }
  ]
],
    params: [options.tokenId]
  });
};


/**
 * Represents the parameters for the "packs" function.
 */
export type PacksParams = {
  arg_0: AbiParameterToPrimitiveType<{"internalType":"uint256","name":"","type":"uint256"}>
};

/**
 * Calls the "packs" function on the contract.
 * @param options - The options for the packs function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { packs } from "TODO";
 *
 * const result = await packs({
 *  arg_0: ...,
 * });
 *
 * ```
 */
export async function packs(
  options: BaseTransactionOptions<PacksParams>
) {
  return readContract({
    contract: options.contract,
    method: [
  "0xb84c1392",
  [
    {
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    }
  ],
  [
    {
      "internalType": "address",
      "name": "creator",
      "type": "address"
    },
    {
      "internalType": "bool",
      "name": "opened",
      "type": "bool"
    },
    {
      "internalType": "uint256",
      "name": "ethAmount",
      "type": "uint256"
    }
  ]
],
    params: [options.arg_0]
  });
};


/**
 * Represents the parameters for the "supportsInterface" function.
 */
export type SupportsInterfaceParams = {
  interfaceId: AbiParameterToPrimitiveType<{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}>
};

/**
 * Calls the "supportsInterface" function on the contract.
 * @param options - The options for the supportsInterface function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { supportsInterface } from "TODO";
 *
 * const result = await supportsInterface({
 *  interfaceId: ...,
 * });
 *
 * ```
 */
export async function supportsInterface(
  options: BaseTransactionOptions<SupportsInterfaceParams>
) {
  return readContract({
    contract: options.contract,
    method: [
  "0x01ffc9a7",
  [
    {
      "internalType": "bytes4",
      "name": "interfaceId",
      "type": "bytes4"
    }
  ],
  [
    {
      "internalType": "bool",
      "name": "",
      "type": "bool"
    }
  ]
],
    params: [options.interfaceId]
  });
};




/**
 * Calls the "symbol" function on the contract.
 * @param options - The options for the symbol function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { symbol } from "TODO";
 *
 * const result = await symbol();
 *
 * ```
 */
export async function symbol(
  options: BaseTransactionOptions
) {
  return readContract({
    contract: options.contract,
    method: [
  "0x95d89b41",
  [],
  [
    {
      "internalType": "string",
      "name": "",
      "type": "string"
    }
  ]
],
    params: []
  });
};


/**
 * Represents the parameters for the "tokenURI" function.
 */
export type TokenURIParams = {
  tokenId: AbiParameterToPrimitiveType<{"internalType":"uint256","name":"tokenId","type":"uint256"}>
};

/**
 * Calls the "tokenURI" function on the contract.
 * @param options - The options for the tokenURI function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { tokenURI } from "TODO";
 *
 * const result = await tokenURI({
 *  tokenId: ...,
 * });
 *
 * ```
 */
export async function tokenURI(
  options: BaseTransactionOptions<TokenURIParams>
) {
  return readContract({
    contract: options.contract,
    method: [
  "0xc87b56dd",
  [
    {
      "internalType": "uint256",
      "name": "tokenId",
      "type": "uint256"
    }
  ],
  [
    {
      "internalType": "string",
      "name": "",
      "type": "string"
    }
  ]
],
    params: [options.tokenId]
  });
};


/**
* Contract write functions
*/

/**
 * Represents the parameters for the "approve" function.
 */
export type ApproveParams = {
  to: AbiParameterToPrimitiveType<{"internalType":"address","name":"to","type":"address"}>
tokenId: AbiParameterToPrimitiveType<{"internalType":"uint256","name":"tokenId","type":"uint256"}>
};

/**
 * Calls the "approve" function on the contract.
 * @param options - The options for the "approve" function.
 * @returns A prepared transaction object.
 * @example
 * ```
 * import { approve } from "TODO";
 *
 * const transaction = approve({
 *  to: ...,
 *  tokenId: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function approve(
  options: BaseTransactionOptions<ApproveParams>
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
  "0x095ea7b3",
  [
    {
      "internalType": "address",
      "name": "to",
      "type": "address"
    },
    {
      "internalType": "uint256",
      "name": "tokenId",
      "type": "uint256"
    }
  ],
  []
],
    params: [options.to, options.tokenId]
  });
};


/**
 * Represents the parameters for the "createPack" function.
 */
export type CreatePackParams = {
  erc20Tokens: AbiParameterToPrimitiveType<{"components":[{"internalType":"address","name":"tokenAddress","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"internalType":"struct GiftPack.ERC20Token[]","name":"erc20Tokens","type":"tuple[]"}>
erc721Tokens: AbiParameterToPrimitiveType<{"components":[{"internalType":"address","name":"tokenAddress","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"internalType":"struct GiftPack.ERC721Token[]","name":"erc721Tokens","type":"tuple[]"}>
erc1155Tokens: AbiParameterToPrimitiveType<{"components":[{"internalType":"address","name":"tokenAddress","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"uint256","name":"amount","type":"uint256"}],"internalType":"struct GiftPack.ERC1155Token[]","name":"erc1155Tokens","type":"tuple[]"}>
hash: AbiParameterToPrimitiveType<{"internalType":"bytes32","name":"hash","type":"bytes32"}>
};

/**
 * Calls the "createPack" function on the contract.
 * @param options - The options for the "createPack" function.
 * @returns A prepared transaction object.
 * @example
 * ```
 * import { createPack } from "TODO";
 *
 * const transaction = createPack({
 *  erc20Tokens: ...,
 *  erc721Tokens: ...,
 *  erc1155Tokens: ...,
 *  hash: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function createPack(
  options: BaseTransactionOptions<CreatePackParams>
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
  "0x6faa6188",
  [
    {
      "components": [
        {
          "internalType": "address",
          "name": "tokenAddress",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "internalType": "struct GiftPack.ERC20Token[]",
      "name": "erc20Tokens",
      "type": "tuple[]"
    },
    {
      "components": [
        {
          "internalType": "address",
          "name": "tokenAddress",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "internalType": "struct GiftPack.ERC721Token[]",
      "name": "erc721Tokens",
      "type": "tuple[]"
    },
    {
      "components": [
        {
          "internalType": "address",
          "name": "tokenAddress",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "internalType": "struct GiftPack.ERC1155Token[]",
      "name": "erc1155Tokens",
      "type": "tuple[]"
    },
    {
      "internalType": "bytes32",
      "name": "hash",
      "type": "bytes32"
    }
  ],
  [
    {
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    }
  ]
],
    params: [options.erc20Tokens, options.erc721Tokens, options.erc1155Tokens, options.hash]
  });
};


/**
 * Represents the parameters for the "grantRole" function.
 */
export type GrantRoleParams = {
  role: AbiParameterToPrimitiveType<{"internalType":"bytes32","name":"role","type":"bytes32"}>
account: AbiParameterToPrimitiveType<{"internalType":"address","name":"account","type":"address"}>
};

/**
 * Calls the "grantRole" function on the contract.
 * @param options - The options for the "grantRole" function.
 * @returns A prepared transaction object.
 * @example
 * ```
 * import { grantRole } from "TODO";
 *
 * const transaction = grantRole({
 *  role: ...,
 *  account: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function grantRole(
  options: BaseTransactionOptions<GrantRoleParams>
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
  "0x2f2ff15d",
  [
    {
      "internalType": "bytes32",
      "name": "role",
      "type": "bytes32"
    },
    {
      "internalType": "address",
      "name": "account",
      "type": "address"
    }
  ],
  []
],
    params: [options.role, options.account]
  });
};


/**
 * Represents the parameters for the "onERC1155BatchReceived" function.
 */
export type OnERC1155BatchReceivedParams = {
  arg_0: AbiParameterToPrimitiveType<{"internalType":"address","name":"","type":"address"}>
arg_1: AbiParameterToPrimitiveType<{"internalType":"address","name":"","type":"address"}>
arg_2: AbiParameterToPrimitiveType<{"internalType":"uint256[]","name":"","type":"uint256[]"}>
arg_3: AbiParameterToPrimitiveType<{"internalType":"uint256[]","name":"","type":"uint256[]"}>
arg_4: AbiParameterToPrimitiveType<{"internalType":"bytes","name":"","type":"bytes"}>
};

/**
 * Calls the "onERC1155BatchReceived" function on the contract.
 * @param options - The options for the "onERC1155BatchReceived" function.
 * @returns A prepared transaction object.
 * @example
 * ```
 * import { onERC1155BatchReceived } from "TODO";
 *
 * const transaction = onERC1155BatchReceived({
 *  arg_0: ...,
 *  arg_1: ...,
 *  arg_2: ...,
 *  arg_3: ...,
 *  arg_4: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function onERC1155BatchReceived(
  options: BaseTransactionOptions<OnERC1155BatchReceivedParams>
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
  "0xbc197c81",
  [
    {
      "internalType": "address",
      "name": "",
      "type": "address"
    },
    {
      "internalType": "address",
      "name": "",
      "type": "address"
    },
    {
      "internalType": "uint256[]",
      "name": "",
      "type": "uint256[]"
    },
    {
      "internalType": "uint256[]",
      "name": "",
      "type": "uint256[]"
    },
    {
      "internalType": "bytes",
      "name": "",
      "type": "bytes"
    }
  ],
  [
    {
      "internalType": "bytes4",
      "name": "",
      "type": "bytes4"
    }
  ]
],
    params: [options.arg_0, options.arg_1, options.arg_2, options.arg_3, options.arg_4]
  });
};


/**
 * Represents the parameters for the "onERC1155Received" function.
 */
export type OnERC1155ReceivedParams = {
  arg_0: AbiParameterToPrimitiveType<{"internalType":"address","name":"","type":"address"}>
arg_1: AbiParameterToPrimitiveType<{"internalType":"address","name":"","type":"address"}>
arg_2: AbiParameterToPrimitiveType<{"internalType":"uint256","name":"","type":"uint256"}>
arg_3: AbiParameterToPrimitiveType<{"internalType":"uint256","name":"","type":"uint256"}>
arg_4: AbiParameterToPrimitiveType<{"internalType":"bytes","name":"","type":"bytes"}>
};

/**
 * Calls the "onERC1155Received" function on the contract.
 * @param options - The options for the "onERC1155Received" function.
 * @returns A prepared transaction object.
 * @example
 * ```
 * import { onERC1155Received } from "TODO";
 *
 * const transaction = onERC1155Received({
 *  arg_0: ...,
 *  arg_1: ...,
 *  arg_2: ...,
 *  arg_3: ...,
 *  arg_4: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function onERC1155Received(
  options: BaseTransactionOptions<OnERC1155ReceivedParams>
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
  "0xf23a6e61",
  [
    {
      "internalType": "address",
      "name": "",
      "type": "address"
    },
    {
      "internalType": "address",
      "name": "",
      "type": "address"
    },
    {
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    },
    {
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    },
    {
      "internalType": "bytes",
      "name": "",
      "type": "bytes"
    }
  ],
  [
    {
      "internalType": "bytes4",
      "name": "",
      "type": "bytes4"
    }
  ]
],
    params: [options.arg_0, options.arg_1, options.arg_2, options.arg_3, options.arg_4]
  });
};


/**
 * Represents the parameters for the "openPackAsOwner" function.
 */
export type OpenPackAsOwnerParams = {
  tokenId: AbiParameterToPrimitiveType<{"internalType":"uint256","name":"tokenId","type":"uint256"}>
recipient: AbiParameterToPrimitiveType<{"internalType":"address","name":"recipient","type":"address"}>
};

/**
 * Calls the "openPackAsOwner" function on the contract.
 * @param options - The options for the "openPackAsOwner" function.
 * @returns A prepared transaction object.
 * @example
 * ```
 * import { openPackAsOwner } from "TODO";
 *
 * const transaction = openPackAsOwner({
 *  tokenId: ...,
 *  recipient: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function openPackAsOwner(
  options: BaseTransactionOptions<OpenPackAsOwnerParams>
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
  "0x9ab72eaf",
  [
    {
      "internalType": "uint256",
      "name": "tokenId",
      "type": "uint256"
    },
    {
      "internalType": "address",
      "name": "recipient",
      "type": "address"
    }
  ],
  []
],
    params: [options.tokenId, options.recipient]
  });
};


/**
 * Represents the parameters for the "openPackWithPassword" function.
 */
export type OpenPackWithPasswordParams = {
  password: AbiParameterToPrimitiveType<{"internalType":"string","name":"password","type":"string"}>
recipient: AbiParameterToPrimitiveType<{"internalType":"address","name":"recipient","type":"address"}>
};

/**
 * Calls the "openPackWithPassword" function on the contract.
 * @param options - The options for the "openPackWithPassword" function.
 * @returns A prepared transaction object.
 * @example
 * ```
 * import { openPackWithPassword } from "TODO";
 *
 * const transaction = openPackWithPassword({
 *  password: ...,
 *  recipient: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function openPackWithPassword(
  options: BaseTransactionOptions<OpenPackWithPasswordParams>
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
  "0xc5f51513",
  [
    {
      "internalType": "string",
      "name": "password",
      "type": "string"
    },
    {
      "internalType": "address",
      "name": "recipient",
      "type": "address"
    }
  ],
  []
],
    params: [options.password, options.recipient]
  });
};




/**
 * Calls the "renounceOwnership" function on the contract.
 * @param options - The options for the "renounceOwnership" function.
 * @returns A prepared transaction object.
 * @example
 * ```
 * import { renounceOwnership } from "TODO";
 *
 * const transaction = renounceOwnership();
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function renounceOwnership(
  options: BaseTransactionOptions
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
  "0x715018a6",
  [],
  []
],
    params: []
  });
};


/**
 * Represents the parameters for the "renounceRole" function.
 */
export type RenounceRoleParams = {
  role: AbiParameterToPrimitiveType<{"internalType":"bytes32","name":"role","type":"bytes32"}>
callerConfirmation: AbiParameterToPrimitiveType<{"internalType":"address","name":"callerConfirmation","type":"address"}>
};

/**
 * Calls the "renounceRole" function on the contract.
 * @param options - The options for the "renounceRole" function.
 * @returns A prepared transaction object.
 * @example
 * ```
 * import { renounceRole } from "TODO";
 *
 * const transaction = renounceRole({
 *  role: ...,
 *  callerConfirmation: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function renounceRole(
  options: BaseTransactionOptions<RenounceRoleParams>
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
  "0x36568abe",
  [
    {
      "internalType": "bytes32",
      "name": "role",
      "type": "bytes32"
    },
    {
      "internalType": "address",
      "name": "callerConfirmation",
      "type": "address"
    }
  ],
  []
],
    params: [options.role, options.callerConfirmation]
  });
};


/**
 * Represents the parameters for the "revokeRole" function.
 */
export type RevokeRoleParams = {
  role: AbiParameterToPrimitiveType<{"internalType":"bytes32","name":"role","type":"bytes32"}>
account: AbiParameterToPrimitiveType<{"internalType":"address","name":"account","type":"address"}>
};

/**
 * Calls the "revokeRole" function on the contract.
 * @param options - The options for the "revokeRole" function.
 * @returns A prepared transaction object.
 * @example
 * ```
 * import { revokeRole } from "TODO";
 *
 * const transaction = revokeRole({
 *  role: ...,
 *  account: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function revokeRole(
  options: BaseTransactionOptions<RevokeRoleParams>
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
  "0xd547741f",
  [
    {
      "internalType": "bytes32",
      "name": "role",
      "type": "bytes32"
    },
    {
      "internalType": "address",
      "name": "account",
      "type": "address"
    }
  ],
  []
],
    params: [options.role, options.account]
  });
};


/**
 * Represents the parameters for the "safeTransferFrom" function.
 */
export type SafeTransferFromParams = {
  from: AbiParameterToPrimitiveType<{"internalType":"address","name":"from","type":"address"}>
to: AbiParameterToPrimitiveType<{"internalType":"address","name":"to","type":"address"}>
tokenId: AbiParameterToPrimitiveType<{"internalType":"uint256","name":"tokenId","type":"uint256"}>
};

/**
 * Calls the "safeTransferFrom" function on the contract.
 * @param options - The options for the "safeTransferFrom" function.
 * @returns A prepared transaction object.
 * @example
 * ```
 * import { safeTransferFrom } from "TODO";
 *
 * const transaction = safeTransferFrom({
 *  from: ...,
 *  to: ...,
 *  tokenId: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function safeTransferFrom(
  options: BaseTransactionOptions<SafeTransferFromParams>
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
  "0x42842e0e",
  [
    {
      "internalType": "address",
      "name": "from",
      "type": "address"
    },
    {
      "internalType": "address",
      "name": "to",
      "type": "address"
    },
    {
      "internalType": "uint256",
      "name": "tokenId",
      "type": "uint256"
    }
  ],
  []
],
    params: [options.from, options.to, options.tokenId]
  });
};


/**
 * Represents the parameters for the "setApprovalForAll" function.
 */
export type SetApprovalForAllParams = {
  operator: AbiParameterToPrimitiveType<{"internalType":"address","name":"operator","type":"address"}>
approved: AbiParameterToPrimitiveType<{"internalType":"bool","name":"approved","type":"bool"}>
};

/**
 * Calls the "setApprovalForAll" function on the contract.
 * @param options - The options for the "setApprovalForAll" function.
 * @returns A prepared transaction object.
 * @example
 * ```
 * import { setApprovalForAll } from "TODO";
 *
 * const transaction = setApprovalForAll({
 *  operator: ...,
 *  approved: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function setApprovalForAll(
  options: BaseTransactionOptions<SetApprovalForAllParams>
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
  "0xa22cb465",
  [
    {
      "internalType": "address",
      "name": "operator",
      "type": "address"
    },
    {
      "internalType": "bool",
      "name": "approved",
      "type": "bool"
    }
  ],
  []
],
    params: [options.operator, options.approved]
  });
};


/**
 * Represents the parameters for the "setBaseURI" function.
 */
export type SetBaseURIParams = {
  baseURI: AbiParameterToPrimitiveType<{"internalType":"string","name":"baseURI","type":"string"}>
};

/**
 * Calls the "setBaseURI" function on the contract.
 * @param options - The options for the "setBaseURI" function.
 * @returns A prepared transaction object.
 * @example
 * ```
 * import { setBaseURI } from "TODO";
 *
 * const transaction = setBaseURI({
 *  baseURI: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function setBaseURI(
  options: BaseTransactionOptions<SetBaseURIParams>
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
  "0x55f804b3",
  [
    {
      "internalType": "string",
      "name": "baseURI",
      "type": "string"
    }
  ],
  []
],
    params: [options.baseURI]
  });
};


/**
 * Represents the parameters for the "transferFrom" function.
 */
export type TransferFromParams = {
  from: AbiParameterToPrimitiveType<{"internalType":"address","name":"from","type":"address"}>
to: AbiParameterToPrimitiveType<{"internalType":"address","name":"to","type":"address"}>
tokenId: AbiParameterToPrimitiveType<{"internalType":"uint256","name":"tokenId","type":"uint256"}>
};

/**
 * Calls the "transferFrom" function on the contract.
 * @param options - The options for the "transferFrom" function.
 * @returns A prepared transaction object.
 * @example
 * ```
 * import { transferFrom } from "TODO";
 *
 * const transaction = transferFrom({
 *  from: ...,
 *  to: ...,
 *  tokenId: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function transferFrom(
  options: BaseTransactionOptions<TransferFromParams>
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
  "0x23b872dd",
  [
    {
      "internalType": "address",
      "name": "from",
      "type": "address"
    },
    {
      "internalType": "address",
      "name": "to",
      "type": "address"
    },
    {
      "internalType": "uint256",
      "name": "tokenId",
      "type": "uint256"
    }
  ],
  []
],
    params: [options.from, options.to, options.tokenId]
  });
};


/**
 * Represents the parameters for the "transferOwnership" function.
 */
export type TransferOwnershipParams = {
  newOwner: AbiParameterToPrimitiveType<{"internalType":"address","name":"newOwner","type":"address"}>
};

/**
 * Calls the "transferOwnership" function on the contract.
 * @param options - The options for the "transferOwnership" function.
 * @returns A prepared transaction object.
 * @example
 * ```
 * import { transferOwnership } from "TODO";
 *
 * const transaction = transferOwnership({
 *  newOwner: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function transferOwnership(
  options: BaseTransactionOptions<TransferOwnershipParams>
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
  "0xf2fde38b",
  [
    {
      "internalType": "address",
      "name": "newOwner",
      "type": "address"
    }
  ],
  []
],
    params: [options.newOwner]
  });
};


