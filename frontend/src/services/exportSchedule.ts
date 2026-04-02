import type {ClassroomSchedule} from '../types';
import '../assets/fonts/Sarala-Regular';
import '../assets/fonts/Sarala-Bold';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const HOUR_COUNT = 8;
const DAYS = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma'];

export const exportSchedule = (schedule: ClassroomSchedule[]) => {

  const doc = new jsPDF();
  doc.setFont('Sarala-Regular', 'normal');
  const pageWidth = doc.internal.pageSize.getWidth();

  schedule.forEach((clss, index) => {
    if(index !== 0) doc.addPage();

    doc.setFontSize(14);
    doc.text(`Sınıf: ${clss.classroom}`, pageWidth /2, 15, {align: 'center'});

    const head = [['Saat', ...DAYS]];
    const body = Array.from({length: HOUR_COUNT}).map((_,hourIndex) => {
      const row = [`${hourIndex + 1}`];
      
      for(let dayIndex = 0; dayIndex < DAYS.length; dayIndex++) {
        const lessonIndex = dayIndex * hourIndex + hourIndex;
        const lesson = clss.lessons[lessonIndex];

        row.push(`${lesson.name}\n${lesson.branch}`);
      }
      return row;
    });

    autoTable(doc, {
      head,
      body,
      startY: 20,
      styles: {
        font: 'Sarala-Regular',
        fontSize: 8,
        cellPadding: 2,
        valign: 'middle',
        lineColor: [41, 128, 185], 
        lineWidth: 0.1,
      },
      headStyles: {
        font: 'Sarala-Bold',
        fontStyle: 'bold',
        fillColor: [41, 128, 185],
        textColor: 255,
        halign: 'center',
        lineWidth: 0.3,
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      columnStyles: {
        0: { halign: 'center' },
      },
    });

    autoTable(doc, {
      head: [['Ders', 'Öğretmen', 'H.D.S']],
      body: clss.teachers.map((t) => [
        t.branch,
        t.name,
        t.totalClasses.toString(),
      ]),
      startY: (doc as any).lastAutoTable.finalY + 10,
      styles: {
        font: 'Sarala-Regular',
        fontSize: 8,
        cellPadding: 2,
        lineColor: [41, 128, 185], 
        lineWidth: 0.1,
        valign: 'middle',
      },
      headStyles: {
        font: 'Sarala-Bold',
        fontStyle: 'bold',
        fillColor: [41, 128, 185],
        textColor: 255,
        lineWidth: 0.3,
        halign: 'center',
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      columnStyles: {
        2: { halign: 'center' },
      },
    });
    // need to find a way to deal with the any
  })

  doc.save('schedule.pdf');
}