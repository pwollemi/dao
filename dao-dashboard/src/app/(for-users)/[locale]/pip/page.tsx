'use client'

import Link from 'next/link'

import { PagePropsWithLocale, Dictionary } from '~/i18n/types'
import { getDict } from '~/i18n/get-dict'

import { useEffect, useState } from 'react'

export default function ForPendingPage({
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

  return (
    <div className="w-full gap-4 flex flex-col">
      <div className="gap-4 flex flex-col m-8">
        <h2 className="text-4xl font-bold tracking-tight mt-6 text-center">
          {'PEACE COIN IMPROVEMENT PROPOSAL'}
        </h2>
        <p>
          PEACE COIN Improvement Proposals (PIPs) describe standards for the
          PEACE COIN platform, including core protocol specifications, client
          APIs, and contract standards. Network upgrades are discussed
          separately in the{' '}
          <Link
            className="font-bold"
            target="_blank"
            href="https://github.com/peacecoin/pm/"
          >
            PEACE COIN Project Management
          </Link>{' '}
          repository.
        </p>

        <h2 className="text-3xl">Contributing</h2>
        <p>
          First review <Link href="PIPs/pip-1">PIP-1</Link>. Then clone the
          repository and add your PIP to it. There is a{' '}
          <Link
            className="font-bold"
            href="https://github.com/peacecoin/PIPs/blob/master/pip-template.md?plain=1"
          >
            template PIP here
          </Link>
          . Then submit a Pull Request to PEACE COIN's{' '}
          <Link href="https://github.com/peacecoin/PIPs">PIPs repository</Link>.
        </p>

        <h2 className="text-3xl">PIP status terms</h2>
        <ul className="ml-2">
          <li>
            <strong>Idea</strong> - An idea that is pre-draft. This is not
            tracked within the PIP Repository.
          </li>
          <li>
            <strong>Draft</strong> - The first formally tracked stage of an PIP
            in development. An PIP is merged by an PIP Editor into the PIP
            repository when properly formatted.
          </li>
          <li>
            <strong>Review</strong> - An PIP Author marks an PIP as ready for
            and requesting Peer Review.
          </li>
          <li>
            <strong>Last Call</strong> - This is the final review window for an
            PIP before moving to FINAL. An PIP editor will assign Last Call
            status and set a review end date (`last-call-deadline`), typically
            14 days later. If this period results in necessary normative changes
            it will revert the PIP to Review.
          </li>
          <li>
            <strong>Final</strong> - This PIP represents the final standard. A
            Final PIP exists in a state of finality and should only be updated
            to correct errata and add non-normative clarifications.
          </li>
          <li>
            <strong>Stagnant</strong> - Any PIP in Draft or Review if inactive
            for a period of 6 months or greater is moved to Stagnant. An PIP may
            be resurrected from this state by Authors or PIP Editors through
            moving it back to Draft.
          </li>
          <li>
            <strong>Withdrawn</strong> - The PIP Author(s) have withdrawn the
            proposed PIP. This state has finality and can no longer be
            resurrected using this PIP number. If the idea is pursued at later
            date it is considered a new proposal.
          </li>
          <li>
            <strong>Living</strong> - A special status for PIPs that are
            designed to be continually updated and not reach a state of
            finality. This includes most notably PIP-1.
          </li>
        </ul>

        <h2 className="text-3xl">PIP Types</h2>

        <p>
          PIPs are separated into a number of types, and each has its own list
          of PIPs.
        </p>

        <h4 className="text-3xl">Standard Track</h4>
        <p>
          Describes any change that affects most or all PEACE COIN
          implementations, such as a change to the network protocol, a change in
          block or transaction validity rules, proposed application
          standards/conventions, or any change or addition that affects the
          interoperability of applications using PEACE COIN. Furthermore
          Standard PIPs can be broken down into the following categories.
        </p>

        <h4 className="text-2xl">
          <Link href="/pip/core" className="font-bold">
            Core
          </Link>
        </h4>
        <p>
          Improvements requiring a consensus fork (e.g.{' '}
          <Link href="./PIPs/pip-5">PIP-5</Link>
          <Link href="./PIPs/pip-211">PIP-211</Link>
          ), as well as changes that are not necessarily consensus critical but
          may be relevant to “core dev” discussions (for example, the PoA
          algorithm for testnets described in
          <Link href="./PIPs/pip-225">PIP-225</Link>).
        </p>

        <h4 className="text-2xl">
          <Link className="font-bold" href="/pip/networking">
            Networking
          </Link>
        </h4>
        <p>
          Includes improvements around devp2p (
          <Link className="font-bold" href="./PIPs/pip-8">
            PIP-8
          </Link>
          ) and Light PEACE COIN Subprotocol, as well as proposed improvements
          to network protocol specifications of whisper and swarm.
        </p>

        <h4 className="text-2xl">
          <Link className="font-bold" href="/interface">
            Interface
          </Link>
        </h4>
        <p>
          Includes improvements around client API/RPC specifications and
          standards, and also certain language-level standards like method names
          (<Link href="./PIPs/pip-6">PIP-6</Link>) and contract ABIs. The label
          “interface” aligns with the interfaces repo and discussion should
          primarily occur in that repository before an PIP is submitted to the
          PIPs repository.
        </p>

        <h4 className="text-2xl">
          <Link href="/pip/prc" className="font-bold">
            PRC
          </Link>
        </h4>
        <p>
          Application-level standards and conventions, including contract
          standards such as token standards (
          <Link href="./PIPs/pip-20">PIP-20</Link>
          ), name registries (<Link href="./PIPs/pip-137">PIP-137</Link>), URI
          schemes (<Link href="./PIPs/pip-681">PIP-681</Link>), library/package
          formats (<Link href="./PIPs/pip-190">PIP-190</Link>), and account
          abstraction (<Link href="./PIPs/pip-4337">PIP-4337</Link>).
        </p>

        <h4 className="text-2xl">
          <Link href="/pip/meta" className="font-bold">
            Meta
          </Link>
        </h4>
        <p>
          Describes a process surrounding PEACE COIN or proposes a change to (or
          an event in) a process. Process PIPs are like Standards Track PIPs but
          apply to areas other than the PEACE COIN protocol itself. They may
          propose an implementation, but not to PEACE COIN's codebase; they
          often require community consensus; unlike Informational PIPs, they are
          more than recommendations, and users are typically not free to ignore
          them. Examples include procedures, guidelines, changes to the
          decision-making process, and changes to the tools or environment used
          in PEACE COIN development. Any meta-PIP is also considered a Process
          PIP.
        </p>

        <h4 className="text-2xl">
          <Link href="/pip/informational" className="font-bold">
            Informational
          </Link>
        </h4>
        <p>
          Describes a PEACE COIN design issue, or provides general guidelines or
          information to the PEACE COIN community, but does not propose a new
          feature. Informational PIPs do not necessarily represent PEACE COIN
          community consensus or a recommendation, so users and implementers are
          free to ignore Informational PIPs or follow their advice.
        </p>
      </div>
    </div>
  )
}
