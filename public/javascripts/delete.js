// Function to fetch the index and return a Promise with the index value
async function fetchIndex(data) {
    try {
        const response = await fetch(`/getIndex`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        const res = await response.json();
        return res.index; // Return the index value from the Promise
    } catch (error) {
        console.error(error);
        return null; // Return null if there's an error
    }
}

// Function to handle the click event and use the fetched index value
async function handleClick(e) {
    const row = this.closest('tr');
    const cells = row.querySelectorAll("td");
    const type = cells[0].textContent.trim();
    const name = cells[1].textContent.trim();
    const amt = parseInt(cells[2].textContent.trim());
    const data = {
        expenseType: `${type}`,
        expenseName: `${name}`,
        amount: amt
    };
    
    try {
        const index = await fetchIndex(data); // Wait for the index value from fetchIndex
        console.log(index); // Log the fetched index value
        // Call another function or perform actions with the index value
        const response = await fetch(`/expenses/${index}`, {
            method: 'DELETE'
        });
        const res = await response.json();

        if (response.ok) {
            console.log(res.message); // Log success message
            // Handle success (e.g., update UI)
            window.location.reload()
        } else {
            console.error(res.error); // Log error message
            // Handle error (e.g., display error message to user)
        }
    } catch (error) {
        console.error('An error occurred:', error);
        // Handle network or other errors
    }
} 

document.addEventListener('DOMContentLoaded', function () {
    const deleteCategoryButtons = document.querySelectorAll('#delete-btn');

    deleteCategoryButtons.forEach(btn => {
        btn.addEventListener('click', handleClick); // Attach event listener
    });
});
