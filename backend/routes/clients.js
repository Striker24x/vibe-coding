import express from 'express';
import { getDB } from '../db.js';
import { ObjectId } from 'mongodb';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const db = getDB();
    const clients = await db.collection('clients').find().toArray();
    res.json(clients);
  } catch (error) {
    console.error('Error fetching clients:', error);
    res.status(500).json({ error: 'Failed to fetch clients' });
  }
});

router.post('/', async (req, res) => {
  try {
    const db = getDB();
    const client = {
      ...req.body,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const result = await db.collection('clients').insertOne(client);
    res.status(201).json({ ...client, _id: result.insertedId });
  } catch (error) {
    console.error('Error creating client:', error);
    res.status(500).json({ error: 'Failed to create client' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;
    const updates = {
      ...req.body,
      updated_at: new Date().toISOString(),
    };

    const result = await db.collection('clients').updateOne(
      { _id: new ObjectId(id) },
      { $set: updates }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Client not found' });
    }

    res.json({ message: 'Client updated successfully' });
  } catch (error) {
    console.error('Error updating client:', error);
    res.status(500).json({ error: 'Failed to update client' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;

    const result = await db.collection('clients').deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Client not found' });
    }

    res.json({ message: 'Client deleted successfully' });
  } catch (error) {
    console.error('Error deleting client:', error);
    res.status(500).json({ error: 'Failed to delete client' });
  }
});

router.get('/:id/services', async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;
    const services = await db.collection('services').find({ client_id: id }).toArray();
    res.json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ error: 'Failed to fetch services' });
  }
});

router.get('/:id/metrics', async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;
    const metrics = await db.collection('system_metrics')
      .find({ client_id: id })
      .sort({ timestamp: -1 })
      .limit(100)
      .toArray();
    res.json(metrics);
  } catch (error) {
    console.error('Error fetching metrics:', error);
    res.status(500).json({ error: 'Failed to fetch metrics' });
  }
});

export default router;
