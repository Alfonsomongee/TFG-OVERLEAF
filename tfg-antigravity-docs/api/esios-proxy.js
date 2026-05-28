export default async function handler(req, res) {
  const { indicator } = req.query;
  const token = '59f41cbd500501a872390d7e3d838b29ea20b2e55b3fa96153adf270840b11f5';
  const url = `https://api.esios.ree.es/indicators/${indicator}`;
  const response = await fetch(url, { headers: { 'Accept': 'application/json', 'x-api-key': token } });
  const data = await response.json();
  const lastValue = data.indicator.values[data.indicator.values.length - 1]?.value;
  res.status(200).json({ indicator, value: lastValue });
}
