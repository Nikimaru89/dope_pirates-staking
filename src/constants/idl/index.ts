export type PiratesStaking = {
  "version": "0.1.0",
  "name": "pirates_staking",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "bump",
          "type": "u8"
        }
      ]
    },
    {
      "name": "createPool",
      "accounts": [
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "bump",
          "type": "u8"
        }
      ]
    },
    {
      "name": "createTokenData",
      "accounts": [
        {
          "name": "tokenData",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "metadata",
          "type": {
            "defined": "Metadata"
          }
        },
        {
          "name": "bump",
          "type": "u8"
        }
      ]
    },
    {
      "name": "updateTokenData",
      "accounts": [
        {
          "name": "tokenData",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "metadata",
          "type": {
            "defined": "Metadata"
          }
        }
      ]
    },
    {
      "name": "stake",
      "accounts": [
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "stakedData",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenData",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "metadata",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "nftFrom",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "nftTo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "bump",
          "type": "u8"
        }
      ]
    },
    {
      "name": "unstake",
      "accounts": [
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "stakedData",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenData",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "metadata",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "nftFrom",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "nftTo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenFrom",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenTo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "createClaim",
      "accounts": [
        {
          "name": "claim",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "bump",
          "type": "u8"
        }
      ]
    },
    {
      "name": "prepareClaim",
      "accounts": [
        {
          "name": "claim",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "marineCount",
          "type": "u8"
        }
      ]
    },
    {
      "name": "claim",
      "accounts": [
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "stakedData",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenData",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "feeOwner",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "claim",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "metadata",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenFrom",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenTo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "feeTokenTo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "claimBounty",
      "accounts": [
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "stakedData",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenData",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "feeOwner",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pirateMetadata",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "marineMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "marineMetadata",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "marineToken",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenFrom",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenTo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "feeTokenTo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "updateReward",
      "accounts": [
        {
          "name": "stakedData",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenData",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "multiplier",
          "type": "u8"
        },
        {
          "name": "hasAffected",
          "type": "u8"
        }
      ]
    },
    {
      "name": "closePool",
      "accounts": [
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        }
      ],
      "args": []
    },
    {
      "name": "closePoolForce",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "retrieveNft",
      "accounts": [
        {
          "name": "admin",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "stakedData",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenData",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "nftFrom",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "nftTo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenFrom",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenTo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "rewardMethod",
          "type": "u32"
        }
      ]
    },
    {
      "name": "retrieveReward",
      "accounts": [
        {
          "name": "vault",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenFrom",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenTo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amountHigh",
          "type": "u32"
        },
        {
          "name": "amountLow",
          "type": "u32"
        }
      ]
    },
    {
      "name": "updateStakedData",
      "accounts": [
        {
          "name": "stakedData",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "rewardList",
          "type": {
            "vec": {
              "defined": "RewardInfo"
            }
          }
        },
        {
          "name": "bountyList",
          "type": {
            "vec": {
              "defined": "RewardInfo"
            }
          }
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "vault",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "stakedAmount",
            "type": "u32"
          },
          {
            "name": "claimedRewardAmount",
            "type": "u64"
          },
          {
            "name": "claimedBountyAmount",
            "type": "u64"
          },
          {
            "name": "bumpVault",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "pool",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "user",
            "type": "publicKey"
          },
          {
            "name": "stakedAmount",
            "type": "u32"
          },
          {
            "name": "claimedRewardAmount",
            "type": "u64"
          },
          {
            "name": "lastStakedTime",
            "type": "u32"
          },
          {
            "name": "lastUnstakedTime",
            "type": "u32"
          },
          {
            "name": "lastClaimedRewardTime",
            "type": "u32"
          },
          {
            "name": "metadataList",
            "type": {
              "vec": {
                "defined": "Metadata"
              }
            }
          },
          {
            "name": "bumpPool",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "tokenData",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "lastStakedUser",
            "type": "publicKey"
          },
          {
            "name": "mint",
            "type": "publicKey"
          },
          {
            "name": "metadata",
            "type": {
              "defined": "Metadata"
            }
          },
          {
            "name": "bounty",
            "type": "u64"
          },
          {
            "name": "claimedBountyAmount",
            "type": "u64"
          },
          {
            "name": "claimedRewardAmount",
            "type": "u64"
          },
          {
            "name": "lastStakedTime",
            "type": "u32"
          },
          {
            "name": "lastUnstakedTime",
            "type": "u32"
          },
          {
            "name": "lastClaimedRewardTime",
            "type": "u32"
          },
          {
            "name": "lastClaimedBountyTime",
            "type": "u32"
          },
          {
            "name": "isStaked",
            "type": "bool"
          },
          {
            "name": "bumpTokenData",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "stakedData",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "currentUser",
            "type": "publicKey"
          },
          {
            "name": "mint",
            "type": "publicKey"
          },
          {
            "name": "rewardList",
            "type": {
              "vec": {
                "defined": "RewardInfo"
              }
            }
          },
          {
            "name": "bountyList",
            "type": {
              "vec": {
                "defined": "RewardInfo"
              }
            }
          },
          {
            "name": "bumpStakedData",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "claim",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "marineCount",
            "type": "u8"
          },
          {
            "name": "chance",
            "type": "u8"
          },
          {
            "name": "user",
            "type": "publicKey"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "Metadata",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "u32"
          },
          {
            "name": "job",
            "type": "u32"
          },
          {
            "name": "body",
            "type": "u32"
          },
          {
            "name": "clothes",
            "type": "u32"
          },
          {
            "name": "crew",
            "type": "u32"
          },
          {
            "name": "face",
            "type": "u32"
          },
          {
            "name": "head",
            "type": "u32"
          },
          {
            "name": "earring",
            "type": "u32"
          },
          {
            "name": "ducks",
            "type": "u32"
          },
          {
            "name": "special",
            "type": "u32"
          }
        ]
      }
    },
    {
      "name": "RewardInfo",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "time",
            "type": "u32"
          },
          {
            "name": "reward",
            "type": "u64"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "InvalidUser",
      "msg": "Invalid user!"
    },
    {
      "code": 6001,
      "name": "InvalidToken",
      "msg": "Invalid token!"
    },
    {
      "code": 6002,
      "name": "NotFoundMetadata",
      "msg": "Not found metadata!"
    },
    {
      "code": 6003,
      "name": "StakedUnAllowed",
      "msg": "Staked unallowed!"
    },
    {
      "code": 6004,
      "name": "StakedNftsRemaining",
      "msg": "Staked Nfts Remaining!"
    },
    {
      "code": 6005,
      "name": "EmptyMetadataList",
      "msg": "MetadataList is empty!"
    },
    {
      "code": 6006,
      "name": "InvalidNft",
      "msg": "Invalid Nft"
    }
  ]
};

