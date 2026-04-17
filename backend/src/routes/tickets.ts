import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

const router = Router();

const tickets = new Map();

router.post('/validate', [
  body('qrCode').notEmpty()
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { qrCode } = req.body;
    
    const existingTicket = tickets.get(qrCode);
    if (existingTicket) {
      return res.json({ 
        success: true, 
        data: { 
          valid: existingTicket.status === 'valid',
          ticket: existingTicket
        } 
      });
    }

    const newTicket = {
      ticketId: qrCode,
      eventId: 'EVENT-001',
      qrCode,
      seatInfo: { section: 'A', row: '1', seat: '12' },
      status: 'valid',
      purchaseDate: new Date(),
      eventDate: new Date()
    };
    
    tickets.set(qrCode, newTicket);

    res.json({ success: true, data: { valid: true, ticket: newTicket } });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Ticket validation failed' });
  }
});

router.get('/:ticketId', async (req: Request, res: Response) => {
  try {
    const { ticketId } = req.params;
    const ticket = tickets.get(ticketId);

    if (!ticket) {
      return res.status(404).json({ success: false, error: 'Ticket not found' });
    }

    res.json({ success: true, data: ticket });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to get ticket' });
  }
});

export default router;
