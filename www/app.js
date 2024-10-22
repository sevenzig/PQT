const { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } = Recharts;
const { Menu, LayoutDashboard, Building, ShoppingBag, FileText, CheckCircle, Search } = lucide;

const DashboardLayout = () => {
  const purityData = [
    { description: 'Activity**', specification: 'NLT 66.66B CFU/GM', result: '203B CFU/GM', method: 'Enumeration', passFail: 'Pass' },
    { description: 'Coliforms', specification: '<100 CFU/GM', result: '<100 CFU/GM', method: 'AOAC 991.14', passFail: 'Pass' },
    { description: 'E. Coli', specification: 'Negative/10GM', result: 'Negative/10GM', method: 'AOAC 991.14', passFail: 'Pass' },
    { description: 'Yeast', specification: '<1,000 CFU/GM', result: '<100 CFU/GM', method: 'AOAC 997.02/AOAC 2014.05', passFail: 'Pass' },
    { description: 'Mold', specification: '<1,000 CFU/GM', result: '<100 CFU/GM', method: 'AOAC 997.02/AOAC 2014.05', passFail: 'Pass' },
  ];

  const activityData = [
    { time: '0h', lacticAcid: 0.03, pH: 6.7 },
    { time: '4h', lacticAcid: 0.25, pH: 5.5 },
    { time: '6h', lacticAcid: 0.4, pH: 4.7 },
    { time: '8h', lacticAcid: 1, pH: 4.3 },
    { time: '12h', lacticAcid: 1.56, pH: 3.9 },
  ];

  const potencyData = [
    { strain: 'L. acidophilus (LA-1)', expected: 10, tested: 15 },
    { strain: 'B. lactis (BL-04)', expected: 10, tested: 12 },
    { strain: 'L. rhamnosus (LR-32)', expected: 2, tested: 3.5 },
    { strain: 'L. paracasei (LPC-37)', expected: 5, tested: 7 },
    { strain: 'B. lactis (Bi-07)', expected: 3, tested: 3 },
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md p-4 flex justify-between items-center">
        <div className="w-40 h-10 bg-gray-300 flex items-center justify-center text-gray-600">Logo Placeholder</div>
        <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 w-1/3">
          <Search className="text-gray-400 mr-2" />
          <input type="text" placeholder="Search" className="bg-transparent outline-none w-full" />
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-16 bg-green-600 text-white shadow-md z-10">
          <nav className="flex flex-col items-center py-4">
            <button className="p-3 mb-4 hover:bg-green-700 rounded-full"><Menu size={24} /></button>
            <button className="p-3 mb-4 hover:bg-green-700 rounded-full"><LayoutDashboard size={24} /></button>
            <button className="p-3 mb-4 hover:bg-green-700 rounded-full"><Building size={24} /></button>
            <button className="p-3 mb-4 hover:bg-green-700 rounded-full"><ShoppingBag size={24} /></button>
            <button className="p-3 hover:bg-green-700 rounded-full"><FileText size={24} /></button>
          </nav>
        </div>

        {/* Quick Summary Sidebar */}
        <div className="w-72 bg-white shadow-md p-6 overflow-auto">
          <h2 className="text-xl font-medium mb-6 text-gray-800">Lot Summary</h2>
          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-1">Overall Pass Rate</p>
            <p className="text-3xl font-light text-green-600">100%</p>
          </div>
          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-1">Purity Pass Rate</p>
            <p className="text-xl font-light text-green-600">100%</p>
          </div>
          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-1">Activity Pass Rate</p>
            <p className="text-xl font-light text-green-600">100%</p>
          </div>
          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-1">Potency Pass Rate</p>
            <p className="text-xl font-light text-green-600">100%</p>
          </div>
          <div className="bg-green-100 rounded-lg p-4 mb-6" role="alert">
            <p className="text-green-800 font-medium">No warnings for this lot</p>
          </div>
          <div>
            <h3 className="font-medium mb-3 text-gray-800">Lot Details</h3>
            <p className="text-sm mb-1">Lot Number: 07231A</p>
            <p className="text-sm mb-1">Production Date: [Not provided]</p>
            <p className="text-sm">Expiration Date: [Not provided]</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8 overflow-auto">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h1 className="text-2xl font-medium mb-2 text-gray-800">Master Supplements - Theralac</h1>
            <h2 className="text-xl font-medium mb-4 text-gray-600">Lot #07231A</h2>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-medium mb-4 text-gray-800">Purity Test Results</h2>
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="p-2 text-left font-medium text-gray-600">Description</th>
                  <th className="p-2 text-left font-medium text-gray-600">Specification</th>
                  <th className="p-2 text-left font-medium text-gray-600">Result</th>
                  <th className="p-2 text-left font-medium text-gray-600">Method</th>
                  <th className="p-2 text-left font-medium text-gray-600">Pass/Fail</th>
                </tr>
              </thead>
              <tbody>
                {purityData.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-2">{item.description}</td>
                    <td className="p-2">{item.specification}</td>
                    <td className="p-2">{item.result}</td>
                    <td className="p-2">{item.method}</td>
                    <td className="p-2">
                      {item.passFail === 'Pass' ? (
                        <CheckCircle className="text-green-600" />
                      ) : (
                        <span className="text-red-500">Fail</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-medium mb-4 text-gray-800">Activity Test Results</h2>
            <div className="flex justify-center">
              <LineChart width={500} height={300} data={activityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis yAxisId="left" orientation="left" stroke="#4CAF50" />
                <YAxis yAxisId="right" orientation="right" stroke="#2196F3" />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="lacticAcid" stroke="#4CAF50" name="% Lactic Acid" />
                <Line yAxisId="right" type="monotone" dataKey="pH" stroke="#2196F3" name="pH" />
              </LineChart>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-medium mb-4 text-gray-800">Potency Test Results</h2>
            <BarChart width={600} height={300} data={potencyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="strain" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="expected" fill="#4CAF50" name="Expected CFU (billion)" />
              <Bar dataKey="tested" fill="#2196F3" name="Tested CFU (billion)" />
            </BarChart>
            <div className="mt-4">
              <p className="font-medium text-gray-800">Total CFU:</p>
              <p>Expected: 30 billion</p>
              <p>Tested: 40.5 billion</p>
              <p>3 Months: 38 billion</p>
              <p>6 Months: 35 billion</p>
              <p>12 Months: 34 billion</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

ReactDOM.render(<DashboardLayout />, document.getElementById('root'));