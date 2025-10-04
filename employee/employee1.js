document.addEventListener('DOMContentLoaded', () => {
    // Flag to check if there is new data to be "uploaded"
    window.hasUnsubmittedData = false; 

    // --- Helper function to create a new row element ---
    function createNewRow(data) {
        const tableBody = document.querySelector('table tbody');
        if (!tableBody) {
             console.error("Table body not found.");
             return;
        }

        // ⭐ CRITICAL FIX: Set initial status for a new submission from the form as 'Submitted' or 'Pending'
        // 'Submitted' is used here to represent a record that was just sent from the form page.
        const statusText = 'Submitted';
        const statusClass = statusText.toLowerCase();

        const row = document.createElement('tr');
        // Add class for styling/targeting
        row.classList.add('new-submission-item'); 
        
        // ⭐ CRITICAL FIX: Use 'data.currency' for the amount display,
        // and ensure 'data.employee' and 'data.paidBy' use the correct value from the form (which is the same person's name).
        row.innerHTML = `
            <td class="employee-col">${data.employee || 'N/A'}</td> 
            <td class="description-col">${data.description || 'N/A'}</td>
            <td class="date-col">${data.expenseDate || 'N/A'}</td>
            <td class="category-col">${data.category || 'N/A'}</td>
            <td class="paidby-col">${data.paidBy || 'N/A'}</td>
            <td class="remarks-col">${data.remarks || ''}</td>
            <td class="amount-col">${data.totalAmount || '0'} ${data.currency || '$'}</td>
            <td class="status-col">
                <span class="status ${statusClass}" data-status="${statusText}">
                    ${statusText}
                </span>
            </td>
        `;
        
        // Prepend the new row to the table body (adds it to the top)
        tableBody.prepend(row);
        // Mark that there's new data, ready for an eventual 'Upload' (which may change it to 'Pending' in this app's logic)
        window.hasUnsubmittedData = true; 

        // Re-attach status click listener to the new row's status element
        const newStatusEl = row.querySelector('.status');
        if (newStatusEl) {
             newStatusEl.addEventListener('click', handleStatusClick);
        }
    }

    // --- Status Click Handler (for existing and new rows) ---
    function handleStatusClick(event) {
        const statusEl = event.currentTarget;
        let currentStatus = statusEl.dataset.status;
        let newStatus;

        // Toggles between Draft and Submitted
        if (currentStatus === 'Draft') {
            newStatus = 'Submitted';
        } else if (currentStatus === 'Submitted') {
            newStatus = 'Draft';
        } else {
            // Do not allow toggling if it's 'Pending', 'Approved', etc.
            return; 
        }

        // Update the element's appearance
        statusEl.textContent = newStatus;
        statusEl.dataset.status = newStatus;
        statusEl.classList.remove(currentStatus.toLowerCase());
        statusEl.classList.add(newStatus.toLowerCase());
        
        // To maintain the correct visual styles from employee-1.css for 'Submitted'
        if (newStatus === 'Submitted') {
             statusEl.style.backgroundColor = ''; // Use CSS class styles
             statusEl.style.color = '';
        }
        
        // Note: Local storage saving is intentionally omitted here as per user request.
    }
    
    // Attach listener to all existing status elements
    document.querySelectorAll('.status').forEach(statusEl => {
        statusEl.addEventListener('click', handleStatusClick);
    });
    
    // --- Tab Switching & Navigation Logic ---
    const uploadTab = document.querySelector('.tab-button#upload-tab');
    const newTab = document.querySelector('.tab-button#new-tab');

    if (uploadTab && newTab) {
        // 1. New Tab: Redirects to the form page
        newTab.addEventListener('click', () => {
             // Visual tab switch
            document.querySelectorAll('.tab-button').forEach(t => t.classList.remove('active'));
            newTab.classList.add('active'); 
            
            // Redirect to the form page
            window.location.href = 'employee-2.html';
        });

        // 2. Upload Tab: Shows the success modal and handles data submission
        uploadTab.addEventListener('click', () => {
            // Visual tab switch
            document.querySelectorAll('.tab-button').forEach(t => t.classList.remove('active'));
            uploadTab.classList.add('active'); 
            
            showUploadSuccessModal();
            
            // Logic to visually mark new items as processed (e.g., changing status to 'Pending')
            if (window.hasUnsubmittedData) {
                document.querySelectorAll('.new-submission-item .status').forEach(statusEl => {
                    // Only change status if it's currently 'Submitted' (meaning just submitted from the form)
                    if (statusEl.dataset.status === 'Submitted') {
                         statusEl.textContent = 'Pending';
                         statusEl.dataset.status = 'Pending';
                         statusEl.classList.remove('submitted');
                         // Custom styling for 'Pending'
                         statusEl.style.backgroundColor = 'rgba(255, 165, 0, 0.2)'; // Orangeish for Pending
                         statusEl.style.color = 'orange';
                    }
                });
                window.hasUnsubmittedData = false;
            }
        });
    }

    /**
     * Shows the custom upload success message modal.
     */
    function showUploadSuccessModal() {
        let modalOverlay = document.querySelector('.modal-overlay');
        if (!modalOverlay) {
            // A basic modal structure is assumed to be missing, so it's created here.
            modalOverlay = document.createElement('div');
            modalOverlay.className = 'modal-overlay';
            modalOverlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background-color:rgba(0,0,0,0.85);display:none;justify-content:center;align-items:center;z-index:1000;';
            modalOverlay.innerHTML = `
                <div class="modal-content" style="background-color:var(--secondary-bg);border:1px solid var(--accent-color);border-radius:8px;padding:40px 60px;text-align:center;font-size:1.2em;font-weight:600;color:var(--accent-color);box-shadow:0 0 20px var(--accent-color);">
                    Your details have been successfully uploaded!
                </div>
            `;
            document.body.appendChild(modalOverlay);
        }
        modalOverlay.style.display = 'flex';

        // Hide the modal after 3 seconds
        setTimeout(() => {
            modalOverlay.style.display = 'none';
        }, 3000);
    }


    // --- Data Processing from URL Parameters (On Load) ---
    const urlParams = new URLSearchParams(window.location.search);
    
    if (urlParams.has('submitted')) {
        const formData = {
            employee: urlParams.get('employee'),
            description: urlParams.get('description'),
            expenseDate: urlParams.get('expenseDate'),
            category: urlParams.get('category'),
            paidBy: urlParams.get('paidBy'),
            remarks: urlParams.get('remarks'),
            totalAmount: urlParams.get('totalAmount'),
            currency: urlParams.get('currency'), // Capture the currency from the form
        };
        
        createNewRow(formData);
        
        // Clean the URL by redirecting without parameters to prevent re-filling on refresh
        window.history.replaceState({}, document.title, window.location.pathname);
    }
});