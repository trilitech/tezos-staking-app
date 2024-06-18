# Tezos Staking app

## Introduction
This app helps you to perform stake,unstake, finalize operations introduced in paris protocol of Tezos.

## Usage
### Website: 
[stake.tezos.com](stake.tezos.com) (mainnet) <br>
[stake-ghostnet.tezos.com](stake-ghostnet.tezos.com) (ghostnet)

### Steps:
1. Connect your wallet. <br>
   Most of the wallets are supported for connection like kukai, umami, temple and other beacon supported wallets.<br>
   :heavy_check_mark: Tested with Umami v2.3.0 and Kukai on 18 Jun 2024 for stake,unstake and finalize operations. 
<br>Other wallets will add support for these operations gradually.
2. Choose baker and delegate your tez. 
3. Stake your tez.
4. Unstake your tez tokens whenever you want.
5. Wait for 4 cycles (5 for ghostnet) and finalize your unstaked tez.
6. Change baker or end delegation whenever you want.

## Features

- [x] Support connecting with beacon 
- [x] Support all Tezos Paris protocol operations (stake, unstake, finalize)
- [ ] Show detailed information about bakers ( Who accepts staking, staking fees, rewards history etc.)
- [ ] Show slashing history of bakers
- [ ] Show staking rewards for your account
- [ ] Show delegation rewards for your account
- [ ] Show slashed rewards for your account

## Development
1. Clone the repository. 
2. Install yarn. 
3. Rename .env-mainnet(or .env-ghostnet) to .env
4. Run the following commands:
```bash

$ yarn install
$ yarn run dev

```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Learn More

To learn more about staking and tezos protocol visit [Tezos Documentation](tezos.gitlab.io)

## Support
Create an issue in the repository for any queries or support.

## Contribution
Create a pull request for any new feature or bug fix.

## License
MIT

See the LICENSE.txt for license and copyright information.
Copyright (c) 2024 Trilitech Limited. 
```