export default async function handler(req, res) {
  const token = '4333453d-1b1c-4631-af54-2f24ad499fa9';
  const now = new Date();
  const end = now.toISOString().slice(0, 16).replace(/-|:|T/g, '');
  const start = new Date(now - 60*60*1000).toISOString().slice(0, 16).replace(/-|:|T/g, '');
  const url = `https://transparency.entsoe.eu/api?securityToken=${token}&documentType=A82&processType=A16&Area_Domain=10YES-REE------0&periodStart=${start}&periodEnd=${end}`;
  const response = await fetch(url);
  const xmlText = await response.text();
  // parseo rápido (extrae position y quantity)
  const matches = [...xmlText.matchAll(/<position>(\d+)<\/position>\s*<quantity>([\d\.]+)<\/quantity>/g)];
  const points = matches.map(m => ({ position: parseInt(m[1]), quantity: parseFloat(m[2]) }));
  const startDate = new Date(now.getTime() - 60*60*1000);
  const data = points.map(p => ({ time: new Date(startDate.getTime() + (p.position-1)*60000).toISOString(), frequency: p.quantity }));
  res.status(200).json(data);
}
