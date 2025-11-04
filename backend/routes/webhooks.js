import express from 'express';
import { getDB } from '../db.js';
import { ObjectId } from 'mongodb';

const router = express.Router();

router.get('/config/:serviceId', async (req, res) => {
  try {
    const db = getDB();
    const { serviceId } = req.params;

    const config = await db.collection('webhook_config')
      .findOne({ service_id: serviceId });

    res.json(config || {});
  } catch (error) {
    console.error('Error fetching webhook config:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/config/:serviceId', async (req, res) => {
  try {
    const db = getDB();
    const { serviceId } = req.params;

    const result = await db.collection('webhook_config').updateOne(
      { service_id: serviceId },
      { 
        $set: { 
          ...req.body,
          service_id: serviceId,
          updated_at: new Date()
        } 
      },
      { upsert: true }
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Error saving webhook config:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
