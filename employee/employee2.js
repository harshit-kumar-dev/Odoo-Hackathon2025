document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('expenseForm');
    
    // ... (Attach Receipt Logic - kept as is) ...

    const attachButton = document.querySelector('.attach-button');
    const fileInput = document.createElement('input'); 
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';
    document.body.appendChild(fileInput); 
    
    let isReceiptAttached = false;

    if (attachButton && fileInput) {
        attachButton.addEventListener('click', (e) => {
            e.preventDefault();
            fileInput.click();
        });

        fileInput.addEventListener('change', () => {
            if (fileInput.files.length > 0) {
                isReceiptAttached = true;
                const fileName = fileInput.files[0].name;
                attachButton.textContent = `Attached: ${fileName}`;
                attachButton.style.backgroundColor = '#4CAF50'; 
            } else {
                isReceiptAttached = false;
                attachButton.textContent = 'Attach Receipt';
                attachButton.style.backgroundColor = '';
            }
        });
    }

    // --- Form Submission Logic: Passes data via URL parameters ---
    form.addEventListener('submit', function(event) {
        event.preventDefault();

        // Gather form data
        const description = document.getElementById('description').value;
        const expenseDate = document.getElementById('expenseDate').value;
        const category = document.getElementById('category').value;
        const totalAmount = document.getElementById('totalAmount').value;
        const paidBy = document.getElementById('paidBy').value;
        const remarks = document.getElementById('remarks').value;
        // ⭐ CRITICAL FIX: Get currency from the new select dropdown
        const currency = document.getElementById('currencySelect').value; // Get currency code
        
        
        // 1. UPDATE THE IN-PAGE APPROVAL MOCKUP (before redirecting)
        // Note: For a real application, the 'Approved' status would be set on a real submission/workflow event, 
        // but here we are mirroring the requested in-page update structure upon submission.

        // Get current time for "Approved" timestamp
        const now = new Date();
        const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        // The expense date is already in the form, just format it correctly if needed, but we'll use the form value for simplicity.
        const submittedDate = document.getElementById('expenseDate').value; 
        
        // Update the elements
        document.getElementById('approval-paid-by').textContent = `Approved by: ${paidBy}`;
        document.getElementById('approval-status').textContent = `Approved status by: Waiting approval`;
        document.getElementById('approval-timestamp').textContent = `Time: ${time} on ${submittedDate}`;

        // Also update the main workflow status for immediate feedback
        const activeStatus = document.querySelector('.workflow-status .active');
        if (activeStatus) {
            activeStatus.textContent = 'Waiting approval';
            activeStatus.style.color = 'var(--accent-color-blue)'; // Keep existing color
        }


        // 2. Prepare for redirection (adding to index file)

        // Encode data into URL parameters
        const params = new URLSearchParams();
        params.append('submitted', 'true');
        
        // Map Paid By to both 'employee' (for column 1) and 'paidBy' (for column 5)
        params.append('employee', paidBy);       // Maps to Employee column on index.html
        params.append('paidBy', paidBy);         // Maps to Paid By column on index.html

        params.append('description', description);
        params.append('expenseDate', expenseDate);
        params.append('category', category);
        params.append('totalAmount', totalAmount);
        params.append('currency', currency); // Pass the currency code (e.g., USD)
        params.append('remarks', remarks);
        params.append('receiptAttached', isReceiptAttached ? 'true' : 'false');

        // Redirect back to the index page with the new data
        // For testing the in-page update, you can comment this out temporarily, 
        // but the prompt requires redirection for adding to the index file.
        // For a seamless transition, you might want a small timeout here.
        setTimeout(() => {
            window.location.href = `employee1.html?${params.toString()}`;
        }, 500); // 500ms delay to see the update before redirect
    });
});