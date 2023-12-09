// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function handler(req, res) {
  var requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  
  fetch("URL/api/getFullDB", requestOptions)
    .then(response => response.json())
    .then(result => res.status(200).json({ result }))
    .catch(error => res.status(500).json({ error }))
}
