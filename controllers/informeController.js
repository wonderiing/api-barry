import PDFDocument from "pdfkit";
import fs from "fs";
import express from "express";
import Expense from "../models/expenses.js";
import Incomes from "../models/incomes.js";
import Category from "../models/category.js";
import authMiddlware from '../middlewares/authMiddleware.js'
const router = express.Router();


export const generatePDF = (expenses, incomes, res, userId) => {
  const doc = new PDFDocument({
    margins: { top: 50, bottom: 50, left: 50, right: 50 },
    size: 'A4',
    autoFirstPage: true
  });
  
  // Setup event to number all pages after document is completed
  let pageCount = 0;
  doc.on('pageAdded', () => {
    pageCount++;
  });
  
  doc.pipe(res);
  
  // Colores
  const primaryColor = '#3366CC';
  const secondaryColor = '#6699CC';
  const textColor = '#333333';
  
  // Agregar un header con fecha actual
  const currentDate = new Date().toLocaleDateString();
  doc.fontSize(10).fillColor('#888888').text(`Generado el: ${currentDate}`, { align: 'right' });
  
  // Título principal
  doc.moveDown();
  doc.fontSize(24).fillColor(primaryColor).text("Reporte Financiero", { align: "center" });
  doc.moveDown();
  
  // Línea separadora
  doc.strokeColor(primaryColor).lineWidth(1)
    .moveTo(50, doc.y)
    .lineTo(doc.page.width - 50, doc.y)
    .stroke();
  doc.moveDown();
  
  // Función para crear una tabla simple con manejo de saltos de página
  const createTable = (headers, data, startY) => {
    const columnWidth = (doc.page.width - 100) / headers.length;
    let y = startY;
    
    // Encabezados de tabla
    doc.y = y;
    doc.fillColor(primaryColor);
    headers.forEach((header, i) => {
      doc.fontSize(12).text(header, 
        50 + (i * columnWidth), 
        y, 
        { width: columnWidth, align: 'left' }
      );
    });
    
    // Línea bajo encabezados
    y += 20;
    doc.strokeColor(secondaryColor).lineWidth(0.5)
      .moveTo(50, y)
      .lineTo(doc.page.width - 50, y)
      .stroke();
    
    // Datos de tabla
    doc.fillColor(textColor);
    data.forEach((row, rowIndex) => {
      // Check if we need a new page (leave room for row + some margin)
      if (y > doc.page.height - 100) {
        doc.addPage();
        // Reset y position for new page and redraw headers
        y = 50;
        
        // Redraw headers on new page
        doc.fillColor(primaryColor);
        headers.forEach((header, i) => {
          doc.fontSize(12).text(header, 
            50 + (i * columnWidth), 
            y, 
            { width: columnWidth, align: 'left' }
          );
        });
        
        // Línea bajo encabezados
        y += 20;
        doc.strokeColor(secondaryColor).lineWidth(0.5)
          .moveTo(50, y)
          .lineTo(doc.page.width - 50, y)
          .stroke();
          
        doc.fillColor(textColor);
      }
      
      y += 25;
      
      // Fondo alternado para filas
      if (rowIndex % 2 === 0) {
        doc.fillColor('#f8f8f8')
          .rect(50, y - 15, doc.page.width - 100, 25)
          .fill();
      }
      
      doc.fillColor(textColor);
      row.forEach((cell, i) => {
        doc.fontSize(10).text(cell, 
          50 + (i * columnWidth), 
          y - 12, 
          { width: columnWidth, align: 'left' }
        );
      });
    });
    
    return y + 25; // Retorna la posición Y final
  };
  
  // Sección de Ingresos
  doc.fontSize(16).fillColor(primaryColor).text("Ingresos", { underline: false });
  doc.moveDown(0.5);
  
  // Preparar datos para la tabla de ingresos
  const incomeHeaders = ["Fecha", "Descripción", "Monto"];
  const incomeData = incomes.map(income => [
    new Date(income.date).toLocaleDateString(),
    income.description || "Sin descripción",
    `$${parseFloat(income.mount).toFixed(2)}`
  ]);
  
  // Si no hay ingresos
  if (incomeData.length === 0) {
    doc.fontSize(12).fillColor(textColor).text("No hay registros de ingresos.", { italic: true });
    doc.moveDown();
  } else {
    // Crear tabla de ingresos
    const newY = createTable(incomeHeaders, incomeData, doc.y);
    doc.y = newY;
    
    // Calcular total de ingresos
    const totalIncome = incomes.reduce((sum, income) => sum + parseFloat(income.mount), 0);
    doc.moveDown();
    doc.fontSize(12).fillColor(primaryColor).text(`Total de Ingresos: $${totalIncome.toFixed(2)}`, { align: 'right' });
    doc.moveDown(2);
  }
  
  // Verificar si necesitamos una nueva página para los gastos
  if (doc.y > doc.page.height - 150) {
    doc.addPage();
  }
  
  // Sección de Gastos
  doc.fontSize(16).fillColor(primaryColor).text("Gastos", { underline: false });
  doc.moveDown(0.5);
  
  // Preparar datos para la tabla de gastos
  const expenseHeaders = ["Fecha", "Categoría", "Descripción", "Monto"];
  const expenseData = expenses.map(expense => [
    new Date(expense.date).toLocaleDateString(),
    expense.Category ? expense.Category.name : "Sin categoría",
    expense.description || "Sin descripción",
    `$${parseFloat(expense.mount).toFixed(2)}`
  ]);
  
  // Si no hay gastos
  if (expenseData.length === 0) {
    doc.fontSize(12).fillColor(textColor).text("No hay registros de gastos.", { italic: true });
    doc.moveDown();
  } else {
    // Crear tabla de gastos
    const newY = createTable(expenseHeaders, expenseData, doc.y);
    doc.y = newY;
    
    // Calcular total de gastos
    const totalExpense = expenses.reduce((sum, expense) => sum + parseFloat(expense.mount), 0);
    doc.moveDown();
    doc.fontSize(12).fillColor(primaryColor).text(`Total de Gastos: $${totalExpense.toFixed(2)}`, { align: 'right' });
    doc.moveDown(2);
  }
  
  // Resumen final
  if (incomes.length > 0 && expenses.length > 0) {
    const totalIncome = incomes.reduce((sum, income) => sum + parseFloat(income.mount), 0);
    const totalExpense = expenses.reduce((sum, expense) => sum + parseFloat(expense.mount), 0);
    const balance = totalIncome - totalExpense;
    
    // Verificar si necesitamos una nueva página para el resumen
    if (doc.y > doc.page.height - 150) {
      doc.addPage();
    }
    
    doc.moveDown();
    doc.strokeColor(primaryColor).lineWidth(1)
      .moveTo(50, doc.y)
      .lineTo(doc.page.width - 50, doc.y)
      .stroke();
    doc.moveDown();
    
    doc.fontSize(16).fillColor(primaryColor).text("Resumen", { align: "center" });
    doc.moveDown();
    
    // Tabla de resumen con alineación y posicionamiento adecuado
    const tableWidth = 300;
    const tableX = (doc.page.width - tableWidth) / 2;
    
    doc.fontSize(12).fillColor(textColor).text("Total de Ingresos:", tableX, doc.y, { width: 200, align: 'left' });
    doc.fontSize(12).fillColor(textColor).text(`$${totalIncome.toFixed(2)}`, tableX + 200, doc.y, { width: 100, align: 'right' });
    doc.moveDown();
    
    doc.fontSize(12).fillColor(textColor).text("Total de Gastos:", tableX, doc.y, { width: 200, align: 'left' });
    doc.fontSize(12).fillColor(textColor).text(`$${totalExpense.toFixed(2)}`, tableX + 200, doc.y, { width: 100, align: 'right' });
    doc.moveDown();
    
    const balanceColor = balance >= 0 ? '#009900' : '#CC0000';
    doc.fontSize(12).fillColor(textColor).text("Balance:", tableX, doc.y, { width: 200, align: 'left' });
    doc.fontSize(12).fillColor(balanceColor).text(`$${balance.toFixed(2)}`, tableX + 200, doc.y, { width: 100, align: 'right' });
  }
  
  // Add page numbers at the end
  let i = 0;
  doc.on('pageAdded', () => {
    const currentPage = i++;
    doc.switchToPage(currentPage);
    doc.fontSize(8).fillColor('#888888').text(
      `Página ${currentPage + 1}`,
      50,
      doc.page.height - 50,
      { align: 'center', width: doc.page.width - 100 }
    );
  });
  
  // End the document
  try {
    // Finalize the document and add page numbers
    doc.end();
    
    // Set appropriate headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename=report-${userId}.pdf`);
  } catch (error) {
    console.error("Error al cerrar el documento PDF:", error);
    res.status(500).send("Error al generar el PDF");
  }
};

router.use(authMiddlware)
// 📌 Endpoint para generar PDF de ingresos y gastos
router.get("/pdf/user/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    // Obtener gastos del usuario
    const expenses = await Expense.findAll({
      where: { user_id: userId },
      include: [{ model: Category, attributes: ["name"] }],
    });

    // Obtener ingresos del usuario
    const incomes = await Incomes.findAll({ where: { user_id: userId } });

    // 📄 Generar PDF y enviarlo
    generatePDF(expenses, incomes, res, userId);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al generar el reporte PDF" });
  }
});

export default router;
