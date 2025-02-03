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

  const faq = dict?.faq ?? {}

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
              <video width="1000" height="240" controls preload="auto">
                <source src="/images/faq/delegate.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger>{faq.q2 ?? ''}</AccordionTrigger>
            <AccordionContent>
              <video width="1000" height="240" controls preload="auto">
                <source src="/images/faq/propose.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger>{faq.q3 ?? ''}</AccordionTrigger>
            <AccordionContent>
              <video width="1000" height="240" controls preload="auto">
                <source src="/images/faq/voting.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </AccordionContent>{' '}
          </AccordionItem>

          <AccordionItem value="item-4">
            <AccordionTrigger>{faq.q4 ?? ''}</AccordionTrigger>
            <AccordionContent>
              <video width="1000" height="240" controls preload="auto">
                <source src="/images/faq/queue.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </AccordionContent>{' '}
          </AccordionItem>

          <AccordionItem value="item-5">
            <AccordionTrigger>{faq.q5 ?? ''}</AccordionTrigger>
            <AccordionContent>
              <video width="1000" height="240" controls preload="auto">
                <source src="/images/faq/execute.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </AccordionContent>{' '}
          </AccordionItem>

          <AccordionItem value="item-6">
            <AccordionTrigger>{faq.q6 ?? ''}</AccordionTrigger>
            <AccordionContent>
              <video width="1000" height="240" controls preload="auto">
                <source
                  src="/images/faq/add_contributor_bounty.mp4"
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
            </AccordionContent>{' '}
          </AccordionItem>

          <AccordionItem value="item-7">
            <AccordionTrigger>{faq.q7 ?? ''}</AccordionTrigger>
            <AccordionContent>
              <video width="1000" height="240" controls preload="auto">
                <source
                  src="/images/faq/claim_contributor_bounty.mp4"
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
            </AccordionContent>{' '}
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  )
}
