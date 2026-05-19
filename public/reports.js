/**
 * reports.js
 * Handles CSV and Text report generations for active stock
 */

// 1. Export standard CSV file
function downloadCSV() {
    console.log("CSV Export Attempted...");
    const meds = window.allMeds || [];

    if (!meds || meds.length === 0) {
        if (typeof showToast === 'function') {
            showToast("Inventory is empty! Add medicines first.", "warning");
        } else {
            alert("Inventory is empty! Add medicines first.");
        }
        return;
    }

    try {
        const headers = ["Medicine Name", "Category", "Price ($)", "Stock Units", "Expiry Date"];
        const rows = meds.map(m => [
            `"${m.name.replace(/"/g, '""')}"`,
            `"${m.category.replace(/"/g, '""')}"`,
            m.price.toFixed(2),
            m.stock,
            m.expiryDate
        ]);

        const csvContent = [
            headers.join(","),
            ...rows.map(r => r.join(","))
        ].join("\n");

        // Force Excel compatibility UTF-8 BOM
        const blob = new Blob(["\ufeff" + csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        
        link.href = url;
        link.setAttribute("download", `pharma_inventory_${new Date().getTime()}.csv`);
        
        document.body.appendChild(link);
        link.click();
        
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        if (typeof showToast === 'function') {
            showToast("CSV file downloaded successfully!", "success");
        }
    } catch (err) {
        console.error("Export CSV Error:", err);
        if (typeof showToast === 'function') {
            showToast("Error generating CSV.", "error");
        }
    }
}

// 2. Export polished visual text report manifest
function exportInventoryReport() {
    console.log("Visual Report Export Attempted...");
    const meds = window.allMeds || [];

    if (!meds || meds.length === 0) {
        if (typeof showToast === 'function') {
            showToast("No stock data available to compile report.", "warning");
        } else {
            alert("No stock data available to compile report.");
        }
        return;
    }

    try {
        let totalItems = 0;
        let totalValue = 0;
        let lowStockCount = 0;
        let expiredCount = 0;

        const medsReport = meds.map((m, index) => {
            totalItems += m.stock;
            totalValue += m.stock * m.price;
            if (m.stock < 10) lowStockCount++;
            if (m.risk === 'expired') expiredCount++;

            return `${String(index + 1).padStart(3, '0')}. Name: ${m.name.padEnd(24, ' ')}
     Category: ${m.category.padEnd(16, ' ')} | Price: $${m.price.toFixed(2).padEnd(8, ' ')}
     Stock Status: ${String(m.stock).padStart(4, ' ')} Units   | Expiration: ${m.expiryDate}
     -----------------------------------------------------------------`;
        }).join("\n");

        let reportText = `=================================================================
                     PHARMANET PRO STOCK REPORT
=================================================================
Generated On: ${new Date().toLocaleString()}
Duty Operator: Local License Level-1 System
-----------------------------------------------------------------
SUMMARY INSIGHTS:
* Total Distinct Medicines: ${meds.length}
* Gross Unit Stock:         ${totalItems} units
* Gross Shelf Capital:      $${totalValue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
* Low Stock Warnings:       ${lowStockCount} items
* Expired Warnings:         ${expiredCount} items
=================================================================
DETAILED MANIFEST:
=================================================================
${medsReport}
=================================================================
                     END OF SHIFT SYSTEM REPORT
=================================================================`;

        const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        
        link.href = url;
        link.download = `Inventory_Manifest_${new Date().toISOString().split('T')[0]}.txt`;
        
        document.body.appendChild(link);
        link.click();
        
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        if (typeof showToast === 'function') {
            showToast("System report downloaded!", "success");
        }
    } catch (err) {
        console.error("Export Report Error:", err);
        if (typeof showToast === 'function') {
            showToast("Error generating text report.", "error");
        }
    }
}

// Attach globally
window.downloadCSV = downloadCSV;
window.exportInventoryReport = exportInventoryReport;
