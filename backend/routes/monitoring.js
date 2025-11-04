import express from 'express';
import { getDB } from '../db.js';

const router = express.Router();

router.post('/data', async (req, res) => {
  try {
    const db = getDB();
    const data = {
      ...req.body,
      timestamp: new Date(),
    };

    const result = await db.collection('monitoring_data').insertOne(data);
    res.json({ success: true, id: result.insertedId });
  } catch (error) {
    console.error('Error saving monitoring data:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/data/latest', async (req, res) => {
  try {
    const db = getDB();
    const data = await db.collection('monitoring_data')
      .find()
      .sort({ timestamp: -1 })
      .limit(100)
      .toArray();

    res.json(data);
  } catch (error) {
    console.error('Error fetching monitoring data:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/services', async (req, res) => {
  try {
    const db = getDB();
    const services = await db.collection('services')
      .find()
      .toArray();

    res.json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/services', async (req, res) => {
  try {
    const db = getDB();
    const result = await db.collection('services').insertOne({
      ...req.body,
      createdAt: new Date(),
    });

    res.json({ success: true, id: result.insertedId });
  } catch (error) {
    console.error('Error creating service:', error);
    res.status(500).json({ error: error.message });
  }
});

router.put('/services/:id', async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;
    const { ObjectId } = await import('mongodb');

    const result = await db.collection('services').updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...req.body, updatedAt: new Date() } }
    );

    res.json({ success: true, modified: result.modifiedCount });
  } catch (error) {
    console.error('Error updating service:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/logs', async (req, res) => {
  try {
    const db = getDB();
    const logs = await db.collection('logs')
      .find()
      .sort({ timestamp: -1 })
      .limit(100)
      .toArray();

    res.json(logs);
  } catch (error) {
    console.error('Error fetching logs:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/logs', async (req, res) => {
  try {
    const db = getDB();
    const result = await db.collection('logs').insertOne({
      ...req.body,
      timestamp: new Date(),
    });

    res.json({ success: true, id: result.insertedId });
  } catch (error) {
    console.error('Error creating log:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/workflows', async (req, res) => {
  try {
    const db = getDB();
    const workflows = await db.collection('workflows')
      .find()
      .sort({ timestamp: -1 })
      .limit(50)
      .toArray();

    res.json(workflows);
  } catch (error) {
    console.error('Error fetching workflows:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/workflows', async (req, res) => {
  try {
    const db = getDB();
    const result = await db.collection('workflows').insertOne({
      ...req.body,
      timestamp: new Date(),
    });

    res.json({ success: true, id: result.insertedId });
  } catch (error) {
    console.error('Error creating workflow:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/config', async (req, res) => {
  try {
    const db = getDB();
    const config = await db.collection('config').findOne({ type: 'webhook' });

    res.json(config || {});
  } catch (error) {
    console.error('Error fetching config:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/config', async (req, res) => {
  try {
    const db = getDB();
    const result = await db.collection('config').updateOne(
      { type: 'webhook' },
      { $set: { ...req.body, updatedAt: new Date() } },
      { upsert: true }
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Error saving config:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
