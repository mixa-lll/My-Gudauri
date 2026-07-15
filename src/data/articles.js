const image = (name) => `/assets/design-1/${name}`;

const SOURCES = {
  gudauri: {
    label: 'Georgia Travel — Gudauri resort guide',
    url: 'https://georgia.travel/resorts/gudauri'
  },
  winter: {
    label: 'Georgia Travel — Gudauri in winter',
    url: 'https://georgia.travel/gudauri-in-winter'
  },
  status: {
    label: 'Mountain Trails Agency — live Gudauri lift status',
    url: 'https://status.mta.ski/en/gudauri/gudauri'
  },
  kobiStatus: {
    label: 'Mountain Trails Agency — live Kobi lift status',
    url: 'https://status.mta.ski/en/gudauri/kobi'
  },
  mtaFaq: {
    label: 'Mountain Trails Agency — visitor FAQ',
    url: 'https://mta.ski/en/presscenter/FAQ_eng'
  },
  roads: {
    label: 'Roads Department of Georgia',
    url: 'https://www.georoad.ge/?lang=eng'
  },
  emergency: {
    label: 'Georgia Public Safety Command Center 112',
    url: 'https://mia.police.ge/en/lepl/lepl112'
  },
  cuisine: {
    label: 'Georgia Travel — Georgian cuisine',
    url: 'https://georgia.travel/georgian-cuisine'
  },
  khinkali: {
    label: 'Georgia Travel — khinkali',
    url: 'https://georgia.travel/khinkali'
  }
};

