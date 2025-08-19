import { NextRequest, NextResponse } from 'next/server';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json();
    
    // Create new PDF document
    const doc = new jsPDF();
    
    // Add invoice header
    doc.setFontSize(20);
    doc.text('INVOICE', 20, 20);
    
    // Add company details
    doc.setFontSize(12);
    doc.text('NextShop', 20, 35);
    doc.text('123 Business Street', 20, 45);
    doc.text('City, State 12345', 20, 55);
    
    // Add invoice details
    doc.text(`Invoice #: ${orderData.id}`, 120, 35);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 120, 45);
    doc.text(`Due Date: ${new Date(Date.now() + 30*24*60*60*1000).toLocaleDateString()}`, 120, 55);
    
    // Add customer details
    doc.text('Bill To:', 20, 75);
    doc.text(orderData.shippingInfo.fullName, 20, 85);
    doc.text(orderData.shippingInfo.address, 20, 95);
    doc.text(`${orderData.shippingInfo.city}, ${orderData.shippingInfo.state} ${orderData.shippingInfo.pincode}`, 20, 105);
    
    // Create table data for items
    const tableData = orderData.items.map((item: any) => [
      item.title,
      item.quantity.toString(),
      `₹${item.price.toFixed(2)}`,
      `₹${(item.price * item.quantity).toFixed(2)}`
    ]);
    
    // Add table
    (doc as any).autoTable({
      head: [['Item', 'Qty', 'Price', 'Total']],
      body: tableData,
      startY: 120,
    });
    
    // Add totals
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.text(`Subtotal: ₹${orderData.total.toFixed(2)}`, 120, finalY);
    doc.text(`Delivery: ₹${orderData.deliveryCharges || 0}`, 120, finalY + 10);
    doc.text(`Total: ₹${(orderData.total + (orderData.deliveryCharges || 0)).toFixed(2)}`, 120, finalY + 20);
    
    // Generate PDF buffer
    const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
    
    // Return PDF with proper headers
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="invoice.pdf"',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    console.error('PDF Generation Error:', error);
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
  }
}
