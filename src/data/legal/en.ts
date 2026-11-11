import type { LegalCopy } from '@/interfaces/legal';

/** English legal texts (privacy and terms), for the new site (entry, terminal, transmitter and profile). */
export const LEGAL_EN: LegalCopy = {
  labels: {
    back: 'Back to home',
    updatedLabel: 'Updated',
    operator: 'Operator',
    legalName: 'Legal name',
    cuil: 'CUIL',
    brand: 'Brand',
    website: 'Website',
    email: 'Email',
    whatsapp: 'WhatsApp',
    legalNav: 'Legal',
    privacy: 'Privacy',
    terms: 'Terms',
    rights: '© 2026 decode9 · Jorge Bastidas. All rights reserved.',
    otherLanguage: 'Español',
  },
  updated: '11 November 2026',
  privacy: {
    kicker: 'Legal · 01',
    title: 'Privacy',
    metaTitle: 'Privacy — decode9',
    metaDescription:
      'Who operates decode9.codes (Jorge Bastidas Araujo, CUIL 20964746193), what your browser stores, and what happens to what you send from the terminal or profile.',
    lead: 'decode9.codes is operated by Jorge Bastidas Araujo, CUIL 20964746193. This page says what stays on your device, what you send when you use a form, who else receives data, and how to ask for it to be deleted.',
    sections: [
      {
        heading: 'The person responsible',
        paragraphs: [
          'The operator of this website is Jorge Bastidas Araujo, a natural person based in Argentina, working under the brand decode9. The public tax id is CUIL 20964746193. The site is published at https://decode9.codes.',
          'Privacy questions go to decode9.dev@gmail.com or WhatsApp +1 (786) 531-8494. Those are the only contact channels. This site does not publish a separate postal address.',
        ],
      },
      {
        heading: 'What this covers',
        paragraphs: [
          'This notice covers the public website decode9.codes: the entry page, the decode9 terminal (/decode9/), the mobile transmitter (/decode9/movil/), the professional profile (/perfil/) and these legal pages.',
          'It does not cover the sites it links to, such as GitHub, LinkedIn, theempire.tech, the websites of the projects in the profile, the news sources or social networks. Those services have their own terms.',
        ],
      },
      {
        heading: 'What you can send',
        paragraphs: [
          'The site has no accounts and no payments. You can browse it without identifying yourself.',
          'Signal: the terminal and the transmitter have a form to write to Jorge. It asks for an alias (required), an email address or a WhatsApp number (at least one of the two), an optional message and the topics you tick. It also sends the page language and whether you are writing from the terminal or from the transmitter.',
          'Walkie: the profile has a walkie to leave a free-text message. If you write an email address or a phone number in that text, the service detects it and stores it separately so it can reply to you. It also sends the page language.',
          'Only what you write is sent, and only when you press send. If you write by email or WhatsApp, that message is handled by your email or WhatsApp provider, and by Jorge.',
        ],
      },
      {
        heading: 'Where what you send is stored',
        paragraphs: [
          'The forms are sent to decode9-api, a service of the site itself that runs on Cloudflare Workers. Each signal or message is stored in a Cloudflare D1 database with the date and time it was sent. Each signal also gets a reference code (for example SOS-1234).',
          'There is no automatic deletion today: signals and messages are kept until they are deleted by hand. You can ask for what you sent to be deleted by writing to decode9.dev@gmail.com.',
        ],
      },
      {
        heading: 'Sending limit and anonymous fingerprint',
        paragraphs: [
          'To limit abuse, each form accepts at most 5 submissions every 10 minutes from the same connection. To count them, the service computes an anonymous fingerprint of your IP address: a SHA-256 hash of the IP together with a secret salt, cut to 16 characters. The IP address itself is not stored.',
          'The fingerprint is stored with each signal or message and in a submission counter. Counter rows are deleted once they fall outside the 10-minute window, when a new submission arrives.',
        ],
      },
      {
        heading: 'Email notice',
        paragraphs: [
          'The service can notify Jorge by email of each new signal or message, with its content, through Resend, an email delivery service. That notice is not active today. If it is turned on, Resend will process the content of the notice as the processor of that delivery.',
        ],
      },
      {
        heading: 'What stays on your device',
        paragraphs: [
          'The site does not set cookies of its own. It keeps a few preferences in your browser’s localStorage:',
          'd9crt-lang (terminal language), d9crt-fx (CRT screen effect on or off) and d9crt-mute (terminal sound); d9m-mute (transmitter sound); and tf-sound (ambient sound of the profile). None of these keys stores what you write in the forms.',
          'When the terminal opens, the site deletes the old d9crt-user key if it exists. Clearing the site data for decode9.codes in your browser removes all of these entries.',
        ],
      },
      {
        heading: 'Measurement and ads',
        paragraphs: [
          'The site loads Google Analytics (GA4), measurement ID G-VMLFSX6GXW, to learn which parts are used. Besides page visits, it records a few events: which side you choose on the entry page, which post you open, whether a signal or walkie submission went through or not, and the jump to decode9 from the profile. Google Analytics never receives the text you write, nor your alias, email or number. Google may set its own cookies for this measurement, under its policies.',
          'The site declares a Google AdSense account, publisher ca-pub-1675722214703683, in a tag on the page and in /ads.txt. Today the site does not load Google’s ad code. If that changes, this page will be updated.',
        ],
      },
      {
        heading: 'External content and links',
        paragraphs: [
          'The fonts are bundled with the site when it is published, so your browser does not request them from Google Fonts.',
          'The news ticker in the profile shows public headlines from php.net, CoinDesk, Hacker News, Ars Technica and TechCrunch. Those sources are queried by the server (decode9-api), not by your browser. If that service does not respond, your browser requests the Hacker News front page directly from hn.algolia.com, which then receives the normal technical data of any web request, such as your IP address.',
          'The share buttons open X, Facebook, LinkedIn, WhatsApp or Telegram with the link to the post, and the profile links to the websites of its projects, to GitHub, to LinkedIn and to theempire.tech. Those services only receive data if you open the link. Copying a link or using your phone’s share menu happens on your device.',
        ],
      },
      {
        heading: 'Features of your device',
        paragraphs: [
          'Sound is generated in your browser with Web Audio. The transmitter can read texts aloud with the browser’s speech synthesis and use the phone’s vibration. The entry page and the transmitter can use the gyroscope to react to how you tilt the phone; on iOS, the browser asks for your permission first.',
          'All of this happens only on your device. The site does not send any sound, voice, vibration or gyroscope data to any server.',
        ],
      },
      {
        heading: 'Who else receives data',
        paragraphs: [
          'Jorge Bastidas Araujo receives the signals and walkie messages, and the messages you send to the email and WhatsApp above.',
          'Cloudflare hosts the decode9-api service and its database, and therefore processes what you send through the forms.',
          'Google receives the measurement data described above. Resend would receive the content of the email notices if those notices are turned on.',
          'This site does not sell personal information.',
        ],
      },
      {
        heading: 'Your choices',
        paragraphs: [
          'You can browse the site without using the forms, block cookies in your browser, clear the site data and use a private window. You can ask for access to the information Jorge holds about you, or for its deletion, by writing to decode9.dev@gmail.com.',
          'The site is a professional portfolio. It is not directed to children.',
        ],
      },
      {
        heading: 'Changes',
        paragraphs: [
          'The current version of this notice is dated 11 November 2026. The page you are reading is the version in force.',
        ],
      },
    ],
  },
  terms: {
    kicker: 'Legal · 02',
    title: 'Terms',
    metaTitle: 'Terms — decode9',
    metaDescription:
      'Terms of use of decode9.codes (entry, decode9 terminal, transmitter and profile), operated by Jorge Bastidas Araujo, CUIL 20964746193.',
    lead: 'These terms cover the use of decode9.codes, operated by Jorge Bastidas Araujo, CUIL 20964746193. Using the site does not create an engineering engagement.',
    sections: [
      {
        heading: 'Who offers the site',
        paragraphs: [
          'decode9.codes is offered by Jorge Bastidas Araujo, CUIL 20964746193, based in Argentina, under the brand decode9. Contact is decode9.dev@gmail.com and WhatsApp +1 (786) 531-8494.',
        ],
      },
      {
        heading: 'What the site is',
        paragraphs: [
          'The site is a portfolio in four parts: the entry page, where you choose a side; the decode9 terminal, with the manifesto, the file, the lab, the codex and the posts; the mobile transmitter, with contact, videos, readings and audio; and Jorge’s professional profile, with his career, his projects, a news ticker and the walkie.',
          'None of this is legal, financial or employment advice, nor an offer to buy a product on the page.',
        ],
      },
      {
        heading: 'How to use it',
        paragraphs: [
          'You can browse the site and share links. Do not claim a relationship with decode9 that does not exist, do not copy the site to present it as your own, and do not use the forms to send spam, unlawful content or automated submissions. The forms have a sending limit to prevent abuse.',
        ],
      },
      {
        heading: 'Working together',
        paragraphs: [
          'Sending a signal from the terminal or the transmitter, leaving a message on the profile’s walkie, or writing by email or WhatsApp opens a conversation. It does not hire Jorge and does not set a price. Scope, fee and timeline are agreed in writing before work starts.',
        ],
      },
      {
        heading: 'Intellectual property',
        paragraphs: [
          'The decode9 name, the brand, the texts, the illustrations and the code of the site belong to Jorge Bastidas Araujo, except where a case names a client. Client and project names and marks remain their owners’. The cases describe work; they do not transfer anyone’s brand.',
          'The headlines in the news ticker belong to their sources and link to the original story.',
        ],
      },
      {
        heading: 'Other services',
        paragraphs: [
          'Links to GitHub, LinkedIn, theempire.tech, the project websites, the news sources, and the share buttons for X, Facebook, LinkedIn, WhatsApp and Telegram leave this site. From there, their terms apply.',
        ],
      },
      {
        heading: 'Advertising',
        paragraphs: [
          'The site declares a Google AdSense account, publisher ca-pub-1675722214703683. The authorized sellers file is at /ads.txt. Today the site does not show ads.',
        ],
      },
      {
        heading: 'No warranty',
        paragraphs: [
          'The site is offered as a portfolio. Its parts, its content, the news ticker and the forms may change or go offline. To the extent the law allows, Jorge Bastidas Araujo is not liable for decisions you make based on the content, nor for outages of third-party services.',
          'Nothing here waives rights that Argentine law, or the mandatory law of the place where you live, does not allow to be waived.',
        ],
      },
      {
        heading: 'Disputes',
        paragraphs: [
          'Write first to decode9.dev@gmail.com. The site is operated from Argentina by Jorge Bastidas Araujo. If a dispute needs a court, the intended forum is the courts of Argentina, without removing the mandatory protections that apply where you live.',
        ],
      },
      {
        heading: 'Changes',
        paragraphs: [
          'The current version of these terms is dated 11 November 2026. Continuing to use the site after a change to this page means you use it under the updated terms.',
        ],
      },
    ],
  },
};