export const IDL: PiratesStaking = {
  "version": "0.1.0",
  "name": "pirates_staking",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "bump",
          "type": "u8"
        }
      ]
    },
    {
      "name": "createPool",
      "accounts": [
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "bump",
          "type": "u8"
        }
      ]
    },
    {
      "name": "createTokenData",
      "accounts": [
        {
          "name": "tokenData",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "metadata",
          "type": {
            "defined": "Metadata"
          }
        },
        {
          "name": "bump",
          "type": "u8"
        }
      ]
    },
    {
      "name": "updateTokenData",
      "accounts": [
        {
          "name": "tokenData",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "metadata",
          "type": {
            "defined": "Metadata"
          }
        }
      ]
    },
    {
      "name": "stake",
      "accounts": [
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "stakedData",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenData",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "metadata",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "nftFrom",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "nftTo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "bump",
          "type": "u8"
        }
      ]
    },
    {
      "name": "unstake",
      "accounts": [
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "stakedData",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenData",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "metadata",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "nftFrom",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "nftTo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenFrom",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenTo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "createClaim",
      "accounts": [
        {
          "name": "claim",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "bump",
          "type": "u8"
        }
      ]
    },
    {
      "name": "prepareClaim",
      "accounts": [
        {
          "name": "claim",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "marineCount",
          "type": "u8"
        }
      ]
    },
    {
      "name": "claim",
      "accounts": [
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "stakedData",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenData",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "feeOwner",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "claim",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "metadata",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenFrom",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenTo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "feeTokenTo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "claimBounty",
      "accounts": [
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "stakedData",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenData",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "feeOwner",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pirateMetadata",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "marineMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "marineMetadata",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "marineToken",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenFrom",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenTo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "feeTokenTo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "updateReward",
      "accounts": [
        {
          "name": "stakedData",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenData",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "multiplier",
          "type": "u8"
        },
        {
          "name": "hasAffected",
          "type": "u8"
        }
      ]
    },
    {
      "name": "closePool",
      "accounts": [
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        }
      ],
      "args": []
    },
    {
      "name": "closePoolForce",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "retrieveNft",
      "accounts": [
        {
          "name": "admin",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "stakedData",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenData",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "nftFrom",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "nftTo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenFrom",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenTo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "rewardMethod",
          "type": "u32"
        }
      ]
    },
    {
      "name": "retrieveReward",
      "accounts": [
        {
          "name": "vault",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenFrom",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenTo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amountHigh",
          "type": "u32"
        },
        {
          "name": "amountLow",
          "type": "u32"
        }
      ]
    },
    {
      "name": "updateStakedData",
      "accounts": [
        {
          "name": "stakedData",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "rewardList",
          "type": {
            "vec": {
              "defined": "RewardInfo"
            }
          }
        },
        {
          "name": "bountyList",
          "type": {
            "vec": {
              "defined": "RewardInfo"
            }
          }
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "vault",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "stakedAmount",
            "type": "u32"
          },
          {
            "name": "claimedRewardAmount",
            "type": "u64"
          },
          {
            "name": "claimedBountyAmount",
            "type": "u64"
          },
          {
            "name": "bumpVault",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "pool",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "user",
            "type": "publicKey"
          },
          {
            "name": "stakedAmount",
            "type": "u32"
          },
          {
            "name": "claimedRewardAmount",
            "type": "u64"
          },
          {
            "name": "lastStakedTime",
            "type": "u32"
          },
          {
            "name": "lastUnstakedTime",
            "type": "u32"
          },
          {
            "name": "lastClaimedRewardTime",
            "type": "u32"
          },
          {
            "name": "metadataList",
            "type": {
              "vec": {
                "defined": "Metadata"
              }
            }
          },
          {
            "name": "bumpPool",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "tokenData",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "lastStakedUser",
            "type": "publicKey"
          },
          {
            "name": "mint",
            "type": "publicKey"
          },
          {
            "name": "metadata",
            "type": {
              "defined": "Metadata"
            }
          },
          {
            "name": "bounty",
            "type": "u64"
          },
          {
            "name": "claimedBountyAmount",
            "type": "u64"
          },
          {
            "name": "claimedRewardAmount",
            "type": "u64"
          },
          {
            "name": "lastStakedTime",
            "type": "u32"
          },
          {
            "name": "lastUnstakedTime",
            "type": "u32"
          },
          {
            "name": "lastClaimedRewardTime",
            "type": "u32"
          },
          {
            "name": "lastClaimedBountyTime",
            "type": "u32"
          },
          {
            "name": "isStaked",
            "type": "bool"
          },
          {
            "name": "bumpTokenData",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "stakedData",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "currentUser",
            "type": "publicKey"
          },
          {
            "name": "mint",
            "type": "publicKey"
          },
          {
            "name": "rewardList",
            "type": {
              "vec": {
                "defined": "RewardInfo"
              }
            }
          },
          {
            "name": "bountyList",
            "type": {
              "vec": {
                "defined": "RewardInfo"
              }
            }
          },
          {
            "name": "bumpStakedData",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "claim",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "marineCount",
            "type": "u8"
          },
          {
            "name": "chance",
            "type": "u8"
          },
          {
            "name": "user",
            "type": "publicKey"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "Metadata",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "u32"
          },
          {
            "name": "job",
            "type": "u32"
          },
          {
            "name": "body",
            "type": "u32"
          },
          {
            "name": "clothes",
            "type": "u32"
          },
          {
            "name": "crew",
            "type": "u32"
          },
          {
            "name": "face",
            "type": "u32"
          },
          {
            "name": "head",
            "type": "u32"
          },
          {
            "name": "earring",
            "type": "u32"
          },
          {
            "name": "ducks",
            "type": "u32"
          },
          {
            "name": "special",
            "type": "u32"
          }
        ]
      }
    },
    {
      "name": "RewardInfo",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "time",
            "type": "u32"
          },
          {
            "name": "reward",
            "type": "u64"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "InvalidUser",
      "msg": "Invalid user!"
    },
    {
      "code": 6001,
      "name": "InvalidToken",
      "msg": "Invalid token!"
    },
    {
      "code": 6002,
      "name": "NotFoundMetadata",
      "msg": "Not found metadata!"
    },
    {
      "code": 6003,
      "name": "StakedUnAllowed",
      "msg": "Staked unallowed!"
    },
    {
      "code": 6004,
      "name": "StakedNftsRemaining",
      "msg": "Staked Nfts Remaining!"
    },
    {
      "code": 6005,
      "name": "EmptyMetadataList",
      "msg": "MetadataList is empty!"
    },
    {
      "code": 6006,
      "name": "InvalidNft",
      "msg": "Invalid Nft"
    }
  ]
};
