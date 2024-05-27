const con = require('../../Config/connection');

const dashboard = async (req, res) => {
  try {
    // Extract specific values from the received data
    const { surname, tableData, material } = req.body;
    const okValues = tableData.ok;
    const teeth = okValues[1]; // Assuming okValues is a flat array and you need the second value

    let teethcode;
    if (material === 'NEM' && teeth === 'KM') {
      // Construct SQL query to retrieve teeth code
      teethcode = 'SELECT * FROM Arbeitsart WHERE code = ?';

      // Execute the query to fetch teeth code
      con.query(teethcode, [teeth], (teethErr, teethResult) => {
        if (teethErr) {
          console.error('Error executing teeth query:', teethErr.message);
          return res.status(500).send('An error occurred while fetching teeth data');
        }

        // Check if teeth data is available
        if (teethResult.length === 0) {
          return res.status(404).send('Teeth data not found');
        }

        // Extract the teeth code from the result
        const teethCodeFromDB = teethResult[0].name;

        // Define codes for the subsequent query
        const codes = ['70732', 'N0010', 'N0023', 'N0051', 'N0120', '91012', '16202', 'N9700', 'N9330', '16203'];
        const placeholders = codes.map(() => '?').join(',');
        const sql = `SELECT * FROM Pricelist WHERE code IN (${placeholders})`;

        // Execute the query to fetch data from Pricelist table
        con.query(sql, codes, (err, results) => {
          if (err) {
            console.error('Error executing query:', err.message);
            return res.status(500).send('An error occurred while fetching data');
          }

          // Define quantities for each item
          const quantities = ['1,00', '2,00', '1,00', '1,00', '1,00', '1,00', '1,00', '1,00', '2,00', '2,00']; // Example quantities, adjust as necessary

          // Add quantity key to each object in the results array
          const resultsWithQuantity = results.map((item, index) => {
            return { ...item, quantity: quantities[index] };
          });

          // Calculate total price for each item
          const resultsWithTotalPrice = resultsWithQuantity.map(item => {
            const priceFloat = parseFloat(item.Price.replace('€', '').trim().replace(',', '.')); // Convert price to float
            const quantityFloat = parseFloat(item.quantity.replace(',', '.')); // Convert quantity to float
            const totalPrice = (isNaN(priceFloat) || isNaN(quantityFloat)) ? '' : (priceFloat * quantityFloat).toFixed(2); // Calculate total price
            return { ...item, total_price: totalPrice }; // Add total_price key to item
          });

          console.log({ Patient: surname, Arbeitsart: teethCodeFromDB, table_data: resultsWithTotalPrice });
          // Return the results with quantity and total price as JSON
          res.json({ Patient: surname, Arbeitsart: teethCodeFromDB, table_data: resultsWithTotalPrice });

        });
      });
    } else {
      return res.status(400).send('Invalid material or teeth parameters');
    }
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).send('An error occurred');
  }
};

module.exports = {
  dashboard,
};
