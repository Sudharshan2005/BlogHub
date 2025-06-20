import type { NextApiRequest, NextApiResponse } from 'next';

type ResponseData = {
  message: string;
  data?: any;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  switch (req.method) {
    case 'GET':
      res.status(200).json({ message: 'GET request received' });
      break;

    case 'POST':
      const postData = req.body;
      res.status(201).json({ message: 'POST request received', data: postData });
      break;

    case 'PUT':
      const putData = req.body;
      res.status(200).json({ message: 'PUT request received', data: putData });
      break;

    case 'DELETE':
      res.status(200).json({ message: 'DELETE request received' });
      break;

    case 'PATCH':
      const patchData = req.body;
      res.status(200).json({ message: 'PATCH request received', data: patchData });
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']);
      res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
}
