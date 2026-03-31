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
