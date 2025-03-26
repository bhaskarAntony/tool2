import jsPDF from 'jspdf';
import 'jspdf-autotable';

const generatePDF = (weapon) => {
  const doc = new jsPDF();

  // Title
  doc.setFontSize(18);
  doc.text(`Weapon Details Report`, 105, 15, null, null, 'center');

  // Officer Information
  doc.setFontSize(12);
  const officerInfo = [
    ['Officer Name', weapon.officer?.name || 'N/A'],
    ['Metal No', weapon.officer?.metalNo || 'N/A'],
    ['Rank', weapon.officer?.rank || 'N/A'],
    ['Duty', weapon.officer?.duty || 'N/A'],
    ['Status', weapon.officer?.status || 'N/A'],
    ['Issue Date', weapon.issueDate ? new Date(weapon.issueDate).toLocaleDateString() : 'N/A'],
    ['Return Date', weapon.returnDate ? new Date(weapon.returnDate).toLocaleDateString() : 'N/A'],
    ['Weapons', weapon.weapons?.map(w => w.type).join(', ') || 'N/A'],
  ];

  doc.autoTable({
    startY: 25,
    head: [['Field', 'Details']],
    body: officerInfo,
    theme: 'grid',
  });

  // Save the PDF
  doc.save(`${weapon.officer?.name || 'Officer'}_weapon_details.pdf`);
};

export default generatePDF;