export const ARTICLES = [
  {
    slug: 'first-time-gudauri',
    category: 'First time',
    title: 'Your first week in Gudauri, planned simply',
    excerpt: 'Where to stay, when to ski and what to book before you arrive.',
    readTime: '8 min read',
    image: image('mosaic/tours-1-117-upd.png'),
    updated: 'Reviewed July 2026',
    lead: 'Gudauri is compact enough for an uncomplicated trip, but it is spread vertically along the Georgian Military Highway. Make three decisions early — your base, your transfer and the shape of your ski days — and leave the rest flexible for the weather.',
    sections: [
      {
        title: 'Choose a base by lift access',
        paragraphs: [
          'New Gudauri clusters apartments, restaurants, rentals and the GoodAura gondola in one walkable area. It suits first-time visitors who want to step outside and find most essentials nearby. Central and upper Gudauri are quieter and include a mix of established hotels, apartments and access points to other lifts.',
          'A property’s district name is less useful than its real route to the snow. Before booking, ask for the walking distance to the nearest operating lift, whether the route involves a steep road, and whether the accommodation offers a shuttle. “Ski-in/ski-out” should mean direct access in normal snow conditions, not simply a mountain view.'
        ]
      },
      {
        title: 'Build the week around the mountain',
        paragraphs: [
          'Gudauri sits at roughly 2,000–2,200 metres, while the lift system reaches 3,276 metres. The usual ski season runs from December into mid-April, but opening dates and terrain depend on snow, wind and visibility. January and February generally offer the most dependable winter coverage and the busiest holiday periods.',
          'Keep day one gentle: collect equipment, check the piste map and use familiar terrain. Add a lesson early in the week if anyone is learning. Reserve one weather-flexible day for Kobi, a scenic excursion, a rest afternoon or another guided activity rather than locking every day into a rigid plan.'
        ]
      },
      {
        title: 'Make arrival day deliberately easy',
        paragraphs: [
          'Gudauri is about 120 kilometres by road from Tbilisi. The drive commonly takes around two to two-and-a-half hours in ordinary conditions, but snow, traffic and road controls can extend it. A pre-arranged transfer is the simplest option with winter luggage or ski bags.',
          'Send the driver your flight number and accommodation pin, not only the property name. Keep a warm layer, water, medication and a phone charger in hand luggage. If you arrive late, confirm check-in and food options before leaving Tbilisi.'
        ]
      },
      {
        title: 'Book the scarce things first',
        paragraphs: [
          'Holiday accommodation, trusted instructors and airport transfers are the services most worth arranging in advance. Equipment rental is widely available, although families and guests needing uncommon sizes should reserve ahead. Restaurant opening hours and activity schedules change through the season, so reconfirm close to the date.',
          'Each morning, check the official lift status and weather before choosing a route. Carry the name and location of your accommodation offline, save Georgia’s emergency number 112, and allow the mountain — rather than the original itinerary — to set the pace.'
        ]
      }
    ],
    note: 'A sensible seven-day rhythm is arrival and fitting, three or four ski days, one flexible weather day and one slower local day. Conditions may rearrange that order.',
    sources: [SOURCES.gudauri, SOURCES.winter, SOURCES.status, SOURCES.emergency]
  },
  {
    slug: 'snow-road-guide',
    category: 'Transport',
    title: 'The winter road to Gudauri',
    excerpt: 'Airport choices, transfer times and what changes when the pass is busy.',
    readTime: '6 min read',
    image: image('mosaic/transfer-1-144.png'),
    updated: 'Reviewed July 2026',
    lead: 'Gudauri’s accessibility is one of its strengths: it is approximately 120 kilometres from Tbilisi on the historic Georgian Military Highway. In winter, however, distance is only half the story — snowfall, visibility and traffic controls determine the real journey time.',
    sections: [
      {
        title: 'Tbilisi is the practical gateway',
        paragraphs: [
          'For most visitors, Tbilisi International Airport is the simplest arrival point. In ordinary conditions the drive takes about two to two-and-a-half hours. Kutaisi can work when flights are substantially better, but the onward road is much longer and makes a late winter arrival less comfortable.',
          'A private car or minivan gives you door-to-door travel and space for equipment. Shared transport can reduce the cost but normally involves a fixed departure point and less flexibility for delayed flights. Confirm luggage capacity before paying, especially if several guests carry ski or snowboard bags.'
        ]
      },
      {
        title: 'Understand where restrictions happen',
        paragraphs: [
          'The main route climbs from Tbilisi through Mtskheta, the Zhinvali area and Pasanauri before reaching Gudauri. The high Gudauri–Kobi section continues north toward Stepantsminda and can be subject to separate restrictions. A closure north of Gudauri does not automatically mean that the approach from Tbilisi is closed, but only the Roads Department or police should be treated as authoritative.',
          'Winter controls may require suitable tyres or anti-skid chains, restrict trailers and heavy vehicles, or temporarily stop traffic while crews clear snow. Do not ask a driver to ignore a closure or join an unofficial detour.'
        ]
      },
      {
        title: 'Plan for delay without stress',
        paragraphs: [
          'Avoid scheduling a fixed lesson or expensive activity immediately after your expected arrival. Share the flight number with the transfer company, keep the driver’s contact offline and tell the accommodation if the road delays check-in.',
          'Carry water, a snack, essential medication and a charged power bank in the cabin rather than buried in luggage. Children should have an accessible warm layer. Travel insurance should be checked for weather disruption and missed connections before the trip, not after the road closes.'
        ]
      },
      {
        title: 'Check the right source on travel day',
        paragraphs: [
          'Weather apps describe conditions; they do not authorize traffic. Check the Roads Department of Georgia for the official traffic regime and ask your licensed transfer provider to confirm the current approach. Social posts and driver chats can be useful early warnings, but they should not replace an official notice.',
          'For the return journey, build in more airport margin than you would from a city hotel. If heavy snow is forecast, discuss an earlier departure with the driver while alternatives still exist.'
        ]
      }
    ],
    note: 'Road conditions are live operational information. Always follow official restrictions and the instructions of police and road crews.',
    sources: [SOURCES.gudauri, SOURCES.roads]
  },
  {
    slug: 'ski-areas-explained',
    category: 'Slopes & lifts',
    title: 'Gudauri ski areas explained',
    excerpt: 'A clear guide to the lifts, zones and terrain for every level.',
    readTime: '10 min read',
    image: image('mosaic/tours-slope-1-117.png'),
    updated: 'Reviewed July 2026',
    lead: 'Gudauri is one connected mountain rather than a collection of separately ticketed resorts. The useful way to understand it is by elevation: learning areas near the village, broad mid-mountain pistes, higher alpine terrain and the lift link over the pass to Kobi.',
    sections: [
      {
        title: 'Village and learning areas',
        paragraphs: [
          'The lower resort begins at about 1,989 metres. Beginner terrain and meeting points are found around several base areas, including New Gudauri and the lower lifts. The easiest-looking piste on a map may still feel different in poor visibility, so new skiers should start with an instructor and confirm which learning lift is operating that day.',
          'If your group has mixed levels, agree on a named lift station or café for reunions. Mobile coverage and familiarity with place names should never be the only plan.'
        ]
      },
      {
        title: 'Mid-mountain is the everyday core',
        paragraphs: [
          'The GoodAura gondola and the main chairlifts feed the broad, open pistes that define Gudauri. With little tree cover, the terrain feels spacious and views are wide, but there is limited visual shelter in cloud or wind. Intermediate skiers usually find the greatest variety here.',
          'Piste colour indicates difficulty, not current surface quality. Ice, fresh snow, traffic and visibility can change how a marked run feels. Read signs at lift exits and do not assume yesterday’s route is open today.'
        ]
      },
      {
        title: 'High lifts change the character',
        paragraphs: [
          'Upper lifts reach alpine terrain near 3,276 metres. The altitude brings long views and access to more demanding pistes, while wind can affect operations quickly. Treat a closed gate or lift as a decision, not an invitation to find a way around it.',
          'The Kobi link crosses the main range and connects Gudauri with lifts descending toward the Kobi valley. It is a memorable journey, but returning depends on operating hours and weather. Check both Gudauri and Kobi status pages before committing to the far side.'
        ]
      },
      {
        title: 'Use the map as a live document',
        paragraphs: [
          'Published totals for pistes and lifts vary because sources count links, lift lines and prepared runs differently. For practical planning, the current official map and operating status matter more than a headline kilometre figure.',
          'Photograph the day’s map, note the last-lift times and keep enough margin to return to your base. Ski patrol instructions and on-mountain signs take priority over any saved map or third-party app.'
        ]
      }
    ],
    note: 'Lift openings are weather-dependent. Check both sides of the resort before setting out and respect all closures and patrol instructions.',
    sources: [SOURCES.gudauri, SOURCES.status, SOURCES.kobiStatus, SOURCES.mtaFaq]
  },
  {
    slug: 'where-to-eat',
    category: 'Food & places',
    title: 'Where to eat after the lifts close',
    excerpt: 'Mountain dishes, easy dinners and how to choose a table in Gudauri.',
    readTime: '7 min read',
    image: image('mosaic/places-1-154.png'),
    updated: 'Reviewed July 2026',
    lead: 'Gudauri’s food scene is seasonal: a venue can be busy in February and quiet outside peak weeks. Instead of relying on a permanent “best restaurants” ranking, choose by area, confirm the day’s hours and know which Georgian dishes suit the moment.',
    sections: [
      {
        title: 'Stay local on tired ski nights',
        paragraphs: [
          'New Gudauri has the densest walkable cluster of restaurants, cafés and bars. Central and upper Gudauri have hotel dining rooms and independent venues, but the mountain road and icy footpaths can make a short map distance inconvenient. On arrival, identify two nearby dinner options and ask your host which are genuinely open.',
          'Reserve dinner during New Year and peak winter weekends. For every other evening, a same-day call is usually more useful than an old online timetable. Ask whether the kitchen closes earlier than the bar.'
        ]
      },
      {
        title: 'Start with mountain classics',
        paragraphs: [
          'Khinkali — filled dumplings traditionally associated with Georgia’s mountain regions — are warming, filling and made for sharing. Meat is common, while potato, mushroom and cheese versions are also widely found. Khachapuri is cheese-filled bread with many regional styles; an Imeretian round or a boat-shaped Ajarian version can easily become a meal.',
          'Other useful orders for a group include lobio, a seasoned bean dish; pkhali, vegetables blended with walnuts and herbs; mtsvadi grilled meat; and fresh Georgian salads. Ask about walnut, dairy and gluten ingredients if anyone has allergies.'
        ]
      },
      {
        title: 'Match the meal to the day',
        paragraphs: [
          'A slope-side lunch is about location and speed: soup, bread, dumplings or a simple hot plate leave more time for skiing. Save the larger Georgian dinner for an evening when nobody needs to rush for a lift. Portions are often designed for the table, so order in stages rather than one dish per person.',
          'For families, check smoke exposure, high-chair availability and kitchen timing before sitting down. For groups, agree whether the bill will be shared and confirm any service charge shown on the menu.'
        ]
      },
      {
        title: 'Keep one flexible backup',
        paragraphs: [
          'Apartments with a small kitchen make breakfast and weather days easier. Buy basic groceries before the busiest evening, and keep a simple meal available in case snow or traffic makes a restaurant journey unattractive.',
          'Listings on My Gudauri are a starting point, not a guarantee of today’s hours or menu. Confirm directly with the venue, especially outside the core winter season.'
        ]
      }
    ],
    note: 'Venue hours, menus and prices change seasonally. Confirm directly before making a special journey; disclose allergies to the restaurant, not only to the booking platform.',
    sources: [SOURCES.cuisine, SOURCES.khinkali, SOURCES.gudauri]
  },
  {
    slug: 'freeride-safety',
    category: 'Safety',
    title: 'Freeride safety starts before the first run',
    excerpt: 'Guides, avalanche equipment and the decisions that make a great day safer.',
    readTime: '9 min read',
    image: image('mosaic/tours-riders-1-117.png'),
    updated: 'Reviewed July 2026',
    lead: 'Gudauri’s open terrain makes off-piste snow look close and inviting. The moment you leave a marked, open piste, however, you enter an uncontrolled mountain environment where avalanche, visibility, rocks and route-finding require different skills and equipment.',
    sections: [
      {
        title: 'Hire judgement, not just navigation',
        paragraphs: [
          'A qualified local mountain guide does more than show a line. They assess the group, recent weather, snowpack, exposure and escape options, then change the plan when those factors change. Ask about certification, group size, included safety equipment and the cancellation policy before booking.',
          'Be honest about your strongest controlled turn, fitness and previous off-piste experience. A route chosen for an imagined ability level is unsafe and rarely enjoyable.'
        ]
      },
      {
        title: 'Carry equipment you can actually use',
        paragraphs: [
          'For avalanche terrain, each person should normally carry a transceiver, probe and shovel and know how to use them. A helmet, charged phone, suitable clothing and basic first-aid supplies are part of the wider system, not substitutes for avalanche equipment or training.',
          'Complete a transceiver check before leaving. Practise companion rescue in a controlled area; an unfamiliar device discovered during an emergency is not a safety plan.'
        ]
      },
      {
        title: 'Closures are information',
        paragraphs: [
          'A closed lift, rope or piste may reflect wind, avalanche control, poor visibility or another operational hazard. Never cross a closure because tracks are visible on the other side. Previous descents do not prove that a slope is safe now.',
          'Tree-free terrain can become disorienting in cloud. Keep the group together, protect phone batteries from cold and establish what to do if anyone loses visual contact.'
        ]
      },
      {
        title: 'Know the emergency plan',
        paragraphs: [
          'Save Georgia’s single emergency number, 112. Before setting out, share the intended area and return time with someone not in the group. Know the name of the guide, the company and the insurance details that cover the planned activity.',
          'This guide is general preparation, not an avalanche forecast or route recommendation. Conditions must be assessed on the day by competent professionals using current local information.'
        ]
      }
    ],
    note: 'Off-piste skiing is never made risk-free by equipment or by following existing tracks. Use a qualified guide, train with your rescue kit and make conservative decisions.',
    sources: [SOURCES.winter, SOURCES.mtaFaq, SOURCES.emergency]
  },
  {
    slug: 'family-mountain-week',
    category: 'Families',
    title: 'A mountain week with children',
    excerpt: 'Lessons, easy slopes, warm breaks and practical childcare options.',
    readTime: '8 min read',
    image: image('service-real-estate.png'),
    updated: 'Reviewed July 2026',
    lead: 'A successful family week in Gudauri is measured less by kilometres skied than by warm hands, short transitions and children who want to return tomorrow. Base the plan near the meeting point, keep sessions age-appropriate and build in an indoor fallback.',
    sections: [
      {
        title: 'Choose convenience over the view',
        paragraphs: [
          'With children, a genuine short route to the learning area is worth more than a dramatic balcony. Ask where lessons meet, whether ski boots can be stored at ground level, and how the family gets home if the nearest lift closes. A kitchen or dependable breakfast also removes one daily decision.',
          'Check sleeping arrangements carefully: “four guests” may mean a sofa bed in the living space. Confirm cot, high-chair and laundry availability rather than assuming family facilities.'
        ]
      },
      {
        title: 'Keep lessons short and predictable',
        paragraphs: [
          'Book instruction near the start of the trip so children learn stopping, lift routines and slope etiquette before family ski days. Share age, experience, language and any additional needs with the school in advance. Confirm the meeting point with a map pin and arrive early enough for equipment adjustments.',
          'Young beginners often do better with a focused session and a warm break than a full day outside. End while confidence is still high. Never leave a child with a provider until identity, collection rules and contact details are clear.'
        ]
      },
      {
        title: 'Dress for stops as well as skiing',
        paragraphs: [
          'Use layers, waterproof outerwear, properly fitted helmets, goggles and more than one pair of gloves. Cold is often noticed first on a lift or during a queue. Keep a dry backup layer and snack accessible rather than back at the apartment.',
          'Altitude, sun and activity all increase the need for water and sun protection, even on cold days. Schedule a real lunch break and watch for fatigue before it becomes a fall or a meltdown.'
        ]
      },
      {
        title: 'Plan a weather day before you need it',
        paragraphs: [
          'Wind or poor visibility can reduce lift operations. Identify a pool, play space, relaxed lunch or scenic road stop in advance and confirm it is open to non-hotel guests. A flexible day is part of a mountain holiday, not a failed ski day.',
          'Save 112, accommodation and instructor contacts in both adults’ phones. Put a parent’s number in each child’s pocket and agree on one obvious meeting point for older children who ski independently.'
        ]
      }
    ],
    note: 'Lift access rules and children’s prices can change by season and ticket type. Verify current terms with the official operator before purchase.',
    sources: [SOURCES.gudauri, SOURCES.winter, SOURCES.mtaFaq, SOURCES.emergency]
  }
];
