import { PrismaClient } from '@prisma/client';
import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

const prisma = new PrismaClient();
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

const USER_ID = 1;

interface Badge {
  badgeId: number; // O tipo deve corresponder ao tipo no banco de dados
}

app.get('/api/getCollectedBadges', async (req: Request, res: Response) => {
  try {
    const badges: Badge[] = await prisma.collectedBadges.findMany({
      where: {
        userId: USER_ID,
      },
      select: {
        badgeId: true,
      },
    });

    const dateC = (d: number) => badges.filter((badge) => badge.badgeId === d).length;

    const collected = {
      m: dateC(1),
      t: dateC(2),
      w: dateC(3),
      th: dateC(4),
      f: dateC(5),
      s: dateC(6),
      su: dateC(7),
    };

    res.json({ collected });
  } catch (error) {
    console.error('Error fetching collected badges:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.post('/api/collect', async (req: Request, res: Response) => {
  try {
    const testDate = new Date('2024-08-03T10:00:00Z'); // Exemplo: 30 de julho de 2024 às 10:00 UTC

    // Use a data de teste em vez da data atual
    const serverDate = testDate;
    const dayNumber = serverDate.getDay() === 0 ? 7 : serverDate.getDay();

    const lastCollected = await prisma.users.findUnique({
      where: { id: USER_ID },
    });

    let lastCollectedDate = new Date();

    if (lastCollected?.lastBadgeId) {
      const data = await prisma.collectedBadges.findUnique({
        where: { id: lastCollected.lastBadgeId },
      });

      if (data) {
        lastCollectedDate = new Date(data.collectedAt);
      }
    } else {
      const data = await prisma.collectedBadges.create({
        data: {
          userId: USER_ID,
          badgeId: dayNumber,
          collectedAt: serverDate, // Adicione a data de coleta
        },
      });

      await prisma.users.update({
        where: { id: USER_ID },
        data: {
          lastBadgeId: data.id,
        },
      });

      return res.json({ collected: true });
    }

    if (
      lastCollectedDate.getDate() === serverDate.getDate() &&
      lastCollectedDate.getMonth() === serverDate.getMonth() &&
      lastCollectedDate.getFullYear() === serverDate.getFullYear()
    ) {
      return res.json({ collected: false });
    } else {
      const data = await prisma.collectedBadges.create({
        data: {
          userId: USER_ID,
          badgeId: dayNumber,
          collectedAt: serverDate, 
        },
      });

      await prisma.users.update({
        where: { id: USER_ID },
        data: {
          lastBadgeId: data.id,
        },
      });

      return res.json({ collected: true });
    }
  } catch (error) {
    console.error('Error collecting badge:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
