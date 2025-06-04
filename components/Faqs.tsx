'use client'

import { Box, Heading, Text, Flex, Button, Accordion } from '@chakra-ui/react'
import { Header } from './Header'
import React from 'react'
import Link from 'next/link'

export default function Faqs() {
  const paragraphs = [
    { title: 'Getting Started', id: 'getting-started' },
    { title: 'Bakers & Delegation', id: 'delegating' },
    { title: 'Staking', id: 'staking' },
    { title: 'Rewards', id: 'rewards' }
  ]

  const faqs = [
    {
      title: 'Introduction',
      id: 'introduction',
      faqs: [
        {
          title: 'What is staking?',
          description:
            'Staking was introduced on Tezos for the first time in June 2024, enabling individual holders of tez (ticker: XTZ) to help secure the network without having to run a node (or the software that creates blocks). By staking your tez with a baker, you help them contribute to network security; in exchange for your participation, you earn rewards.'
        },
        {
          title: 'I thought I was staking long before June 2024?',
          description:
            'Before June 2024, you could delegate to a baker, but not stake with them. Delegation has sometimes been loosely referred to as staking, but is a different mechanism; delegated tez remains liquid and earns half the rewards of staking, whereas staked tez is locked and earns twice the rewards of delegation.'
        },
        {
          title: 'What is stake.tezos.com?',
          description:
            'stake.tezos.com is a website developed by builders within the Tezos ecosystem that allows you to easily stake your tez. While certain wallets allow you to stake your tez from within the application, stake.tezos.com enables you to manage your staked tez with your preferred Tezos wallet. <br /><br /> You can open up the dashboard view by connecting your wallet.'
        },
        {
          title: 'Why should I stake my tez?',
          description:
            'By staking your tez with a baker, you help them manage the security of the Tezos network – and in doing so, you earn rewards. Staking can potentially offer twice the rewards of delegation (see the “Delegation” section below).'
        },
        {
          title: 'If I stake, can I unstake?',
          description: `You can unstake your tez at any time. All you have to do is click the “Unstake” button on the dashboard, which immediately halts rewards from accruing, wait ${process.env.NEXT_PUBLIC_UNSTAKE_DAYS} days (or 4 “cycles”), and then complete the process by clicking on the “Finalize” button. Once that’s done, your funds become available again.`
        },
        {
          title: 'Where can I learn more about the Tezos ecosystem?',
          description:
            'You can discover more about the Tezos ecosystem on the <a href="https://tezos.com/" target="_blank" rel="noopener noreferrer">Tezos website</a> and the <a href="https://spotlight.tezos.com/" target="_blank" rel="noopener noreferrer">Tezos blog</a>.'
        },
        {
          title: 'Where can I learn more about the Tezos protocol?',
          description:
            'You can learn more about the technical and economic aspects of the Tezos protocol on our <a href="https://docs.tezos.com/" target="_blank" rel="noopener noreferrer">developer documentation</a>, <a href="https://opentezos.com/" target="_blank" rel="noopener noreferrer">Open Tezos</a> and our <a href="https://octez.tezos.com/docs/" target="_blank" rel="noopener noreferrer">protocol documentation</a>.'
        }
      ]
    },
    {
      title: 'Getting Started',
      id: 'getting-started',
      faqs: [
        {
          title: 'What do I need to start staking on Tezos?',
          description:
            'All you need is a wallet with tez in it! There is no minimum requirement, meaning you can stake any amount.'
        },
        {
          title: 'How long does it take to stake?',
          description:
            'Staking takes effect immediately. When you stake your tez, your funds are locked and rewards begin to automatically accrue.'
        },
        {
          title: 'How do I get tez?',
          description:
            'You can purchase tez on most major cryptocurrency exchanges like Coinbase, Binance, or Kraken. These can then be transferred to your Tezos wallet.'
        },
        {
          title: 'How do I connect my wallet to stake.tezos.com?',
          description:
            'Simply click on the “Connect Wallet” button and choose your preferred wallet. Once your wallet is connected, you will see a dashboard. This is where you can stake and unstake your tez, as well as choose and change bakers.'
        },
        {
          title: 'Are there any fees?',
          description:
            'Actions like staking and unstaking are transactions that take place on the Tezos network. They therefore require a small fee, which usually amounts to less than $0.01. While the fees are extremely low, don’t forget to keep some extra tez in your wallet for transactions! <br /><br /> There is also a baker’s split when you delegate and stake with them, which you can view in the dashboard under “Baker information”. Each baker sets their own split, so do take that into consideration when selecting your baker.'
        }
      ]
    },
    {
      title: 'Bakers & Delegation',
      id: 'delegating',
      faqs: [
        {
          title: 'Why do I need to delegate my tez first?',
          description:
            'Staking on Tezos requires that you delegate your tez first. <br /><br /> When you delegate, you assign your tez to a baker (or a validator), who helps secure the network by verifying transactions and adding them to the blockchain. In return, you receive a share of the rewards while still being able to use your delegated tez. Your tez therefore remains liquid. <br /><br /> You can delegate your tez by connecting your wallet and selecting a baker on the dashboard.'
        },
        {
          title: 'What is a baker and how do I choose one?',
          description:
            'In the Tezos ecosystem, validators are called bakers. They keep the blockchain running by confirming transactions and proposing blocks. <br /><br /> You need to choose a baker for delegation and staking. Once you’ve connected your wallet, you will see a list of bakers in your dashboard. When choosing a baker, consider their fees, reliability (uptime), and community reputation. <br /><br /> You can find these stats on Tezos block explorers like <a href="https://tzkt.io" target="_blank" rel="noopener noreferrer">tzkt.io</a> or on dedicated sites like <a href="https://baking-bad.org" target="_blank" rel="noopener noreferrer">Baking Bad</a> or <a href="https://staking.tezos.com" target="_blank" rel="noopener noreferrer">Staking Assistant</a>.'
        },
        {
          title: 'Can I change my baker after delegating my tez?',
          description:
            'You can change your baker at any time. All you have to do is choose another baker in the dashboard and click on them to delegate. Note that this may take 3 days (3 “cycles”) for the change to take effect; until then, you will continue to earn rewards with your original baker.'
        }
      ]
    },
    {
      title: 'Staking',
      id: 'staking',
      faqs: [
        {
          title: 'How does staking differ from delegation?',
          description:
            'Delegation and staking are both ways for individual tez holders to participate in the Tezos network and earn rewards without having to run a node. However, there are some key differences. <br /><br /> With delegation, your tez remains liquid, meaning you are able to move or spend them at any time (although this may impact your rewards). Delegation rewards, which are approximately one-third of staking rewards, are allocated by your baker, making baker selection extremely important. <br /><br /> With staking, your tez is locked and exposed to slashing risks. Because staked funds are actually at stake, staking rewards are approximately double delegation rewards and accrue automatically.'
        },
        {
          title: 'What happens if a baker is slashed?',
          description:
            'Slashing occurs when a baker is penalized for misbehavior. If you stake your tez with a baker that is slashed, then your staked tez will also be slashed. Note that slashing events are exceptionally rare on Tezos, and a loss of your entire capital is extremely unlikely. <br /><br /> Nonetheless, it is important to understand the potential risks, however low they may be.'
        },
        {
          title: 'Is there a lock-up period when staking?',
          description:
            'Yes. Staked tez are immediately locked, meaning they become illiquid. They remain locked until they are unstaked.'
        },
        {
          title: 'Can I split my tez between staking and delegation?',
          description:
            'Yes. You can stake however much of your delegated tez as you would like. Note that staking your tez requires that you delegate it first. Don’t forget to leave a little tez left over for fees!'
        },
        {
          title: 'Can I change my baker after staking my tez?',
          description: `If you want to change your baker, you will need to unstake your funds with your original baker first. When the unstaking process completes after ${process.env.NEXT_PUBLIC_UNSTAKE_DAYS} days (4 “cycles”), you can stake your newly available funds with the new baker.`
        }
      ]
    },
    {
      title: 'Rewards',
      id: 'rewards',
      faqs: [
        {
          title: 'How are staking rewards calculated?',
          description:
            'The amount of staking rewards you receive depends on the rewards rate, the baker’s performance, and the baker’s fee, which you can find under “Baker information” in the dashboard. Staking rewards also compound, as they are paid out to the account you stake from, automatically becoming a part of your stake.'
        },
        {
          title: 'Can I lose staking rewards?',
          description:
            'You may lose staking rewards if your baker misbehaves; you may also lose staking rewards if your baker doesn’t participate sufficiently in network consensus. This is why it is important to consider reliability and reputation when selecting a baker. <br /><br /> You can read more about bakers and baker selection <a href="https://spotlight.tezos.com/how-to-stake-on-tezos/" target="_blank" rel="noopener noreferrer">here</a>.'
        },
        {
          title: 'How do staking rewards accrue?',
          description: 'Staking rewards accrue every cycle, which lasts 1 day.'
        },
        {
          title: 'Do I need to claim my staking rewards?',
          description:
            'No. Staking rewards automatically accrue in your wallet. You do not need to manually claim them.'
        }
      ]
    }
  ]

  return (
    <Flex flexDir='column' w='full'>
      <Header />

      <Flex
        borderRadius={[0, null, null, '4px']}
        bg='transparent'
        mt={[null, null, null, '24px']}
        overflow='hidden'
        justifyContent='center'
        maxW='1232px'
        w='100%'
        mx='auto'
      >
        <Flex flexDir='column' color='white' py='48px' w='660px'>
          <Heading
            fontSize={['30px', null, '60px']}
            fontFamily='Inter, sans-serif'
            pb={['16px', null, '24px']}
            w='100%'
            textAlign='center'
          >
            Staking FAQ
          </Heading>
          <Text
            pb={['30px', null, '40px']}
            fontSize={['md', null, 'xl']}
            w='100%'
            textAlign='center'
          >
            Find answers to your staking questions
          </Text>
          <Flex
            pb={['40px', null, '120px']}
            justifyContent='center'
            flexWrap='wrap'
            gap='12px'
          >
            {paragraphs.map(paragraph => (
              <Button
                variant='ternary'
                border='1px solid'
                borderColor='gray.200'
                py='6px'
                px='12px'
                fontSize='xs'
                height='30px'
                key={paragraph.id}
                asChild
              >
                <Link href={'#' + paragraph.id}>{paragraph.title}</Link>
              </Button>
            ))}
          </Flex>
          {faqs?.map((faq, index) => (
            <React.Fragment key={faq.id}>
              <Text
                id={faq.id}
                py={['20px', null, '30px']}
                fontSize={['24px', null, '36px']}
                w='100%'
                textAlign='center'
                fontWeight='semibold'
              >
                {faq.title}
              </Text>
              <Accordion.Root pt='30px'>
                {faq.faqs.map(data => (
                  <Accordion.Item
                    key={data.title}
                    py='20px'
                    borderTopWidth='1px'
                    borderColor='gray.500'
                    borderBottom={0}
                    value={data.title}
                  >
                    <Accordion.ItemTrigger
                      _hover={{ backgroundColor: 'transparent' }}
                      pl={0}
                      alignItems='center'
                      py={0}
                    >
                      <Box flex='1' textAlign='left'>
                        <Text
                          color='white.800'
                          fontSize={['lg', null, 'xl']}
                          fontWeight='semibold'
                        >
                          {data.title}
                        </Text>
                      </Box>
                      <Accordion.ItemIndicator />
                    </Accordion.ItemTrigger>
                    <Accordion.ItemContent
                      pl={0}
                      pb='20px'
                      pt='15px'
                      color='white.600'
                      fontSize='md'
                    >
                      <Text
                        css={{ a: { textDecoration: 'underline' } }}
                        fontSize={['sm', null, 'md']}
                        dangerouslySetInnerHTML={{ __html: data.description }}
                      />
                    </Accordion.ItemContent>
                  </Accordion.Item>
                ))}
              </Accordion.Root>
            </React.Fragment>
          ))}
        </Flex>
      </Flex>
    </Flex>
  )
}
