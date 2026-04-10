/**
 * Google Apps Script to log order data from a React website.
 * 
 * INSTRUCTIONS:
 * 1. Create a new Google Sheet.
 * 2. Go to Extensions > Apps Script.
 * 3. Replace the existing code with this script.
 * 4. Click 'Deploy' > 'New Deployment'.
 * 5. Select 'Web App'.
 * 6. Execute as: 'Me'.
 * 7. Who has access: 'Anyone'.
 * 8. Copy the Web App URL and use it in your React app's checkout logic.
 */

function doPost(e) {
  // Use the active sheet (e.g., 'Sheet1')
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  
  // Set up header row if the sheet is empty
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Timestamp', 'Name', 'Email', 'Phone', 'Order Items', 'Customizations', 'Total Price']);
  }
  
  try {
    if (!e || !e.postData || !e.postData.contents) {
      throw new Error("No data received in POST request.");
    }
    
    var rawData = e.postData.contents;
    var data = JSON.parse(rawData);
    
    var timestamp = new Date();
    var name = data.name || "N/A";
    var email = data.email || "N/A";
    var phone = data.phone || "N/A";
    
    var items = (data.items || []).map(function(item) {
      return item.title + " (x" + (item.quantity || 1) + ")";
    }).join("\n");

    var customizations = (data.items || []).map(function(item) {
      var details = "";
      if (item.customizations) {
        var parts = [];
        if (item.customizations.riceSize) parts.push(item.customizations.riceSize);
        if (item.customizations.addons && item.customizations.addons.length > 0) {
          parts.push(item.customizations.addons.join(", "));
        }
        details = parts.join(" | ");
      }
      return item.title + ": " + (details || "Standard");
    }).join("\n");

    var totalPrice = data.totalPrice || "0";
    
    sheet.appendRow([timestamp, name, email, phone, items, customizations, totalPrice]);

    // --- EMAIL CONFIRMATION SYSTEM ---
    if (email !== "N/A") {
      try {
        var subject = "Order Confirmation - N2 High Protein Global Flavours";
        var body = "Hi " + name + ",\n\n" +
                   "Thank you for your order with N2! We've received your details and are preparing your high-protein meal.\n\n" +
                   "--- ORDER SUMMARY ---\n" +
                   items + "\n\n" +
                   "--- CUSTOMIZATIONS ---\n" +
                   customizations + "\n\n" +
                   "Total Price: $" + totalPrice + "\n\n" +
                   "--- COLLECTION DETAILS ---\n" +
                   "Date: Tomorrow (Next-day collection)\n" +
                   "Time: 11:00 AM – 3:00 PM\n" +
                   "Location: N2 Kiosk, NYP North Canteen\n\n" +
                   "If you haven't already, please ensure you've sent your payment screenshot to +65 8585 2055 via WhatsApp.\n\n" +
                   "Eat clean, stay lean!\n" +
                   "The N2 Team";
                   
        var htmlBody = "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;'>" +
                       "<h2 style='color: #00f1d9; border-bottom: 2px solid #00f1d9; padding-bottom: 10px;'>Order Received! 🍗</h2>" +
                       "<p>Hi <strong>" + name + "</strong>,</p>" +
                       "<p>Thank you for choosing <strong>N2</strong>. Your body will thank you for this clean fuel!</p>" +
                       "<div style='background: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;'>" +
                       "<h3>Order Summary</h3>" +
                       "<pre style='white-space: pre-wrap; font-family: inherit;'>" + items + "</pre>" +
                       "<h4>Customizations:</h4>" +
                       "<p style='font-size: 0.9em; color: #666;'>" + customizations.replace(/\n/g, '<br>') + "</p>" +
                       "<p style='font-size: 1.2em;'><strong>Total: $" + totalPrice + "</strong></p>" +
                       "</div>" +
                       "<div style='border-left: 4px solid #00f1d9; padding-left: 15px; margin: 20px 0;'>" +
                       "<h4>Collection Info</h4>" +
                       "<p><strong>When:</strong> Tomorrow (11 AM – 3 PM)<br>" +
                       "<strong>Where:</strong> N2 Kiosk, NYP North Canteen</p>" +
                       "</div>" +
                       "<p style='font-size: 0.9em; color: #888;'>Reminder: Please WhatsApp your payment screenshot to <strong>+65 8585 2055</strong> if you haven't done so.</p>" +
                       "<hr style='border: 0; border-top: 1px solid #eee; margin: 20px 0;'>" +
                       "<p style='text-align: center; color: #aaa; font-size: 0.8em;'>N2 - High Protein · Global Flavours · NYP North Canteen</p>" +
                       "</div>";

        MailApp.sendEmail({
          to: email,
          subject: subject,
          body: body,
          htmlBody: htmlBody
        });
      } catch (e) {
        Logger.log("Email failed: " + e.toString());
      }
    }
    // ---------------------------------
    
    return ContentService.createTextOutput(JSON.stringify({ "result": "success" }))
      .setMimeType(ContentService.MimeType.MIME_JSON);
      
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ "result": "error", "error": err.toString() }))
      .setMimeType(ContentService.MimeType.MIME_JSON);
  }
}

// Function to test connectivity
function doGet(e) {
  return ContentService.createTextOutput("GAS is active and ready to log orders.")
    .setMimeType(ContentService.MimeType.TEXT);
}
