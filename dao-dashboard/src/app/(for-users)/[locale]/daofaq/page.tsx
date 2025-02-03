'use client'

import { useEffect, useState } from 'react'
import { PagePropsWithLocale, Dictionary } from '~/i18n/types'
import { getDict } from '~/i18n/get-dict'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '~/components/ui/accordion'

export default function ForFAQPage({
  params: { locale, ...params },
}: PagePropsWithLocale<{}>) {
  const [dict, setDict] = useState<Dictionary | null>(null)

  useEffect(() => {
    const fetchDict = async () => {
      try {
        const fetchedDict = await getDict(locale)
        setDict(fetchedDict)
      } catch (error) {
        console.error('Error fetching dictionary:', error)
      }
    }
    fetchDict()
  }, [locale])

  const faq = dict?.daofaq ?? {}

  return (
    <div className="flex flex-row w-full items-center justify-center content-center">
      <div className="flex flex-col w-full items-center justify-center max-xl:mx-10 mx-80 max-xl:my-4 my-20">
        <h2 className="text-2xl font-bold tracking-tight my-6">
          {faq.title ?? ''}
        </h2>

        <Accordion type="single" collapsible className="w-full gap-4">
          <AccordionItem value="item-1">
            <AccordionTrigger>{faq.q1 ?? ''}</AccordionTrigger>
            <AccordionContent>
              After clicking "Create a DAO", you will first specify some basic
              parameters like DAO Name, DAO Description and DAO Logo and Some
              social links like Twitter, LinkedIn, Telegram, etc.
              <img src="/images/daofaq/dao_settings.png" alt="DAO Settings" />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger>{faq.q2 ?? ''}</AccordionTrigger>
            <AccordionContent>
              <p>
                After you specify the basic DAO Params, you should specify
                community token and voting parameters like DAO Quorum, Proposal
                Threshold, etc.
              </p>

              <img
                src="/images/daofaq/dao_settings_votes.png"
                alt="DAO Settings"
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger>{faq.q3 ?? ''}</AccordionTrigger>
            <AccordionContent>
              <p>
                You can find DAOs by clicking on the "DAOs" tab in the DAO
                Stduio.
              </p>

              <img src="/images/daofaq/daos.png" alt="DAOs" />
            </AccordionContent>{' '}
          </AccordionItem>

          <AccordionItem value="item-4">
            <AccordionTrigger>{faq.q4 ?? ''}</AccordionTrigger>
            <AccordionContent>
              <p>
                You can find proposals by clicking on the DAO Name in the DAO
                list. You can also create new proposals by clicking on the
                "Create New" button.
              </p>

              <img src="/images/daofaq/proposals.png" alt="Proposals" />
            </AccordionContent>{' '}
          </AccordionItem>

          <AccordionItem value="item-5">
            <AccordionTrigger>{faq.q5 ?? ''}</AccordionTrigger>
            <AccordionContent>
              <p>
                Members can delegate governance tokens to any member of their
                DAO. It lets them transfer decision-making power to other DAO
                members.
              </p>

              <img src="/images/daofaq/delegate.png" alt="Delegate" />
            </AccordionContent>{' '}
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  )
}
