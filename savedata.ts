//
// Adapted from https://github.com/Bellspringsteen/other.nyc/tree/master/NYCGOV/NYPD/nypdonline.org
//
import fs from 'fs';
import { ServerList, SummaryResponse } from './ServerSchema';
import { headers } from './headers';
import { asyncForEach } from 'modern-async';

const OneWeekMs = 7 * 24 * 60 * 60 * 1000;

const LIST_URL =
  'https://oip.nypdonline.org/api/reports/2/datasource/serverList?aggregate=&filter=&group=&platformFilters={"filters":[]}&page=';
const DETAIL_URL = 'https://oip.nypdonline.org/api/reports/';
const OFFICER_URL = 'https://oip.nypdonline.org/api/reports/1/datasource/list';
const LIST_OF_FILTERS = [
  2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 1027,
  1028, 1029, 1030, 1031, 1032, 1033, 1034, 1035, 1036, 1037, 2041, 2042,
];

async function fetchTaxids(page: number = 1, pageSize: number = 2000): Promise<string[]> {
  const url = LIST_URL + page + '&pageSize=' + pageSize;
  const serverlist = (await (await fetch(url, { headers: headers })).json()) as ServerList;
  const total = serverlist.Total;
  const taxlist = serverlist.Data.map((d) => d.RowValue);
  console.log('Total: ' + total + 'Taxlist: ' + taxlist.length);
  return page * pageSize >= total ? taxlist : taxlist.concat(await fetchTaxids(page + 1, pageSize));
}
async function getTaxids(cacheExpiryMs: number = OneWeekMs): Promise<string[]> {
  const fileName = './data/taxids.json';
  if (+Date.now() - fs.statSync(fileName).ctimeMs > cacheExpiryMs) {
    const taxids = await fetchTaxids();
    fs.writeFileSync(fileName, JSON.stringify(taxids));
    return taxids;
  }
  return JSON.parse(fs.readFileSync(fileName, 'utf8')) as string[];
}

async function fetchOfficeSummary(tax_id: string): Promise<Map<string, string>> {
  console.log('Fetching summary ' + tax_id);
  const body = JSON.stringify({ filters: [{ key: '@TAXID', label: 'TAXID', values: [tax_id] }] });
  const response = (await (await fetch(OFFICER_URL, { headers, method: 'POST', body })).json()) as SummaryResponse;
  const item = new Map<string, string>();
  response[0].Items.forEach((element) => {
    const label = element.Label.trim().replaceAll(' ', '').replaceAll(':', '');
    item.set(label, element.Value.trim());
  });
  item.set('TaxId', tax_id);
  item.set('Name', response[0].Label.trim());
  return item;
}

async function getOfficeSummary(tax_id: string, cacheExpiryMs: number = OneWeekMs): Promise<Map<string, string>> {
  const fileName = `./data/${tax_id}.json`;
  if (!fs.existsSync(fileName) || +Date.now() - fs.statSync(fileName).ctimeMs > cacheExpiryMs) {
    const summary = await fetchOfficeSummary(tax_id);
    fs.writeFileSync(fileName, JSON.stringify(Object.fromEntries(summary)));
    return summary;
  }
  const item = JSON.parse(fs.readFileSync(fileName, 'utf8')) as Object;
  return new Map<string, string>(Object.entries(item));
}

async function main() {
  fs.mkdirSync('./data', { recursive: true });
  const taxids = await getTaxids();
  await asyncForEach(
    taxids,
    async (v) => {
      await getOfficeSummary(v);
    },
    200,
  );
}

main();
