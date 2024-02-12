import 'dotenv/config';

if (!process.env.NYPD_COOKIE) {
  throw new Error('NYPD_COOKIE is not defined. Get one from https://nypdonline.org/');
}

export const headers = {
  accept: 'application/json, */*',
  'accept-language': 'en-US,en;q=0.9',
  'cache-control': 'no-cache',
  'content-type': 'application/json;charset=UTF-8',
  pragma: 'no-cache',
  'sec-ch-ua': '"Not A(Brand";v="99", "Microsoft Edge";v="121", "Chromium";v="121"',
  'sec-ch-ua-mobile': '?0',
  'sec-ch-ua-platform': '"Windows"',
  'sec-fetch-dest': 'empty',
  'sec-fetch-mode': 'cors',
  'sec-fetch-site': 'same-origin',
  cookie: process.env.NYPD_COOKIE!,
  Referer:
    'https://oip.nypdonline.org/view/1004/@SearchName=SEARCH_FILTER_VALUE&@LastNameFirstLetter=A//%7B%22hideMobileMenu%22:true%7D/true/true',
  'Referrer-Policy': 'no-referrer-when-downgrade',
};
