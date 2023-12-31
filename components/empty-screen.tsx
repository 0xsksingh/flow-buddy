import { UseChatHelpers } from 'ai/react'

import { Button } from '@/components/ui/button'
import { ExternalLink } from '@/components/external-link'
import { IconArrowRight } from '@/components/ui/icons'

const exampleMessages = [
  {
    heading: 'Create a Non-Fungible Token on Flow',
    message: `How to create a Non-Fungible Token on Flow ?`
  },
  {
    heading: 'How to get started on Flow ?',
    message: 'How to get started on Flow ? \n'
  },
  {
    heading: 'How to build a game on Flow ? ',
    message: `How to use Flow Unity SDK to build a game ? \n`
  }
]

export function EmptyScreen({ setInput }: Pick<UseChatHelpers, 'setInput'>) {
  return (
    <div className="mx-auto max-w-2xl px-4 ">
      <div className="rounded-lg border bg-background p-8">
        <h1 className="mb-2 text-lg font-semibold">
          🧑🏻‍💻Welcome to Flow-Buddy 😺!
        </h1>
        <p className="mb-2 leading-normal text-muted-foreground">
          Flow-Buddy is an open-source AI chatbot application developed using
          <ExternalLink href="https://nextjs.org">Next.js</ExternalLink> {' '}
          <ExternalLink href="https://vercel.com/storage/kv">
            Vercel KV
          </ExternalLink> and {' '}
          <ExternalLink href="http://kapa.ai/">
            Kapa.ai
          </ExternalLink>
          .
        </p>
        <p className="leading-normal text-muted-foreground">
          You can start a conversation here or try the following examples:
        </p>
        <div className="mt-4 flex flex-col items-start space-y-2">
          {exampleMessages.map((message, index) => (
            <Button
              key={index}
              variant="link"
              className="h-auto p-0 text-base"
              onClick={() => setInput(message.message)}
            >
              <IconArrowRight className="mr-2 text-muted-foreground" />
              {message.heading}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
