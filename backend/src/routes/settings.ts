import { Router } from 'express';
import { prisma } from '../prisma.js';

const router = Router();

router.get('/api/settings', async (req, res) => { 
  try {
    const settings = await prisma.settings.findFirst();
    res.status(200).json({data: settings?.maxHoursPerTeacher});
  } catch (err){
    console.log(err);
    res.status(500).json({error: "Sistemsel bir hata yaşandı. Lütfen daha sonra tekrar deneyiniz." });
  }
});

router.put('/api/settings', async (req, res) => {
  try {
    const { maxHoursPerTeacher } = req.body;

    if (typeof maxHoursPerTeacher !== 'number' || maxHoursPerTeacher < 1 || maxHoursPerTeacher > 40) {
    res.status(400).json({ error: 'Geçersiz değer.' });
    return;
  }

    const settings = await prisma.settings.upsert({
      where: { id: 1 },
      update: { maxHoursPerTeacher },
      create: { maxHoursPerTeacher },
    });
    res.status(200).json({data: settings.maxHoursPerTeacher});
  } catch (err){
    console.log(err);
    res.status(500).json({error: "Sistemsel bir hata yaşandı. Lütfen daha sonra tekrar deneyiniz." });
  }
});

export default router;