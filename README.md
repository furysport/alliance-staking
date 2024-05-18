
# Furya Staking Frontend
## Installation

Clone alliance-staking

```bash
  git clone https://github.com/White-Fury-Defi-Platform/alliance-staking.git
  cd alliance-staking
  npm install
```

Run locally

```bash
  npm run dev
```


    
## How to add your Token for Restaking
    1. Add Token to assetlist of the chain registry on furya: https://github.com/cosmos/chain-registry/tree/master/furya

    2. Get Token approved: https://daodao.zone/dao/furya1pxuqr7je9h7slchdsgz5ufc3kklrevyfnxmq0dkjru5k6e6mdm2sw23hfz
    3. Fork this repo.

    4. Apply changes on the following files:
         components/Pages/AssetOverview.tsx Add token to Token enum line 16++

         util/getColorByTokenSymbol.ts Add color for Token Line 3++

         public/mainnet/all_white_listed_tokens.json Add Token with infos from registry Example RAC:

            {
                "chainId": "furya-1",
                "token_address": "factory/furya1eqntnl6tzcj9h86psg4y4h6hh05g2h9nj8e09l/urac",
                "symbol": "RAC",
                "name": "RAC",
                "decimals": 6,
                "logoURI": "https://raw.githubusercontent.com/cosmos/chain-registry/master/furya/images/rac.svg",
                "tags": ["native"],
                "denom": "factory/furya1eqntnl6tzcj9h86psg4y4h6hh05g2h9nj8e09l/urac",
                "native": true,
                "color": "#009076" // Color on Charts
            }

        public/mainnet/tokens.json Add Token with infos from registry (Used for Price calculation):

            {
                "name": "RAC",
                "symbol": "RAC",
                "contract": "furya1crsvm4qddplxhag29nd2zyw6k6jzh06hlcctya4ynfvuhhu3yt4q0pn4t3" // SWAP CONTRACT ADDRESS,
                "chainId": "furya-1",
                "basedOn": "Fury" // paired with this address, 
                "denom": "factory/furya1eqntnl6tzcj9h86psg4y4h6hh05g2h9nj8e09l/urac",
                "decimals": 6,
                "tabType": "restaking",
                "logoURI": "https://raw.githubusercontent.com/cosmos/chain-registry/master/furya/images/rac.svg"
            }

        public/mainnet/white_listed_ecosystem_token_info.json Add Token with infos from registry: 

            {
                "chainId": "furya-1",
                "token_address": "factory/furya1eqntnl6tzcj9h86psg4y4h6hh05g2h9nj8e09l/urac",
                "symbol": "RAC",
                "name": "RAC",
                "decimals": 6,
                "logoURI": "https://raw.githubusercontent.com/cosmos/chain-registry/master/furya/images/rac.svg",
                "tags": ["native"],
                "denom": "factory/furya1eqntnl6tzcj9h86psg4y4h6hh05g2h9nj8e09l/urac",
                "native": true,
                "color": "#009076"
            }

    5. Create pull request on this repo



## License

[MIT](https://choosealicense.com/licenses/mit/)

